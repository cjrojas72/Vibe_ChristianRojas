from models import Employee, User, Account, Transaction
from database import SessionLocal
from sqlalchemy.exc import SQLAlchemyError

from datetime import datetime

def get_all_employees():
    db = SessionLocal()
    return db.query(Employee).all()

def create_employee(name, department, salary):
    db = SessionLocal()
    emp = Employee(name=name, department=department, salary=salary)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


def createAccount(userId, accountType):
	try:
		with SessionLocal() as db:
			account = Account(
				user_id=userId,
				balance=0.0,
				account_type=accountType.lower(),
				created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			)
			db.add(account)
			db.commit()
			db.refresh(account)
			return {
				"account_id": account.account_id,
				"user_id": account.user_id,
				"balance": float(account.balance),
				"account_type": account.account_type,
				"created_at": account.created_at
			}
	except SQLAlchemyError as e:
		raise e

def getAccount(accountId):
	with SessionLocal() as db:
		account = db.query(Account).filter(Account.account_id == accountId).first()
		if not account:
			return None
		return {
			"account_id": account.account_id,
			"user_id": account.user_id,
			"balance": float(account.balance),
			"account_type": account.account_type,
			"created_at": account.created_at
		}

def deposit(accountId, amount):
	from datetime import datetime
	try:
		with SessionLocal() as db:
			account = db.query(Account).filter(Account.account_id == accountId).first()
			if not account:
				return None
			account.balance += float(amount)
			txn = Transaction(
				account_id=accountId,
				txn_type="deposit",
				amount=amount,
				created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			)
			db.add(txn)
			db.commit()
			db.refresh(account)
			return {
				"account_id": account.account_id,
				"user_id": account.user_id,
				"balance": float(account.balance),
				"account_type": account.account_type,
				"created_at": account.created_at
			}
	except SQLAlchemyError as e:
		raise e

def withdraw(accountId, amount):
	from datetime import datetime
	try:
		with SessionLocal() as db:
			account = db.query(Account).filter(Account.account_id == accountId).first()
			if not account or account.balance < float(amount):
				return None
			account.balance -= float(amount)
			txn = Transaction(
				account_id=accountId,
				txn_type="withdrawal",
				amount=amount,
				created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			)
			db.add(txn)
			db.commit()
			db.refresh(account)
			return {
				"account_id": account.account_id,
				"user_id": account.user_id,
				"balance": float(account.balance),
				"account_type": account.account_type,
				"created_at": account.created_at
			}
	except SQLAlchemyError as e:
		raise e

def getTransactions(accountId):
	with SessionLocal() as db:
		txns = db.query(Transaction).filter(Transaction.account_id == accountId).all()
		return [
			{
				"txn_id": t.txn_id,
				"account_id": t.account_id,
				"txn_type": t.txn_type,
				"amount": float(t.amount),
				"created_at": t.created_at
			}
			for t in txns
		]
