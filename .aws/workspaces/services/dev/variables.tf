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

# These were also mentioned in the warning:
variable "environment" {
  type        = string
  description = "Logical environment name"
}

variable "account_id" {
  type        = string
  description = "AWS Account ID"
}


variable "bucket_name" {
  type        = string
  description = "Full bucket name"
  default     = ""
}

variable "service_name" {
  type        = string
  description = "Name of the service"
  default     = ""
}
