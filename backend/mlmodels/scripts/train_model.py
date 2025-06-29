import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

df = pd.read_csv('mlmodels/data/expenses.csv')
df['date'] = pd.to_datetime(df['date'])

le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

X = df[['month', 'day_of_week', 'is_weekend', 'category_encoded']]
y = df['amount']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

joblib.dump(model, 'mlmodels/trained_models/expense_predictor.pkl')
joblib.dump(le, 'mlmodels/trained_models/category_encoder.pkl')

print(f"✅ Model trained! R² score: {model.score(X_test, y_test):.3f}")
