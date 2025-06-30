from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.schemas import PredictRequest
from app.database import get_db  
from sqlalchemy.orm import Session
from app.models import Expense
from mlmodels.predictor import predict_budget

router = APIRouter()

@router.post("/predict-budget")
def predict(request: PredictRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        result = predict_budget(
            month=request.month,
            day_of_week=request.day_of_week,
            is_weekend=request.is_weekend,
            category=request.category
        )
        return {"prediction": round(result, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user.id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}
