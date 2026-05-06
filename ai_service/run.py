import os
import sys


def _require_model_files():
    base = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base, "saved_model", "final_model")
    encoder_path = os.path.join(base, "saved_model", "label_encoder.pkl")

    missing = []
    if not os.path.isdir(model_dir):
        missing.append(model_dir)
    if not os.path.isfile(encoder_path):
        missing.append(encoder_path)

    if missing:
        print("ERROR: Required model files are missing.\n")
        print("Please place your trained BERT model here:")
        print(f" - {model_dir}")
        print("And your label encoder file here:")
        print(f" - {encoder_path}\n")
        print("Expected structure:")
        print(" ai_service/")
        print("   saved_model/")
        print("     final_model/          (HuggingFace model directory)")
        print("     label_encoder.pkl     (sklearn LabelEncoder pickle)")
        sys.exit(1)


if __name__ == "__main__":
    _require_model_files()
    os.system("uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload")

