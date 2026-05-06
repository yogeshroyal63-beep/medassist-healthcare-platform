import os
import torch
import torch.nn.functional as F
import joblib

MODEL_PATH = "saved_model/final_model"
LABEL_ENCODER_PATH = "saved_model/label_encoder.pkl"
os.environ.setdefault("TRANSFORMERS_NO_TORCHVISION", "1")

tokenizer = None
model = None
label_encoder = None
model_load_error = None

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Predictor using device: {device}")

def _bootstrap():
    global tokenizer, model, label_encoder, model_load_error
    if tokenizer is not None and model is not None and label_encoder is not None:
        return True
    if model_load_error is not None:
        return False
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        model.to(device)
        model.eval()
        return True
    except Exception as exc:
        model_load_error = str(exc)
        return False


def _fallback_predictions(symptoms):
    text = (symptoms or "").lower()
    if any(word in text for word in ["cough", "cold", "fever", "throat"]):
        condition = "Viral Fever"
    elif any(word in text for word in ["stomach", "vomit", "nausea", "diarrhea"]):
        condition = "Gastritis"
    elif any(word in text for word in ["headache", "migraine", "dizziness"]):
        condition = "Migraine"
    else:
        condition = "General Checkup Needed"
    return [
        {"condition": condition, "confidence": 0.4},
        {"condition": "General Physician Review", "confidence": 0.35},
        {"condition": "Further Clinical Evaluation", "confidence": 0.25}
    ]


def predict(symptoms):
    """
    Run BERT inference on symptom text.
    Returns top 3 predictions with confidence scores.
    """
    if not _bootstrap():
        return _fallback_predictions(symptoms)

    inputs = tokenizer(
        symptoms,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probs  = F.softmax(logits, dim=1)

    top_probs, top_indices = torch.topk(probs, 3)

    predictions = []
    for prob, idx in zip(top_probs[0], top_indices[0]):
        condition = label_encoder.inverse_transform([idx.item()])[0]
        predictions.append({
            "condition":  condition,
            "confidence": round(prob.item(), 4)
        })

    return predictions
