from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app import schemas, crud, auth
from fastapi import Depends
from app.schemas import ExpenseCreate, ExpenseOut
from app.crud import create_expense, get_expenses_by_user
from app.dependencies import get_current_user
from app.routes import predict
from mlmodels.predictor import predict_budget



app = FastAPI()

app.include_router(predict.router)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "SmartSpendr Backend is working!"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user.email, user.password)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/expenses", response_model=ExpenseOut)
def add_expense(expense: ExpenseCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_expense(db, user.id, expense)

@app.get("/expenses", response_model=list[ExpenseOut])
def list_expenses(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_expenses_by_user(db, user.id)

@app.get("/predict-budget")
def get_budget_prediction(user=Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = get_expenses_by_user(db, user.id)
    if not expenses:
        return {"prediction": 0.0}
    
    latest = max(expenses, key=lambda e: e.date)
    prediction = predict_budget(
        month=latest.date.month,
        day_of_week=latest.date.weekday(),
        is_weekend=int(latest.date.weekday() >= 5),
        category=latest.category
    )
    return {"prediction": round(prediction, 2)}


from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
def login_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

