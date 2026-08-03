import os
import boto3
from botocore.exceptions import BotoCoreError, ClientError

AWS_REGION = os.getenv("AWS_REGION", "eu-central-1")

def report_db_failure():
    try:
        cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)
        cloudwatch.put_metric_data(
            Namespace="DevOpsWatch",
            MetricData=[
                {"MetricName": "DBConnectionFailures", "Value": 1, "Unit": "Count"}
            ],
        )
    except (BotoCoreError, ClientError) as e:
        print(f"Failed to report DB failure metric: {e}")