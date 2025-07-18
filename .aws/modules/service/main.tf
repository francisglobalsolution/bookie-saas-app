resource "aws_s3_bucket" "service_bucket" {
  bucket        = "${var.bucket_name_prefix}-${var.env}"
  force_destroy = true

  tags = merge(var.tags, {
    Environment = var.env
  })
}

resource "aws_s3_bucket_public_access_block" "block" {
  bucket                  = aws_s3_bucket.service_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Origin Access Control (CloudFront >= 2022-09)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${var.env}-oac"
  description                       = "Access control for ${var.env} site"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  origin_access_control_origin_type = "s3"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.service_bucket.bucket_regional_domain_name
    origin_id   = "s3-${aws_s3_bucket.service_bucket.id}"

    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-${aws_s3_bucket.service_bucket.id}"
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
    resources = ["${aws_s3_bucket.service_bucket.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.service_bucket.id
  policy = data.aws_iam_policy_document.bucket_policy.json
}
