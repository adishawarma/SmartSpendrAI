import joblib
import pandas as pd
from datetime import datetime
import calendar

class BudgetPredictor:
    def __init__(self):
        self.model = joblib.load('mlmodels/trained_models/expense_predictor.pkl')
        self.encoder = joblib.load('mlmodels/trained_models/category_encoder.pkl')

    def predict_next_month_budget(self, user_expenses):
        """Predict next month's budget based on user's expense history"""
        if not user_expenses:
            return {"total_budget": 1000, "category_breakdown": {}}

        df = pd.DataFrame(user_expenses)
        next_month = datetime.now().month + 1
        next_year = datetime.now().year
        if next_month > 12:
            next_month = 1
            next_year += 1

        predictions = {}
        for category in self.encoder.classes_:
            category_encoded = self.encoder.transform([category])[0]

            weekday_pred = self.model.predict([[next_month, 2, 0, category_encoded]])[0]
            weekend_pred = self.model.predict([[next_month, 6, 1, category_encoded]])[0]

            days_in_month = calendar.monthrange(next_year, next_month)[1]
            weekends = sum(1 for i in range(1, days_in_month + 1)
                           if datetime(next_year, next_month, i).weekday() >= 5)
            weekdays = days_in_month - weekends

            monthly_prediction = (weekday_pred * weekdays + weekend_pred * weekends)

            predictions[category] = round(max(0, monthly_prediction), 2)

        total_budget = sum(predictions.values())
        return {
            "total_budget": round(total_budget, 2),
            "category_breakdown": predictions
        }

_predictor_instance = BudgetPredictor()

def predict_budget(month, day_of_week, is_weekend, category):
    encoded_category = _predictor_instance.encoder.transform([category])[0]
    prediction = _predictor_instance.model.predict([[month, day_of_week, is_weekend, encoded_category]])[0]
    return prediction
