terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

variable "service_name" {
  description = "The name of the service (used for resource naming)"
  type        = string
}

variable "environment" {
  description = "The environment name (dev, staging, qa, prod)"
  type        = string
}
