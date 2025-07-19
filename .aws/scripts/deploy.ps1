#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Dynamic Terraform deployment script for Bookie SaaS platform
.DESCRIPTION
    This script handles deployment across different environments with automatic
    resource conflict resolution and platform-specific configurations.
.PARAMETER Environment
    Target environment (dev, staging, prod)
.PARAMETER Action
    Action to perform (plan, apply, destroy, import, validate)
.PARAMETER AutoImport
    Automatically import existing resources if conflicts are detected
.PARAMETER ForceNew
    Force creation of new resources (skip import attempts)
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("plan", "apply", "destroy", "import", "validate", "init")]
    [string]$Action,
    
    [switch]$AutoImport,
    [switch]$ForceNew,
    [switch]$Verbose
)

# Configuration
$script:Config = @{
    BucketPrefix = "bookie-dev"  # You may want to make this environment-specific
    Region = "us-east-1"         # Default region
    TerraformDir = Join-Path $PSScriptRoot "..\workspaces\services\$Environment"
}

# Environment-specific configurations
$script:EnvConfigs = @{
    dev = @{
        Region = "us-east-1"
        BucketPrefix = "bookie-dev"
        ImportExisting = $true
        PreventDestroy = $false
    }
    staging = @{
        Region = "us-east-1"
        BucketPrefix = "bookie-staging"
        ImportExisting = $true
        PreventDestroy = $true
    }
    prod = @{
        Region = "us-east-1"
        BucketPrefix = "bookie-prod"
        ImportExisting = $true
        PreventDestroy = $true
    }
}

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("Info", "Warning", "Error", "Success")]
        [string]$Level = "Info"
    )
    
    $colors = @{
        Info = "White"
        Warning = "Yellow"
        Error = "Red"
        Success = "Green"
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $colors[$Level]
}

function Test-TerraformInstalled {
    try {
        $null = Get-Command terraform -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Test-AWSCLIInstalled {
    try {
        $null = Get-Command aws -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Initialize-Environment {
    Write-Log "Initializing deployment environment: $Environment" "Info"
    
    # Validate prerequisites
    if (-not (Test-TerraformInstalled)) {
        Write-Log "Terraform is not installed or not in PATH" "Error"
        exit 1
    }
    
    if (-not (Test-AWSCLIInstalled)) {
        Write-Log "AWS CLI is not installed or not in PATH" "Error"
        exit 1
    }
    
    # Set working directory
    if (-not (Test-Path $script:Config.TerraformDir)) {
        Write-Log "Terraform directory not found: $($script:Config.TerraformDir)" "Error"
        exit 1
    }
    
    Set-Location $script:Config.TerraformDir
    Write-Log "Working directory: $(Get-Location)" "Info"
    
    # Update config with environment-specific settings
    $envConfig = $script:EnvConfigs[$Environment]
    $script:Config.Region = $envConfig.Region
    $script:Config.BucketPrefix = $envConfig.BucketPrefix
}

function Invoke-TerraformInit {
    Write-Log "Initializing Terraform..." "Info"
    
    $initArgs = @("init")
    if ($Verbose) { $initArgs += "-verbose" }
    
    & terraform @initArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Terraform init failed" "Error"
        exit 1
    }
    
    Write-Log "Terraform initialized successfully" "Success"
}

function Test-ResourceConflicts {
    Write-Log "Checking for existing resources..." "Info"
    
    $conflicts = @()
    $bucketName = "$($script:Config.BucketPrefix)-$Environment"
    $oacName = "$Environment-oac"
    
    # Check S3 bucket
    try {
        aws s3api head-bucket --bucket $bucketName --region $script:Config.Region 2>$null
        if ($LASTEXITCODE -eq 0) {
            $conflicts += @{
                Type = "S3Bucket"
                Name = $bucketName
                ResourceAddress = "module.web.aws_s3_bucket.service_bucket[0]"
            }
            Write-Log "Found existing S3 bucket: $bucketName" "Warning"
        }
    }
    catch {
        # Bucket doesn't exist, which is fine
    }
    
    # Check CloudFront OAC
    try {
        $oacResult = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='$oacName'].Id | [0]" --output text 2>$null
        if ($oacResult -and $oacResult -ne "None") {
            $conflicts += @{
                Type = "CloudFrontOAC"
                Name = $oacName
                Id = $oacResult
                ResourceAddress = "module.web.aws_cloudfront_origin_access_control.oac[0]"
            }
            Write-Log "Found existing CloudFront OAC: $oacName (ID: $oacResult)" "Warning"
        }
    }
    catch {
        # OAC doesn't exist, which is fine
    }
    
    return $conflicts
}

function Import-ExistingResources {
    param([array]$Conflicts)
    
    if ($Conflicts.Count -eq 0) {
        Write-Log "No resource conflicts detected" "Success"
        return $true
    }
    
    Write-Log "Importing $($Conflicts.Count) existing resource(s)..." "Info"
    
    foreach ($conflict in $Conflicts) {
        Write-Log "Importing $($conflict.Type): $($conflict.Name)" "Info"
        
        $importId = if ($conflict.Id) { $conflict.Id } else { $conflict.Name }
        
        & terraform import $conflict.ResourceAddress $importId
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Successfully imported $($conflict.Type): $($conflict.Name)" "Success"
        } else {
            Write-Log "Failed to import $($conflict.Type): $($conflict.Name)" "Warning"
            # Continue with other imports
        }
    }
    
    return $true
}

function Invoke-TerraformPlan {
    Write-Log "Running Terraform plan..." "Info"
    
    $planArgs = @("plan")
    
    # Add environment-specific variables
    $envConfig = $script:EnvConfigs[$Environment]
    $planArgs += "-var", "env=$Environment"
    $planArgs += "-var", "region=$($script:Config.Region)"
    $planArgs += "-var", "bucket_name_prefix=$($script:Config.BucketPrefix)"
    $planArgs += "-var", "import_existing_resources=$($envConfig.ImportExisting)"
    $planArgs += "-var", "prevent_destroy=$($envConfig.PreventDestroy)"
    
    if ($Verbose) { $planArgs += "-verbose" }
    
    & terraform @planArgs
    
    return $LASTEXITCODE -eq 0
}

function Invoke-TerraformApply {
    Write-Log "Running Terraform apply..." "Info"
    
    $applyArgs = @("apply")
    
    # Add environment-specific variables
    $envConfig = $script:EnvConfigs[$Environment]
    $applyArgs += "-var", "env=$Environment"
    $applyArgs += "-var", "region=$($script:Config.Region)"
    $applyArgs += "-var", "bucket_name_prefix=$($script:Config.BucketPrefix)"
    $applyArgs += "-var", "import_existing_resources=$($envConfig.ImportExisting)"
    $applyArgs += "-var", "prevent_destroy=$($envConfig.PreventDestroy)"
    
    # Auto-approve for non-production or if explicitly requested
    if ($Environment -eq "dev" -or $Environment -eq "staging") {
        $applyArgs += "-auto-approve"
    }
    
    if ($Verbose) { $applyArgs += "-verbose" }
    
    & terraform @applyArgs
    
    return $LASTEXITCODE -eq 0
}

function Invoke-TerraformDestroy {
    Write-Log "Running Terraform destroy..." "Warning"
    
    if ($Environment -eq "prod") {
        Write-Log "Destroy operation on production requires manual confirmation" "Warning"
        $confirmation = Read-Host "Type 'DESTROY' to confirm destruction of production resources"
        if ($confirmation -ne "DESTROY") {
            Write-Log "Destroy operation cancelled" "Info"
            return $false
        }
    }
    
    $destroyArgs = @("destroy")
    
    # Add environment-specific variables
    $envConfig = $script:EnvConfigs[$Environment]
    $destroyArgs += "-var", "env=$Environment"
    $destroyArgs += "-var", "region=$($script:Config.Region)"
    $destroyArgs += "-var", "bucket_name_prefix=$($script:Config.BucketPrefix)"
    $destroyArgs += "-var", "import_existing_resources=$($envConfig.ImportExisting)"
    $destroyArgs += "-var", "prevent_destroy=$false"  # Override for destroy
    
    if ($Environment -ne "prod") {
        $destroyArgs += "-auto-approve"
    }
    
    if ($Verbose) { $destroyArgs += "-verbose" }
    
    & terraform @destroyArgs
    
    return $LASTEXITCODE -eq 0
}

# Main execution
try {
    Write-Log "=== Bookie SaaS Platform Deployment ===" "Info"
    Write-Log "Environment: $Environment" "Info"
    Write-Log "Action: $Action" "Info"
    
    Initialize-Environment
    
    switch ($Action) {
        "init" {
            Invoke-TerraformInit
        }
        
        "validate" {
            Invoke-TerraformInit
            & terraform validate
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Terraform configuration is valid" "Success"
            } else {
                Write-Log "Terraform configuration validation failed" "Error"
                exit 1
            }
        }
        
        "import" {
            Invoke-TerraformInit
            $conflicts = Test-ResourceConflicts
            if ($conflicts.Count -gt 0) {
                Import-ExistingResources -Conflicts $conflicts
            } else {
                Write-Log "No resources to import" "Info"
            }
        }
        
        "plan" {
            Invoke-TerraformInit
            
            if (-not $ForceNew) {
                $conflicts = Test-ResourceConflicts
                if ($conflicts.Count -gt 0) {
                    if ($AutoImport) {
                        Import-ExistingResources -Conflicts $conflicts
                    } else {
                        Write-Log "Resource conflicts detected. Use -AutoImport to resolve automatically or run with action 'import' first." "Warning"
                        foreach ($conflict in $conflicts) {
                            Write-Log "  - $($conflict.Type): $($conflict.Name)" "Warning"
                        }
                    }
                }
            }
            
            if (-not (Invoke-TerraformPlan)) {
                Write-Log "Terraform plan failed" "Error"
                exit 1
            }
        }
        
        "apply" {
            Invoke-TerraformInit
            
            if (-not $ForceNew) {
                $conflicts = Test-ResourceConflicts
                if ($conflicts.Count -gt 0) {
                    if ($AutoImport) {
                        Import-ExistingResources -Conflicts $conflicts
                    } else {
                        Write-Log "Resource conflicts detected. Use -AutoImport to resolve automatically." "Error"
                        exit 1
                    }
                }
            }
            
            if (-not (Invoke-TerraformApply)) {
                Write-Log "Terraform apply failed" "Error"
                exit 1
            }
            
            Write-Log "Deployment completed successfully!" "Success"
        }
        
        "destroy" {
            Invoke-TerraformInit
            
            if (-not (Invoke-TerraformDestroy)) {
                Write-Log "Terraform destroy failed" "Error"
                exit 1
            }
            
            Write-Log "Resources destroyed successfully!" "Success"
        }
    }
}
catch {
    Write-Log "Deployment script failed: $($_.Exception.Message)" "Error"
    exit 1
}
