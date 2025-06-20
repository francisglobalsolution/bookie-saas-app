terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "Francis_Global_Solution"

    workspaces {
      prefix = "bookie-"
    }
  }
}
