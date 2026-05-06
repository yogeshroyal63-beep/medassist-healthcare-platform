import json
import datetime
import os

LOG_FILE      = "logs/predictions.json"
FEEDBACK_FILE = "logs/feedback.json"

os.makedirs("logs", exist_ok=True)


def log_prediction(input_text, predictions, severity):
    """
    Log a triage prediction to the log file.
    Each entry is a valid JSON object on its own line (JSON Lines format).
    """
    entry = {
        "timestamp":   str(datetime.datetime.now()),
        "input":       input_text,
        "predictions": predictions,
        "severity":    severity,
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")


def read_logs(limit=100):
    """
    Read the last N prediction logs.
    Returns list of log entries.
    """
    if not os.path.exists(LOG_FILE):
        return []

    entries = []
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines[-limit:]:
        line = line.strip()
        if line:
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue

    return entries


def get_log_stats():
    """
    Return basic stats about predictions logged.
    """
    entries = read_logs(limit=10000)

    if not entries:
        return {"total": 0}

    severity_counts = {}
    condition_counts = {}

    for entry in entries:
        sev = entry.get("severity", "unknown")
        severity_counts[sev] = severity_counts.get(sev, 0) + 1

        preds = entry.get("predictions", [])
        if preds:
            top = preds[0].get("condition", "unknown")
            condition_counts[top] = condition_counts.get(top, 0) + 1

    return {
        "total":            len(entries),
        "severity_counts":  severity_counts,
        "top_conditions":   dict(
            sorted(condition_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        ),
    }
