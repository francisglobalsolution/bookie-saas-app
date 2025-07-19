# Terraform Dynamic Deployment Guide

This guide explains how to deploy the Bookie SaaS platform with automatic handling of existing resources and dynamic platform configuration.

## Overview

The enhanced Terraform configuration now includes:

- **Dynamic Resource Detection**: Automatically detects existing AWS resources
- **Conditional Resource Creation**: Creates resources only when they don't exist
- **Import Automation**: Automatically imports existing resources into Terraform state
- **Environment-Specific Configuration**: Different settings per environment
- **Conflict Resolution**: Handles "resource already exists" errors automatically

## Key Features

### 1. Import Existing Resources

The system can automatically import existing resources to prevent conflicts:

```powershell
# Import existing resources for dev environment
.\.aws\scripts\deploy.ps1 -Environment dev -Action import

# Import with dry run to see what would be imported
.\.aws\scripts\import-existing-resources.ps1 -Environment dev -BucketPrefix "bookie-dev" -Region "us-east-1" -DryRun
```

### 2. Dynamic Deployment

Deploy with automatic conflict resolution:

```powershell
# Deploy with automatic import of existing resources
.\.aws\scripts\deploy.ps1 -Environment dev -Action apply -AutoImport

# Deploy forcing new resource creation (skip import)
.\.aws\scripts\deploy.ps1 -Environment dev -Action apply -ForceNew
```

### 3. Environment-Specific Configuration

Each environment has specific settings:

- **Dev**: `import_existing_resources = true`, `prevent_destroy = false`
- **Staging**: `import_existing_resources = true`, `prevent_destroy = true`
- **Prod**: `import_existing_resources = true`, `prevent_destroy = true`

## Usage Examples

### Quick Deployment (Recommended)

For development with automatic conflict resolution:

```powershell
# Navigate to the project directory
cd c:\Users\User\Desktop\bookingAppv2\bookie-saas-app

# Deploy to dev with auto-import
.\.aws\scripts\deploy.ps1 -Environment dev -Action apply -AutoImport -Verbose
```

### Step-by-Step Deployment

For more control over the process:

```powershell
# 1. Initialize and validate
.\.aws\scripts\deploy.ps1 -Environment dev -Action init
.\.aws\scripts\deploy.ps1 -Environment dev -Action validate

# 2. Check for conflicts and import if needed
.\.aws\scripts\deploy.ps1 -Environment dev -Action import

# 3. Plan the deployment
.\.aws\scripts\deploy.ps1 -Environment dev -Action plan

# 4. Apply the changes
.\.aws\scripts\deploy.ps1 -Environment dev -Action apply
```

### Production Deployment

Production requires additional confirmation:

```powershell
# Production deployment (requires manual approval)
.\.aws\scripts\deploy.ps1 -Environment prod -Action apply -AutoImport
```

## Troubleshooting

### Resource Already Exists Errors

If you encounter "BucketAlreadyExists" or "OriginAccessControlAlreadyExists" errors:

1. **Use Auto-Import** (Recommended):
   ```powershell
   .\.aws\scripts\deploy.ps1 -Environment dev -Action apply -AutoImport
   ```

2. **Manual Import**:
   ```powershell
   # Import existing resources first
   .\.aws\scripts\deploy.ps1 -Environment dev -Action import
   
   # Then apply
   .\.aws\scripts\deploy.ps1 -Environment dev -Action apply
   ```

3. **Check Resource State**:
   ```powershell
   # Navigate to environment directory
   cd .\.aws\workspaces\services\dev
   
   # Check current state
   terraform state list
   terraform state show module.web.aws_s3_bucket.service_bucket[0]
   ```

### State File Issues

If Terraform state is corrupted or inconsistent:

```powershell
# Refresh state
cd .\.aws\workspaces\services\dev
terraform refresh

# Import specific resources
terraform import module.web.aws_s3_bucket.service_bucket[0] bookie-dev-dev
terraform import module.web.aws_cloudfront_origin_access_control.oac[0] <OAC_ID>
```

### Configuration Validation

Validate your configuration:

```powershell
.\.aws\scripts\deploy.ps1 -Environment dev -Action validate
```

## Manual Import Commands

If you need to manually import resources:

```powershell
# Navigate to environment directory
cd .\.aws\workspaces\services\dev

# Import S3 bucket
terraform import module.web.aws_s3_bucket.service_bucket[0] bookie-dev-dev

# Import CloudFront OAC (get ID from AWS Console or CLI)
aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='dev-oac'].Id | [0]" --output text
terraform import module.web.aws_cloudfront_origin_access_control.oac[0] <OAC_ID>

# Verify imports
terraform plan
```

## Environment Variables

Set these environment variables for consistent deployments:

```powershell
$env:AWS_REGION = "us-east-1"
$env:AWS_PROFILE = "your-profile"  # If using AWS profiles
```

## Best Practices

1. **Always Use Auto-Import**: For dev and staging environments
2. **Plan Before Apply**: Review changes with `terraform plan`
3. **Environment Isolation**: Use separate AWS accounts or regions for environments
4. **State Management**: Use remote state storage for team collaboration
5. **Resource Tagging**: All resources are automatically tagged with environment information

## Directory Structure

```
.aws/
├── modules/service/           # Reusable Terraform module
│   ├── main.tf               # Main resources with conditional creation
│   ├── variables.tf          # Input variables
│   ├── outputs.tf            # Output values
│   └── resource-check.tf     # Resource existence checking
├── workspaces/services/       # Environment-specific configurations
│   ├── dev/
│   ├── staging/
│   └── prod/
└── scripts/                   # Deployment automation scripts
    ├── deploy.ps1            # Main deployment script
    └── import-existing-resources.ps1  # Resource import utility
```

## Next Steps

After successful deployment:

1. **Verify Resources**: Check AWS Console for created resources
2. **Test Application**: Deploy your application to the S3 bucket
3. **Configure CI/CD**: Integrate the deployment script into your CI/CD pipeline
4. **Monitor**: Set up CloudWatch monitoring for your resources

For CI/CD integration, use the deployment script in your pipeline:

```yaml
# GitHub Actions example
- name: Deploy to AWS
  run: |
    .\.aws\scripts\deploy.ps1 -Environment ${{ matrix.environment }} -Action apply -AutoImport
```
