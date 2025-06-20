// main.tf for staging environment
// Add your Terraform resources here

module "web" {
  source      = "../../../modules/service"
  env         = var.env
  region      = var.region
  bucket_name = var.bucket_name
}
