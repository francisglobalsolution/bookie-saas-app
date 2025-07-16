module "web" {
  source              = "../../../modules/service"
  env                 = var.env
  region              = var.region
  bucket_name_prefix  = var.bucket_name_prefix
  tags                = var.tags
}
