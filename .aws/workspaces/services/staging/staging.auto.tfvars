# use1.staging.auto.tfvars

env                = "staging"
region             = "us-east-1"
account_id         = "043220466878"
bucket_name_prefix = "bookie"
force_destroy      = true
tags = { service = "booking-saas", environment = "staging" }
