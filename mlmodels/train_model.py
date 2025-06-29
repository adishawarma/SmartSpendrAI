import pandas as pd
import pickle
from sklearn.linear_model import LinearRegression

df = pd.read_csv("mlmodels/scripts/expenses_data.csv")

# Group by month, sum expenses
monthly = df.groupby("month")["amount"].sum().reset_index()

X = monthly[["month"]]
y = monthly["amount"]

model = LinearRegression()
model.fit(X, y)

with open("mlmodels/budget_model.pkl", "wb") as f:
    pickle.dump(model, f)
