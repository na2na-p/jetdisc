locals {
  worker_script_dir = "${path.module}/scripts"
}

resource "cloudflare_worker_script" "worker" {
  account_id = var.account_id
  name       = var.worker_name
  content    = file("${local.worker_script_dir}/worker.js")
}

resource "cloudflare_worker_route" "name" {
  pattern     = "${var.worker_name}.${var.base_domain}"
  zone_id     = var.zone_id
  script_name = cloudflare_worker_script.worker.name
}

resource "cloudflare_worker_domain" "custom_domain" {
  hostname   = "${var.worker_name}.${var.base_domain}"
  account_id = var.account_id
  service    = var.worker_name
  zone_id    = var.zone_id
  depends_on = [cloudflare_worker_script.worker]
}
