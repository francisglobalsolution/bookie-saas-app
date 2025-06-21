module "web" {
  source          = "../../modules/service"
  env             = var.env
  region          = var.region
  bucket_name     = aws_s3_bucket.service_bucket.bucket
  distribution_id = aws_cloudfront_distribution.site.id
}

variable "env" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region to deploy the service"
  type        = string
}

variable "bucket_name" {
  description = "Name of the S3 bucket used by the service"
  type        = string
}
