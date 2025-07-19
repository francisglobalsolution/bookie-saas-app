output "bucket_name" {
  value = local.bucket_id
}

output "bucket_arn" {
  value = local.bucket_arn
}

output "distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "distribution_domain_name" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "oac_id" {
  value = local.oac_id
}
