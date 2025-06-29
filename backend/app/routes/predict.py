from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.schemas import PredictRequest
from app.database import SessionLocal
from mlmodels.predictor import predict_budget

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/predict-budget")
def predict(request: PredictRequest, user=Depends(get_current_user), db=Depends(get_db)):
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
