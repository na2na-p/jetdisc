variable "service" {
  type        = string
  description = "used for resource name and tag prefix"
}

variable "env" {
  type        = string
  description = "used for resource name and tag prefix"
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
