terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  cloud {
    organization = "Francis_Global_Solution"
    workspaces {
      name = "bookie-prod"
    }
  }
}

provider "aws" {
  region = var.region
}

module "web" {
  source             = "../../../modules/service"
  env                = var.env
  region             = var.region
  account_id         = var.account_id
  bucket_name_prefix = var.bucket_name_prefix
  force_destroy      = var.force_destroy
  tags               = var.tags
}
