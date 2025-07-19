#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Import existing AWS resources into Terraform state
.DESCRIPTION
    This script helps import existing S3 buckets and CloudFront resources into Terraform state
    to prevent "already exists" errors during deployment.
.PARAMETER Environment
    The environment (dev, staging, prod)
.PARAMETER BucketPrefix
    The S3 bucket name prefix
.PARAMETER Region
    AWS region
.PARAMETER DryRun
    Show what would be imported without actually importing
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$BucketPrefix,
    
    [Parameter(Mandatory=$true)]
    [string]$Region,
    
    [switch]$DryRun
)

# Set working directory to the environment folder
$envPath = Join-Path $PSScriptRoot "..\workspaces\services\$Environment"
Set-Location $envPath

$bucketName = "$BucketPrefix-$Environment"
$oacName = "$Environment-oac"

Write-Host "=== Terraform Resource Import Script ===" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Bucket: $bucketName" -ForegroundColor Yellow
Write-Host "OAC: $oacName" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No actual imports will be performed" -ForegroundColor Cyan
    Write-Host ""
}

# Function to check if resource exists in AWS
function Test-S3Bucket {
    param([string]$BucketName)
    try {
        aws s3api head-bucket --bucket $BucketName --region $Region 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Get-CloudFrontOAC {
    param([string]$Name)
    try {
        $result = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='$Name'].Id | [0]" --output text 2>$null
        if ($result -and $result -ne "None") {
            return $result
        }
        return $null
    }
    catch {
        return $null
    }
}

# Initialize Terraform
Write-Host "Initializing Terraform..." -ForegroundColor Blue
if (-not $DryRun) {
    terraform init
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Terraform init failed"
        exit 1
    }
}

# Check and import S3 bucket
Write-Host "Checking S3 bucket: $bucketName" -ForegroundColor Blue
if (Test-S3Bucket -BucketName $bucketName) {
    Write-Host "✓ S3 bucket exists in AWS" -ForegroundColor Green
    
    if ($DryRun) {
        Write-Host "Would import: terraform import module.web.aws_s3_bucket.service_bucket[0] $bucketName" -ForegroundColor Cyan
    } else {
        Write-Host "Importing S3 bucket..." -ForegroundColor Blue
        terraform import "module.web.aws_s3_bucket.service_bucket[0]" $bucketName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ S3 bucket imported successfully" -ForegroundColor Green
        } else {
            Write-Warning "Failed to import S3 bucket (may already be in state)"
        }
    }
} else {
    Write-Host "✗ S3 bucket does not exist in AWS" -ForegroundColor Red
}

# Check and import CloudFront OAC
Write-Host "Checking CloudFront OAC: $oacName" -ForegroundColor Blue
$oacId = Get-CloudFrontOAC -Name $oacName
if ($oacId) {
    Write-Host "✓ CloudFront OAC exists in AWS (ID: $oacId)" -ForegroundColor Green
    
    if ($DryRun) {
        Write-Host "Would import: terraform import module.web.aws_cloudfront_origin_access_control.oac[0] $oacId" -ForegroundColor Cyan
    } else {
        Write-Host "Importing CloudFront OAC..." -ForegroundColor Blue
        terraform import "module.web.aws_cloudfront_origin_access_control.oac[0]" $oacId
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ CloudFront OAC imported successfully" -ForegroundColor Green
        } else {
            Write-Warning "Failed to import CloudFront OAC (may already be in state)"
        }
    }
} else {
    Write-Host "✗ CloudFront OAC does not exist in AWS" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Import Process Complete ===" -ForegroundColor Green

if (-not $DryRun) {
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run 'terraform plan' to verify the state" -ForegroundColor White
    Write-Host "2. Run 'terraform apply' to proceed with deployment" -ForegroundColor White
}
