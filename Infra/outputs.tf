output "instance_public_ip" {
  value = aws_instance.app.public_ip
}
output "sns_topic_arn" {
  value = aws_sns_topic.incident_alerts.arn
}