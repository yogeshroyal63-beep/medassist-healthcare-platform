import csv
import random
import os
from itertools import combinations

OUTPUT_FILE = "dataset/triage_dataset.csv"
TARGET_SIZE = 700000

# -----------------------------------------------
# 45 CONDITIONS WITH EXPANDED SYMPTOMS
# -----------------------------------------------

CONDITIONS = {

    # --- Existing 30 (expanded symptoms) ---

    "Flu": [
        "fever", "cough", "sore throat", "body ache", "fatigue",
        "chills", "headache", "runny nose", "sweating", "loss of appetite"
    ],

    "CommonCold": [
        "runny nose", "sneezing", "mild cough", "sore throat",
        "congestion", "watery eyes", "mild headache", "low fever"
    ],

    "COVID19": [
        "fever", "dry cough", "loss of smell", "fatigue",
        "shortness of breath", "loss of taste", "body ache",
        "sore throat", "headache", "diarrhea"
    ],

    "Pneumonia": [
        "high fever", "chest pain", "cough with mucus",
        "difficulty breathing", "chills", "fatigue",
        "rapid breathing", "bluish lips", "sweating"
    ],

    "Asthma": [
        "wheezing", "shortness of breath", "chest tightness",
        "breathing difficulty", "coughing at night",
        "difficulty exhaling", "rapid breathing"
    ],

    "HeartAttackRisk": [
        "chest pain", "pressure in chest", "sweating",
        "nausea", "arm pain", "jaw pain", "back pain",
        "shortness of breath", "dizziness", "cold sweat"
    ],

    "StrokeRisk": [
        "sudden weakness", "slurred speech", "facial drooping",
        "vision problems", "severe headache", "loss of balance",
        "confusion", "arm weakness", "numbness"
    ],

    "Migraine": [
        "severe headache", "light sensitivity", "nausea",
        "vomiting", "sound sensitivity", "throbbing pain",
        "vision disturbance", "one sided headache"
    ],

    "FoodPoisoning": [
        "vomiting", "diarrhea", "stomach pain", "nausea",
        "fever", "cramps", "weakness", "dehydration symptoms"
    ],

    "Gastritis": [
        "stomach burning", "abdominal pain", "nausea",
        "bloating", "indigestion", "loss of appetite",
        "hiccups", "dark stools"
    ],

    "Appendicitis": [
        "abdominal pain", "nausea", "vomiting",
        "loss of appetite", "fever", "pain near navel",
        "pain in lower right abdomen", "inability to pass gas"
    ],

    "KidneyStone": [
        "severe back pain", "pain during urination",
        "blood in urine", "nausea", "vomiting",
        "frequent urination", "pain in lower abdomen",
        "cloudy urine", "fever with chills"
    ],

    "UrinaryInfection": [
        "burning urination", "frequent urination",
        "pelvic pain", "cloudy urine", "strong urine odor",
        "blood in urine", "lower back pain", "low fever"
    ],

    "DiabetesSymptoms": [
        "frequent urination", "increased thirst", "fatigue",
        "blurred vision", "slow healing wounds", "weight loss",
        "tingling in feet", "frequent infections", "hunger"
    ],

    "Hypertension": [
        "headache", "chest pain", "dizziness",
        "shortness of breath", "blurred vision",
        "nosebleed", "fatigue", "irregular heartbeat"
    ],

    "Dehydration": [
        "thirst", "dry mouth", "dizziness", "fatigue",
        "dark urine", "dry skin", "headache",
        "rapid heartbeat", "muscle cramps"
    ],

    "AnxietyAttack": [
        "rapid heartbeat", "shortness of breath", "fear",
        "sweating", "trembling", "chest tightness",
        "nausea", "dizziness", "feeling of doom"
    ],

    "PanicAttack": [
        "intense fear", "rapid heartbeat", "chest pain",
        "dizziness", "trembling", "numbness",
        "shortness of breath", "choking feeling", "hot flashes"
    ],

    "Vertigo": [
        "spinning sensation", "dizziness", "balance problems",
        "nausea", "vomiting", "ear ringing",
        "hearing loss", "eye movement issues"
    ],

    "MuscleStrain": [
        "muscle pain", "swelling", "limited movement",
        "tenderness", "bruising", "muscle spasm",
        "stiffness", "weakness in muscle"
    ],

    "FractureRisk": [
        "severe pain", "swelling", "deformity",
        "unable to move limb", "bruising", "tenderness",
        "numbness", "bone visible", "crepitus"
    ],

    "SeizureRisk": [
        "convulsions", "loss of consciousness", "confusion",
        "muscle jerking", "staring spell", "temporary confusion",
        "uncontrollable movements", "falling suddenly"
    ],

    "SkinInfection": [
        "redness", "swelling", "pain", "pus",
        "warmth", "fever", "skin ulcer",
        "discharge", "itching with redness"
    ],

    "Bronchitis": [
        "persistent cough", "mucus", "chest discomfort",
        "fatigue", "mild fever", "shortness of breath",
        "wheezing", "sore throat"
    ],

    "Sinusitis": [
        "facial pain", "nasal congestion", "headache",
        "thick nasal discharge", "reduced smell",
        "cough", "ear pressure", "fever", "bad breath"
    ],

    "ThyroidDisorder": [
        "fatigue", "weight changes", "cold intolerance",
        "hair loss", "dry skin", "constipation",
        "slow heartbeat", "depression", "muscle weakness"
    ],

    "Anemia": [
        "fatigue", "pale skin", "shortness of breath",
        "weakness", "dizziness", "cold hands",
        "headache", "chest pain", "brittle nails"
    ],

    "Allergy": [
        "sneezing", "itchy eyes", "runny nose",
        "skin rash", "hives", "itchy throat",
        "watery eyes", "congestion", "wheezing"
    ],

    "ViralFever": [
        "high fever", "body pain", "fatigue",
        "weakness", "headache", "chills",
        "loss of appetite", "sweating", "sore throat"
    ],

    "TensionHeadache": [
        "headache", "neck pain", "pressure in head",
        "scalp tenderness", "shoulder pain",
        "dull aching head pain", "forehead pressure"
    ],

    # --- 15 NEW CONDITIONS ---

    "Dengue": [
        "high fever", "severe headache", "pain behind eyes",
        "joint pain", "muscle pain", "skin rash",
        "mild bleeding", "nausea", "vomiting", "fatigue"
    ],

    "Typhoid": [
        "prolonged fever", "weakness", "abdominal pain",
        "headache", "loss of appetite", "constipation",
        "rash on chest", "diarrhea", "dry cough", "sweating"
    ],

    "Malaria": [
        "cyclical fever", "chills", "sweating",
        "headache", "nausea", "vomiting",
        "muscle pain", "fatigue", "anemia symptoms", "shivering"
    ],

    "Jaundice": [
        "yellow skin", "yellow eyes", "dark urine",
        "pale stools", "abdominal pain", "fatigue",
        "itching", "nausea", "fever", "weight loss"
    ],

    "Chickenpox": [
        "itchy blisters", "skin rash", "fever",
        "fatigue", "loss of appetite", "headache",
        "fluid filled blisters", "scabbing", "sore throat"
    ],

    "Depression": [
        "persistent sadness", "loss of interest", "fatigue",
        "sleep changes", "appetite changes", "difficulty concentrating",
        "feelings of worthlessness", "social withdrawal", "hopelessness"
    ],

    "Meningitis": [
        "severe headache", "stiff neck", "high fever",
        "sensitivity to light", "nausea", "vomiting",
        "confusion", "skin rash", "seizures"
    ],

    "Tuberculosis": [
        "persistent cough", "coughing blood", "chest pain",
        "weight loss", "night sweats", "fatigue",
        "fever", "loss of appetite", "weakness"
    ],

    "LiverDisease": [
        "abdominal pain", "swollen abdomen", "yellow skin",
        "fatigue", "nausea", "loss of appetite",
        "dark urine", "pale stools", "itching"
    ],

    "PneumothoraxRisk": [
        "sudden chest pain", "shortness of breath",
        "rapid breathing", "chest tightness",
        "bluish skin", "fatigue", "rapid heartbeat"
    ],

    "GallstoneAttack": [
        "upper right abdomen pain", "nausea", "vomiting",
        "back pain", "pain after eating", "fever",
        "jaundice", "indigestion", "bloating"
    ],

    "PepticUlcer": [
        "burning stomach pain", "nausea", "vomiting",
        "dark stools", "blood in vomit", "weight loss",
        "loss of appetite", "bloating", "pain when hungry"
    ],

    "Gout": [
        "sudden joint pain", "swollen joint", "redness in joint",
        "warmth in joint", "tenderness", "limited movement",
        "intense pain at night", "ankle pain", "toe pain"
    ],

    "Eczema": [
        "dry skin", "itching", "red patches",
        "skin inflammation", "skin cracking", "rash",
        "scaly skin", "swollen skin", "oozing skin"
    ],

    "Conjunctivitis": [
        "red eyes", "itchy eyes", "discharge from eyes",
        "watery eyes", "swollen eyelids", "crusty eyes",
        "burning eyes", "sensitivity to light", "blurred vision"
    ],
}

# -----------------------------------------------
# EXPANDED TEMPLATES — More natural language
# -----------------------------------------------

TEMPLATES = [
    "{s1} and {s2}",
    "{s1}, {s2} and {s3}",
    "I have {s1} and {s2}",
    "I am experiencing {s1} with {s2}",
    "{s1} along with {s2}",
    "since yesterday I have {s1} and {s2}",
    "I feel {s1} and {s2} with {s3}",
    "I have been having {s1} and {s2} for {duration}",
    "{s1} and {s2} since {duration}",
    "for the last {duration} I feel {s1} and {s2}",
    "I am suffering from {s1} and {s2}",
    "my symptoms are {s1} and {s2}",
    "I have {s1}, {s2} and also {s3}",
    "feeling {s1} with {s2} for {duration}",
    "started having {s1} and {s2} since {duration}",
    "I am having {s1} along with {s2} and {s3}",
    "complaints of {s1} and {s2}",
    "patient has {s1} and {s2}",
    "presenting with {s1} and {s2}",
    "suffering with {s1}, {s2} since {duration}",
    "I notice {s1} and {s2}",
    "been feeling {s1} and {s2} lately",
    "{s1} and {s2} are getting worse",
    "woke up with {s1} and {s2}",
    "having {s1} and {s2} on and off for {duration}",
    "doctor I have {s1} and {s2}",
    "not feeling well, {s1} and {s2}",
    "please help, I have {s1} and {s2} since {duration}",
    "{s1} with {s2} and sometimes {s3}",
    "my child has {s1} and {s2}",
    "elderly patient with {s1} and {s2}",
    "I am a diabetic and I have {s1} and {s2}",
]

DURATIONS = [
    "2 days", "3 days", "a week", "since morning",
    "since yesterday", "4 days", "5 days", "10 days",
    "2 weeks", "3 weeks", "a month", "few hours",
    "this morning", "last night", "past 2 days"
]

# -----------------------------------------------
# EXPANDED MISSPELLINGS
# -----------------------------------------------

MISSPELLINGS = {
    "fever": ["fevr", "feever", "fver", "feveer"],
    "cough": ["couhg", "cof", "cogh", "cugh"],
    "headache": ["hedache", "headche", "headach"],
    "breathing": ["brething", "breathng", "breatihng"],
    "vomiting": ["vomting", "vomitin", "vomitng"],
    "diarrhea": ["diarrea", "diarrhoea", "diarrhia"],
    "nausea": ["nasea", "nausae", "nausia"],
    "fatigue": ["fatiuge", "fatige", "fatgue"],
    "dizziness": ["dizznes", "dizzines", "diziness"],
    "swelling": ["sweling", "sweeling", "swellng"],
    "itching": ["itchng", "itchhing", "itcing"],
    "weakness": ["weaknes", "weekness", "weaknss"],
    "bleeding": ["bleding", "bleednig", "bleedng"],
    "burning": ["burnng", "burining", "burnig"],
    "urination": ["urinaton", "urinaion", "urintion"],
}

# -----------------------------------------------
# CONFUSION GROUPS — expanded
# -----------------------------------------------

CONFUSION_GROUPS = [
    ["Flu", "COVID19", "Pneumonia", "Dengue", "ViralFever"],
    ["AnxietyAttack", "PanicAttack", "HeartAttackRisk"],
    ["Migraine", "TensionHeadache", "Meningitis"],
    ["CommonCold", "Flu", "Allergy", "Sinusitis"],
    ["Gastritis", "FoodPoisoning", "PepticUlcer", "AppendicitisR"],
    ["Dengue", "Malaria", "Typhoid"],
    ["Jaundice", "LiverDisease", "GallstoneAttack"],
    ["AnxietyAttack", "Depression"],
    ["KidneyStone", "UrinaryInfection"],
    ["Asthma", "Bronchitis", "PneumothoraxRisk"],
]

# Fix confusion group typo
CONFUSION_GROUPS = [
    [c for c in group if c in CONDITIONS]
    for group in CONFUSION_GROUPS
]


def apply_noise(text):
    words = text.split()
    for i in range(len(words)):
        w = words[i]
        if w in MISSPELLINGS and random.random() < 0.08:
            words[i] = random.choice(MISSPELLINGS[w])
    return " ".join(words)


def generate_positive_samples():
    rows = []
    for condition, symptoms in CONDITIONS.items():
        if len(symptoms) < 3:
            continue
        combos = list(combinations(symptoms, 3))
        for c in combos:
            for _ in range(3):  # 3 templates per combo
                template = random.choice(TEMPLATES)
                s1, s2, s3 = c
                try:
                    text = template.format(
                        s1=s1, s2=s2, s3=s3,
                        duration=random.choice(DURATIONS)
                    )
                except KeyError:
                    text = f"I have {s1} and {s2}"
                text = apply_noise(text)
                rows.append((text, condition))
    return rows


def generate_confusion_samples():
    rows = []
    for group in CONFUSION_GROUPS:
        if len(group) < 2:
            continue
        base_condition = group[0]
        symptoms = CONDITIONS[base_condition]
        if len(symptoms) < 3:
            continue
        combos = list(combinations(symptoms, 3))
        for c in combos:
            s1, s2, s3 = c
            template = random.choice(TEMPLATES)
            try:
                text = template.format(
                    s1=s1, s2=s2, s3=s3,
                    duration=random.choice(DURATIONS)
                )
            except KeyError:
                text = f"I have {s1} and {s2}"
            text = apply_noise(text)
            for cond in group:
                rows.append((text, cond))
    return rows


def generate_age_varied_samples():
    """Generate samples with age context for better generalization"""
    rows = []
    age_prefixes = [
        "I am {age} years old and I have",
        "My {age} year old has",
        "Patient aged {age} with",
        "{age} year old patient presenting with",
    ]
    ages = list(range(5, 85, 5))

    for condition, symptoms in CONDITIONS.items():
        if len(symptoms) < 2:
            continue
        for _ in range(20):
            age = random.choice(ages)
            prefix = random.choice(age_prefixes).format(age=age)
            s1, s2 = random.sample(symptoms, 2)
            text = f"{prefix} {s1} and {s2}"
            text = apply_noise(text)
            rows.append((text, condition))
    return rows


def expand_dataset(rows):
    expanded = []
    while len(expanded) < TARGET_SIZE:
        expanded.extend(rows)
    return expanded[:TARGET_SIZE]


def main():
    os.makedirs("dataset", exist_ok=True)

    print("Generating positive samples...")
    positive = generate_positive_samples()
    print(f"  Positive samples: {len(positive)}")

    print("Generating confusion samples...")
    confusion = generate_confusion_samples()
    print(f"  Confusion samples: {len(confusion)}")

    print("Generating age-varied samples...")
    age_varied = generate_age_varied_samples()
    print(f"  Age-varied samples: {len(age_varied)}")

    rows = positive + confusion + age_varied
    print(f"  Total unique samples: {len(rows)}")

    print("Expanding to target size...")
    dataset = expand_dataset(rows)
    random.shuffle(dataset)

    print(f"Writing {len(dataset)} samples to CSV...")
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["text", "label"])
        for r in dataset:
            writer.writerow(r)

    print("=" * 40)
    print("Dataset generated successfully!")
    print(f"Total samples: {len(dataset)}")
    print(f"Total conditions: {len(CONDITIONS)}")
    print("Conditions:", list(CONDITIONS.keys()))
    print("=" * 40)


if __name__ == "__main__":
    main()
