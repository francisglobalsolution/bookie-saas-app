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
      name = "bookie-qa"
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
  bucket_name_prefix = var.bucket_name_prefix
  tags               = var.tags
}
