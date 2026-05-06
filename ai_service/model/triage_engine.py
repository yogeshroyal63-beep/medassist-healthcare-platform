from model.predictor import predict
from model.emergency_rules import check_emergency, get_emergency_type, EMERGENCY_NUMBERS
from model.severity_rules import get_severity, get_care_advice
from model.specialty_mapper import get_specialty_full
from model.intent_detector import detect_intent
from model.spell_corrector import correct
from model.input_validator import validate_input
from model.logging_system import log_prediction
from model.medicine_engine import handle_medicine_query

DISCLAIMER = (
    "This AI assistant provides triage guidance only and does not replace "
    "professional medical advice. Always consult a qualified healthcare provider."
)


def triage(user_input, age=None):
    """
    Main triage function.

    Args:
        user_input (str): Patient's symptom description
        age (int | str | None): Patient age — used for severity boosting

    Returns:
        dict: Structured triage result
    """

    # --- 1. Validate Input ---
    is_valid, reason = validate_input(user_input)
    if not is_valid:
        return {
            "status":  "invalid_input",
            "message": reason
        }

    # --- 2. Spell Correction ---
    text = correct(user_input)

    # --- 3. Detect Intent ---
    intent = detect_intent(text)

    # --- 4. Handle Greeting ---
    if intent == "greeting":
        return {
            "status":  "greeting",
            "message": (
                "Hello! I'm MedAssist AI. Please describe your symptoms "
                "and I'll help assess them."
            )
        }

    # --- 5. Handle Mental Health Crisis ---
    if intent == "mental_health_crisis":
        return {
            "status":   "mental_health_crisis",
            "severity": "critical",
            "message":  "You are not alone. Please reach out for help immediately.",
            "helplines": {
                "Kiran Mental Health Helpline": "1800-599-0019 (Free, 24/7)",
                "iCall":                        "9152987821",
                "Vandrevala Foundation":        "1860-2662-345 (24/7)",
            },
            "disclaimer": DISCLAIMER
        }

    # --- 6. Handle Medicine Query ---
    if intent == "medicine_query":
        result = handle_medicine_query(text)
        result["status"] = "medicine_info"
        return result

    # --- 7. Emergency Check ---
    if check_emergency(text):
        emergency_type = get_emergency_type(text)
        return {
            "status":           "emergency",
            "severity":         "critical",
            "emergency_type":   emergency_type,
            "message":          "Emergency symptoms detected. Seek immediate medical care.",
            "action":           "Call emergency services or go to the nearest emergency room NOW.",
            "emergency_numbers": EMERGENCY_NUMBERS,
            "disclaimer":       DISCLAIMER
        }

    # --- 8. ML Prediction ---
    predictions = predict(text)
    if not predictions:
        return {
            "status": "low_confidence",
            "message": "Unable to determine the condition right now. Please consult a healthcare professional.",
            "disclaimer": DISCLAIMER
        }

    # --- 9. Low confidence fallback ---
    if predictions[0]["confidence"] < 0.25:
        return {
            "status":  "low_confidence",
            "message": (
                "Unable to determine the condition with sufficient confidence. "
                "Please provide more specific symptoms or consult a healthcare professional."
            ),
            "disclaimer": DISCLAIMER
        }

    # --- 10. Get top condition details ---
    top_condition = predictions[0]["condition"]

    # Parse age safely
    parsed_age = None
    if age is not None:
        try:
            parsed_age = int(age)
        except (ValueError, TypeError):
            parsed_age = None

    severity  = get_severity(top_condition, age=parsed_age)
    specialty = get_specialty_full(top_condition)
    advice    = get_care_advice(severity, top_condition)

    # --- 11. Log prediction ---
    log_prediction(text, predictions, severity)

    # --- 12. Build rich response ---
    intent_note = None
    if intent == "followup_query":
        intent_note = "You mentioned symptoms that have been persisting. This warrants prompt medical attention."
    elif intent == "symptom_query_chronic":
        intent_note = "Chronic or long-duration symptoms should be evaluated by a doctor."

    return {
        "status":        "success",
        "predictions":   predictions,
        "top_condition": top_condition,
        "severity":      severity,
        "specialty": {
            "primary":   specialty["primary"],
            "secondary": specialty["secondary"],
        },
        "advice": {
            "action":    advice["action"],
            "urgency":   advice["urgency"],
            "home_care": advice["home_care"],
        },
        "age_considered": parsed_age is not None,
        "intent_note":    intent_note,
        "disclaimer":     DISCLAIMER
    }
