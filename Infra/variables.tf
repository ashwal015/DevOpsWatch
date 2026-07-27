variable "key_pair_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
  default     = "devopswatch-key"
}
variable "service_email" {
  description = "Service account email for Lambda to authenticate"
  type        = string
}

variable "service_password" {
  description = "Service account password for Lambda to authenticate"
  type        = string
  sensitive   = true
}
variable "alert_email" {
  description = "Email to receive incident alerts"
  type        = string
}