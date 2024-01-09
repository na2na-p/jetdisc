variable "worker_name" {
  description = "Name of Cloudflare Worker"
}

variable "worker_script_path" {
  description = "Path to Cloudflare Worker script"
  type        = string
  default     = "./scripts/worker.js"
}

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}

variable "base_domain" {
  description = "Base domain"
  type        = string
}
