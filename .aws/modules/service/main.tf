# main.tf
resource "aws_s3_bucket" "web" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "web" {
  bucket = aws_s3_bucket.web.id
  index_document {
    suffix = "index.html"
  }
}

output "bucket_url" {
  value = "https://${aws_s3_bucket.web.bucket}.s3-website.${var.region}.amazonaws.com"
}
