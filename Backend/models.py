from sqlalchemy import Column, Integer, String, DECIMAL
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

class Account(Base):
    __tablename__ = "accounts"
    account_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    balance = Column(DECIMAL(12,2), default=0.0)
    account_type = Column(String(50), nullable=False)
    created_at = Column(String(25), nullable=False)

class Transaction(Base):
    __tablename__ = "transactions"
    txn_id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, nullable=False)
    txn_type = Column(String(50), nullable=False)
    amount = Column(DECIMAL(12,2), nullable=False)
    created_at = Column(String(25), nullable=False)

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    department = Column(String(100))
    salary = Column(DECIMAL(10,2))
