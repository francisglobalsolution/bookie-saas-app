# Resource state management configuration
# This file helps manage existing resources and prevents conflicts

terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Data source to check for existing resources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Check if resources already exist before creating
data "external" "resource_check" {
  program = ["powershell", "-Command", <<-EOT
    $bucketName = "${var.bucket_name_prefix}-${var.env}"
    $oacName = "${var.env}-oac"
    
    # Check S3 bucket
    $bucketExists = $false
    try {
      aws s3api head-bucket --bucket $bucketName --region ${var.region} 2>$null
      $bucketExists = $LASTEXITCODE -eq 0
    } catch {}
    
    # Check CloudFront OAC
    $oacExists = $false
    try {
      $oacResult = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='$oacName'].Id | [0]" --output text 2>$null
      $oacExists = $oacResult -and $oacResult -ne "None"
    } catch {}
    
    # Return JSON
    @{
      bucket_exists = $bucketExists.ToString().ToLower()
      oac_exists = $oacExists.ToString().ToLower()
      bucket_name = $bucketName
      oac_name = $oacName
    } | ConvertTo-Json -Compress
EOT
  ]
}

# Local values for resource management
locals {
  bucket_exists = data.external.resource_check.result.bucket_exists == "true"
  oac_exists    = data.external.resource_check.result.oac_exists == "true"
  
  # Determine creation strategy
  create_bucket = var.import_existing_resources ? !local.bucket_exists : true
  create_oac    = var.import_existing_resources ? !local.oac_exists : true
}
