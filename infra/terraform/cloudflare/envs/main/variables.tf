variable "cloudflare_api_token" {
  description = "Cloudflare APIトークン"
  type        = string
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
