import json
import os
import urllib.request

API_BASE = os.environ["API_BASE_URL"]
SERVICE_EMAIL = os.environ["SERVICE_EMAIL"]
SERVICE_PASSWORD = os.environ["SERVICE_PASSWORD"]

def get_token():
    payload = json.dumps({"email": SERVICE_EMAIL, "password": SERVICE_PASSWORD}).encode()
    req = urllib.request.Request(
        f"{API_BASE}/login", data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())["access_token"]

def create_incident(token, title, description, severity):
    payload = json.dumps({
        "title": title,
        "description": description,
        "severity": severity
    }).encode()
    req = urllib.request.Request(
        f"{API_BASE}/incidents", data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

def determine_severity(alarm_name):
    name = (alarm_name or "").lower()
    if "critical" in name:
        return "critical"
    if "medium" in name:
        return "medium"
    if "low" in name:
        return "low"
    return "low"  # safe default if name doesn't match anything

def lambda_handler(event, context):
    record = event["Records"][0]["Sns"]
    raw_message = record["Message"]
    subject = record.get("Subject", "CloudWatch Alarm Triggered")

    # Real CloudWatch alarms send a JSON message; manual test publishes are plain text
    try:
        parsed = json.loads(raw_message)
        alarm_name = parsed.get("AlarmName", subject)
        description = parsed.get("NewStateReason", raw_message)
    except (json.JSONDecodeError, TypeError):
        alarm_name = subject
        description = raw_message

    severity = determine_severity(alarm_name)
    token = get_token()
    result = create_incident(token, alarm_name, description, severity)

    print(f"Incident created with severity={severity}: {result}")
    return {"statusCode": 200, "body": json.dumps(result)}