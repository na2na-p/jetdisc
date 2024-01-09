module "worker" {
  source             = "./modules/workers"
  worker_script_path = "./scripts/worker.js"
  account_id         = var.account_id
  worker_name        = "${var.service}-${var.env}"
  zone_id            = var.zone_id
  base_domain        = var.base_domain
}
