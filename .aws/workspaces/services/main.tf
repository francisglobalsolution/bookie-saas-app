module "web" {
  source          = "../../modules/service"
  env             = var.env
  region          = var.region
  bucket_name     = aws_s3_bucket.service_bucket.bucket
  distribution_id = aws_cloudfront_distribution.site.id
}
