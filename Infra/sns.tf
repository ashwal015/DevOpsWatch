resource "aws_sns_topic" "incident_alerts" {
  name = "devopswatch-incident-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.incident_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}