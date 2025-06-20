terraform {
  backend "remote" {
    organization = "Francis_Global_Solution"

    workspaces {
      prefix = "bookie-"
    }
  }
}
