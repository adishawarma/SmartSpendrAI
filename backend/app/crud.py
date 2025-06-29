from app.models import Expense

def create_expense(db: Session, user_id: int, expense: schemas.ExpenseCreate):
    db_expense = Expense(**expense.dict(), owner_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses_by_user(db: Session, user_id: int):
    return db.query(Expense).filter(Expense.owner_id == user_id).all()
