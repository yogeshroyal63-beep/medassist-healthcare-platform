from fastapi import APIRouter, Query
from api.schemas import SymptomRequest
from model.triage_engine import triage
from model.medicine_engine import MEDICINE_DB, search_medicines
from model.emergency_rules import EMERGENCY_NUMBERS
from model.severity_rules import SEVERITY_MAP
from model.specialty_mapper import SPECIALTY_MAP

router = APIRouter()


# -----------------------------------------------
# POST /triage — Main triage endpoint
# -----------------------------------------------

@router.post("/triage")
def run_triage(request: SymptomRequest):
    """
    Main symptom triage endpoint.
    Accepts symptoms text and optional age.
    Returns predictions, severity, specialty, and care advice.
    """
    result = triage(request.symptoms, age=request.age)
    return result


# -----------------------------------------------
# GET /conditions — List all supported conditions
# -----------------------------------------------

@router.get("/conditions")
def get_conditions():
    """
    Returns all conditions the AI can classify,
    with their severity and recommended specialty.
    """
    conditions = []
    for condition, severity in SEVERITY_MAP.items():
        specialty_data = SPECIALTY_MAP.get(condition, ("General Physician", None))
        conditions.append({
            "condition": condition,
            "severity":  severity,
            "specialty": specialty_data[0],
        })

    return {
        "total":      len(conditions),
        "conditions": sorted(conditions, key=lambda x: x["condition"])
    }


# -----------------------------------------------
# GET /medicines — Medicine database
# -----------------------------------------------

@router.get("/medicines")
def get_medicines(search: str = Query(default=None)):
    """
    Returns medicine database.
    Optional search parameter for partial name match.
    """
    if search:
        matches = search_medicines(search.lower())
        result = {
            name.lower().replace(" ", "_"): MEDICINE_DB[name.lower().replace(" ", "_")]
            for name in matches
            if name.lower().replace(" ", "_") in MEDICINE_DB
        }
        return {
            "query":   search,
            "results": len(result),
            "medicines": result
        }

    return {
        "total":     len(MEDICINE_DB),
        "medicines": list(MEDICINE_DB.keys())
    }


# -----------------------------------------------
# GET /medicine/{name} — Single medicine lookup
# -----------------------------------------------

@router.get("/medicine/{name}")
def get_medicine(name: str):
    """
    Get detailed info about a specific medicine.
    """
    name_key = name.lower().replace(" ", "_").replace("-", "_")
    med = MEDICINE_DB.get(name_key)

    if not med:
        return {
            "found":   False,
            "message": f"Medicine '{name}' not found in database.",
            "suggestion": "Try searching with /medicines?search=name"
        }

    return {
        "found":    True,
        "medicine": name_key.replace("_", " ").title(),
        **med
    }


# -----------------------------------------------
# POST /feedback — Log user feedback
# -----------------------------------------------

@router.post("/feedback")
def submit_feedback(
    symptoms:           str,
    predicted_condition: str,
    correct_condition:  str = None,
    helpful:            bool = None
):
    """
    Log user feedback on predictions for future improvement.
    """
    import json
    import datetime
    import os

    os.makedirs("logs", exist_ok=True)

    entry = {
        "timestamp":            str(datetime.datetime.now()),
        "symptoms":             symptoms,
        "predicted_condition":  predicted_condition,
        "correct_condition":    correct_condition,
        "helpful":              helpful,
    }

    with open("logs/feedback.json", "a") as f:
        f.write(json.dumps(entry) + "\n")

    return {
        "status":  "received",
        "message": "Thank you for your feedback. It helps improve the system."
    }


# -----------------------------------------------
# GET /emergency — Emergency numbers
# -----------------------------------------------

@router.get("/emergency")
def get_emergency_numbers():
    """
    Returns emergency contact numbers.
    """
    return {
        "emergency_numbers": EMERGENCY_NUMBERS,
        "message": "In case of emergency, call these numbers immediately."
    }
