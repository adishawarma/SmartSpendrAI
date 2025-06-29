from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

from sqlalchemy import ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    category = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", backref="expenses")
