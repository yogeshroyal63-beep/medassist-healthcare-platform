import re

# Minimum real medical/symptom words needed to pass validation
MIN_WORDS = 2
MIN_CHARS = 5

# Common valid symptom words — input must contain at least one
VALID_SYMPTOM_WORDS = {
    "pain", "fever", "cough", "headache", "nausea", "vomiting", "diarrhea",
    "fatigue", "weakness", "dizziness", "swelling", "rash", "itching",
    "breathing", "breath", "chest", "stomach", "back", "throat", "nose",
    "eye", "ear", "skin", "joint", "muscle", "bone", "heart", "blood",
    "urine", "stool", "weight", "appetite", "sleep", "tired", "hurt",
    "ache", "sore", "burning", "discharge", "bleeding", "numb", "tingling",
    "shaking", "trembling", "confusion", "unconscious", "seizure", "faint",
    "sneeze", "sneezing", "congestion", "phlegm", "mucus", "wheezing",
    "thirst", "hunger", "cold", "chills", "sweating", "yellow", "pale",
    "feel", "feeling", "having", "experiencing", "suffering", "since",
    "days", "weeks", "morning", "night", "sudden", "severe", "mild",
    "dengue", "malaria", "typhoid", "asthma", "diabetes", "pressure",
    "infection", "allergy", "migraine", "vertigo", "anxiety", "depression",
}


def validate_input(text):
    """
    Validate user input before processing.

    Returns:
        (bool, str) — (is_valid, reason_if_invalid)
    """
    if not text:
        return False, "Input is empty. Please describe your symptoms."

    text = text.strip()

    # Too short
    if len(text) < MIN_CHARS:
        return False, "Input too short. Please describe your symptoms in more detail."

    # Too long (likely spam)
    if len(text) > 1000:
        return False, "Input too long. Please describe your main symptoms briefly."

    # Only numbers or special characters
    if re.match(r'^[\d\s\W]+$', text):
        return False, "Please describe your symptoms in words."

    words = text.lower().split()

    # Too few words
    if len(words) < MIN_WORDS:
        return False, "Please describe at least two symptoms for better analysis."

    # Gibberish detection — check if any valid symptom word exists
    has_valid_word = any(word in VALID_SYMPTOM_WORDS for word in words)

    # Also accept if any word is longer than 4 chars (likely a real word)
    has_real_word = any(len(word) > 4 and word.isalpha() for word in words)

    if not has_valid_word and not has_real_word:
        return False, "Could not understand the input. Please describe your symptoms clearly."

    return True, "valid"
