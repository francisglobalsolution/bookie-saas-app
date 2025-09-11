# use1.prod.auto.tfvars

env                = "prod"
region             = "us-east-1"
account_id         = "043220466878"
bucket_name_prefix = "bookie"
force_destroy      = false
tags = { service = "booking-saas", environment = "prod" }
