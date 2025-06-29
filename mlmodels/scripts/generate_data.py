import pandas as pd
import numpy as np
from datetime import datetime
import joblib

np.random.seed(42)
dates = pd.date_range(start='2023-01-01', end='2024-12-31')
categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health']

data = []
for _ in range(2000):
    raw_date = np.random.choice(dates)
    date = pd.Timestamp(raw_date)  # ✅ Convert to Pandas Timestamp

    category = np.random.choice(categories)
    amount = max(5, {
        'Food': 25, 'Transport': 15, 'Entertainment': 40,
        'Bills': 100, 'Shopping': 60, 'Health': 80
    }[category] + np.random.normal(0, 10))

    data.append({
        'date': date,
        'category': category,
        'amount': round(amount, 2),
        'month': date.month,            # ✅ now works!
        'day_of_week': date.weekday(),  # ✅ now works!
        'is_weekend': date.weekday() >= 5
    })
df = pd.DataFrame(data)
df.to_csv('mlmodels/data/expenses.csv', index=False)
print("✅ Sample data saved.")
