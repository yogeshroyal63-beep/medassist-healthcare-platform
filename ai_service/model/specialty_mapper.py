# -----------------------------------------------
# Specialty Mapper — All 45 Conditions
# Primary + Secondary specialty recommendations
# -----------------------------------------------

SPECIALTY_MAP = {

    # --- General / Internal Medicine ---
    "Flu":              ("General Physician", "Infectious Disease"),
    "CommonCold":       ("General Physician", None),
    "ViralFever":       ("General Physician", "Infectious Disease"),
    "Dehydration":      ("General Physician", None),
    "Typhoid":          ("General Physician", "Infectious Disease"),
    "Dengue":           ("General Physician", "Infectious Disease"),
    "Malaria":          ("General Physician", "Infectious Disease"),
    "Chickenpox":       ("General Physician", "Dermatologist"),
    "COVID19":          ("General Physician", "Pulmonologist"),
    "Tuberculosis":     ("Pulmonologist", "Infectious Disease"),

    # --- Pulmonology ---
    "Asthma":           ("Pulmonologist", "Allergist"),
    "Pneumonia":        ("Pulmonologist", "General Physician"),
    "Bronchitis":       ("Pulmonologist", "General Physician"),
    "PneumothoraxRisk": ("Pulmonologist", "Emergency Medicine"),

    # --- Cardiology ---
    "HeartAttackRisk":  ("Cardiologist", "Emergency Medicine"),
    "Hypertension":     ("Cardiologist", "General Physician"),

    # --- Neurology ---
    "Migraine":         ("Neurologist", "General Physician"),
    "TensionHeadache":  ("Neurologist", "General Physician"),
    "SeizureRisk":      ("Neurologist", "Emergency Medicine"),
    "StrokeRisk":       ("Neurologist", "Emergency Medicine"),
    "Vertigo":          ("Neurologist", "ENT Specialist"),
    "Meningitis":       ("Neurologist", "Emergency Medicine"),

    # --- Gastroenterology ---
    "FoodPoisoning":    ("Gastroenterologist", "General Physician"),
    "Gastritis":        ("Gastroenterologist", "General Physician"),
    "Appendicitis":     ("Gastroenterologist", "General Surgeon"),
    "PepticUlcer":      ("Gastroenterologist", "General Physician"),
    "GallstoneAttack":  ("Gastroenterologist", "General Surgeon"),
    "LiverDisease":     ("Gastroenterologist", "Hepatologist"),
    "Jaundice":         ("Gastroenterologist", "Hepatologist"),

    # --- Urology / Nephrology ---
    "UrinaryInfection": ("Urologist", "General Physician"),
    "KidneyStone":      ("Urologist", "Nephrologist"),

    # --- Endocrinology ---
    "DiabetesSymptoms": ("Endocrinologist", "General Physician"),
    "ThyroidDisorder":  ("Endocrinologist", "General Physician"),

    # --- Hematology ---
    "Anemia":           ("Hematologist", "General Physician"),

    # --- Orthopedics ---
    "MuscleStrain":     ("Orthopedic Specialist", "Physiotherapist"),
    "FractureRisk":     ("Orthopedic Specialist", "Emergency Medicine"),
    "Gout":             ("Rheumatologist", "Orthopedic Specialist"),

    # --- Psychiatry / Psychology ---
    "AnxietyAttack":    ("Psychiatrist", "General Physician"),
    "PanicAttack":      ("Psychiatrist", "General Physician"),
    "Depression":       ("Psychiatrist", "Psychologist"),

    # --- ENT ---
    "Sinusitis":        ("ENT Specialist", "General Physician"),

    # --- Dermatology ---
    "SkinInfection":    ("Dermatologist", "General Physician"),
    "Allergy":          ("Allergist", "Dermatologist"),
    "Eczema":           ("Dermatologist", "Allergist"),

    # --- Ophthalmology ---
    "Conjunctivitis":   ("Ophthalmologist", "General Physician"),
}


def get_specialty(condition):
    """
    Get primary specialty recommendation for a condition.

    Returns:
        str: Primary specialty name
    """
    result = SPECIALTY_MAP.get(condition)
    if result:
        return result[0]
    return "General Physician"


def get_specialty_full(condition):
    """
    Get both primary and secondary specialty recommendations.

    Returns:
        dict with primary and secondary specialty
    """
    result = SPECIALTY_MAP.get(condition)
    if result:
        return {
            "primary":   result[0],
            "secondary": result[1]
        }
    return {
        "primary":   "General Physician",
        "secondary": None
    }
