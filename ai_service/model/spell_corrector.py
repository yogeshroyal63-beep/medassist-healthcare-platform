from symspellpy import SymSpell

sym_spell = SymSpell(max_dictionary_edit_distance=2)

# -----------------------------------------------
# 300+ Medical Symptom Dictionary
# -----------------------------------------------

MEDICAL_WORDS = [

    # Core symptoms
    "fever", "cough", "headache", "breathing", "vomiting",
    "nausea", "dizziness", "fatigue", "weakness", "pain",

    # Respiratory
    "wheezing", "shortness", "breathlessness", "congestion",
    "mucus", "phlegm", "sneezing", "runny", "throat", "hoarse",

    # Digestive
    "diarrhea", "constipation", "bloating", "indigestion",
    "heartburn", "abdominal", "stomach", "cramps", "appetite",
    "swallowing", "hiccups", "belching", "flatulence",

    # Cardiovascular
    "palpitations", "heartbeat", "chest", "pressure", "angina",
    "sweating", "sweat", "irregular", "fluttering", "racing",

    # Neurological
    "seizure", "convulsion", "trembling", "numbness", "tingling",
    "paralysis", "confusion", "memory", "concentration", "balance",
    "coordination", "migraine", "vertigo", "spinning",

    # Musculoskeletal
    "swelling", "stiffness", "tenderness", "cramping", "spasm",
    "bruising", "fracture", "joint", "muscle", "bone", "arthritis",

    # Skin
    "rash", "itching", "redness", "blisters", "hives",
    "peeling", "discharge", "pus", "ulcer", "wound",

    # Eyes/Ears/Nose
    "blurred", "vision", "watery", "irritation", "hearing",
    "ringing", "earache", "nosebleed", "sinus", "facial",

    # Urinary
    "urination", "frequency", "burning", "cloudy", "blood",
    "incontinence", "urgency", "pelvic", "kidney", "bladder",

    # Mental health
    "anxiety", "depression", "insomnia", "sadness", "hopeless",
    "worthless", "panic", "fear", "stress", "irritability",

    # Fever types
    "chills", "shivering", "sweating", "temperature", "hot",

    # General
    "weight", "appetite", "thirst", "sleep", "energy",
    "malaise", "lethargy", "pallor", "jaundice", "yellowing",

    # Specific conditions mentioned
    "dengue", "malaria", "typhoid", "chickenpox", "measles",
    "tuberculosis", "pneumonia", "asthma", "diabetes", "hypertension",

    # Body parts
    "head", "neck", "back", "chest", "abdomen", "arm", "leg",
    "foot", "knee", "ankle", "shoulder", "hip", "wrist", "elbow",

    # Descriptors
    "severe", "mild", "moderate", "chronic", "acute", "sudden",
    "persistent", "intermittent", "constant", "sharp", "dull",
    "throbbing", "burning", "aching", "shooting", "cramping",

    # Duration related
    "days", "weeks", "hours", "morning", "night", "yesterday",
    "sudden", "gradual", "worsening", "improving",

    # Common descriptive words
    "difficulty", "unable", "cannot", "hard", "trouble",
    "problem", "issue", "feel", "feeling", "experiencing",

]

for word in MEDICAL_WORDS:
    sym_spell.create_dictionary_entry(word, 1)


def correct(text):
    """
    Correct spelling in medical symptom text.
    Returns corrected text or original if no correction found.
    """
    if not text:
        return text

    suggestions = sym_spell.lookup_compound(text, max_edit_distance=2)

    if suggestions:
        return suggestions[0].term

    return text
