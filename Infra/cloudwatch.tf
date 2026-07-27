resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "devopswatch-cpu-low"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 20
  alarm_description   = "low severity: CPU exceeded 20%"

  dimensions = {
    InstanceId = aws_instance.app.id
  }

  alarm_actions = [aws_sns_topic.incident_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "cpu_medium" {
  alarm_name          = "devopswatch-cpu-medium"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 50
  alarm_description   = "medium severity: CPU exceeded 50%"

  dimensions = {
    InstanceId = aws_instance.app.id
  }

  alarm_actions = [aws_sns_topic.incident_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "cpu_critical" {
  alarm_name          = "devopswatch-cpu-critical"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "critical severity: CPU exceeded 80%"

  dimensions = {
    InstanceId = aws_instance.app.id
  }

  alarm_actions = [aws_sns_topic.incident_alerts.arn]
}