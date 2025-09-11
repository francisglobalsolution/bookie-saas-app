variable "env"                { type = string }
variable "region"             { type = string }
variable "account_id"         { type = string }
variable "bucket_name_prefix" { type = string }

variable "force_destroy" {
  type    = bool
  default = false
}

variable "tags" {
  type    = map(string)
  default = {}
}
