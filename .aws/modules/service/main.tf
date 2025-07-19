# Data source to check if S3 bucket already exists
data "aws_s3_bucket" "existing_bucket" {
  count  = var.import_existing_resources ? 1 : 0
  bucket = "${var.bucket_name_prefix}-${var.env}"
}

# Create S3 bucket only if it doesn't exist or if not importing
resource "aws_s3_bucket" "service_bucket" {
  count         = var.import_existing_resources ? 0 : 1
  bucket        = "${var.bucket_name_prefix}-${var.env}"
  force_destroy = true

  tags = merge(var.tags, {
    Environment = var.env
  })

  lifecycle {
    prevent_destroy = var.prevent_destroy
  }
}

# Local value to reference the bucket regardless of how it was created
locals {
  bucket_id     = var.import_existing_resources ? data.aws_s3_bucket.existing_bucket[0].id : aws_s3_bucket.service_bucket[0].id
  bucket_arn    = var.import_existing_resources ? data.aws_s3_bucket.existing_bucket[0].arn : aws_s3_bucket.service_bucket[0].arn
  bucket_domain = var.import_existing_resources ? data.aws_s3_bucket.existing_bucket[0].bucket_regional_domain_name : aws_s3_bucket.service_bucket[0].bucket_regional_domain_name
}

resource "aws_s3_bucket_public_access_block" "block" {
  bucket                  = local.bucket_id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  lifecycle {
    prevent_destroy = var.prevent_destroy
  }
}

# Data source to check if CloudFront OAC already exists
data "aws_cloudfront_origin_access_control" "existing_oac" {
  count = var.import_existing_resources ? 1 : 0
  name  = "${var.env}-oac"
}

# Origin Access Control (CloudFront >= 2022-09)
resource "aws_cloudfront_origin_access_control" "oac" {
  count                             = var.import_existing_resources ? 0 : 1
  name                              = "${var.env}-oac"
  description                       = "Access control for ${var.env} site"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  origin_access_control_origin_type = "s3"
}

# Local value to reference the OAC regardless of how it was created
locals {
  oac_id = var.import_existing_resources ? data.aws_cloudfront_origin_access_control.existing_oac[0].id : aws_cloudfront_origin_access_control.oac[0].id
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = local.bucket_domain
    origin_id   = "s3-${local.bucket_id}"

    origin_access_control_id = local.oac_id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-${local.bucket_id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = merge(var.tags, {
    Environment = var.env
  })
}

# S3 bucket policy to allow CloudFront OAC
data "aws_iam_policy_document" "bucket_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["${local.bucket_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "this" {
  bucket = local.bucket_id
  policy = data.aws_iam_policy_document.bucket_policy.json
}
