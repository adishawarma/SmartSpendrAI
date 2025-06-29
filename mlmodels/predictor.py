import joblib
import numpy as np

# Load model and encoder
model = joblib.load("mlmodels/trained_models/expense_predictor.pkl")
encoder = joblib.load("mlmodels/trained_models/category_encoder.pkl")

def predict_budget(month: int, day_of_week: int, is_weekend: bool, category: str) -> float:
    category_encoded = encoder.transform([category])[0]
    features = np.array([[month, day_of_week, is_weekend, category_encoded]])
    prediction = model.predict(features)
    return float(prediction[0])
