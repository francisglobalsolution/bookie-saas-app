variable "env" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region to deploy the service"
  type        = string
}

variable "bucket_name_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "import_existing_resources" {
  description = "Whether to import existing resources instead of creating new ones"
  type        = bool
  default     = false
}

variable "prevent_destroy" {
  description = "Prevent accidental destruction of resources"
  type        = bool
  default     = true
}

variable "create_cloudfront" {
  description = "Whether to create CloudFront distribution"
  type        = bool
  default     = true
}
