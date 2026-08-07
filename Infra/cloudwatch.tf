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
resource "aws_cloudwatch_metric_alarm" "status_check_failed" {
  alarm_name          = "devopswatch-instance-down-critical"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "critical severity: EC2 instance status check failed"

  dimensions = {
    InstanceId = aws_instance.app.id
  }

  alarm_actions = [aws_sns_topic.incident_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "db_connection_failures" {
  alarm_name          = "devopswatch-db-connection-critical"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "DBConnectionFailures"
  namespace           = "DevOpsWatch"
  period              = 10
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "critical severity: backend cannot connect to the database"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.incident_alerts.arn]
}