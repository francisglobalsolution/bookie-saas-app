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

variable "distribution_id" {
  description = "CloudFront Distribution ID"
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
