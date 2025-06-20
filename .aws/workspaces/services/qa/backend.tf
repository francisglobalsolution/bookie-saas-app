terraform {
  backend "remote" {
    organization = "Francis_Global_Solution"

    workspaces {
      name = "bookie-qa"
    }
  }
}
