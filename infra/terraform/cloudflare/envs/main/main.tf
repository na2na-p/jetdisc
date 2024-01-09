locals {
  service = "jetdisc"
  env     = "main"
}

module "app" {
  providers = {
    cloudflare = cloudflare
  }

  source      = "../../modules/app"
  service     = local.service
  env         = local.env
  account_id  = var.account_id
  zone_id     = var.zone_id
  base_domain = var.base_domain
}
