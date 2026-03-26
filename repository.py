# Get all users
def getAllUsers():
	with SessionLocal() as db:
		users = db.query(User).all()
		return [
			{
				"user_id": u.user_id,
				"name": u.name,
				"email": u.email
			}
			for u in users
		]
# Get user information by user_id
def getUserById(user_id):
	with SessionLocal() as db:
		user = db.query(User).filter(User.user_id == user_id).first()
		if not user:
			return None
		return {
			"user_id": user.user_id,
			"name": user.name,
			"email": user.email
		}
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
			from decimal import Decimal
			account.balance += Decimal(str(amount))
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
			from decimal import Decimal
			if not account or account.balance < Decimal(str(amount)):
				return None
			account.balance -= Decimal(str(amount))
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

# Get all accounts for a user
def getAccountsByUser(user_id):
	with SessionLocal() as db:
		accounts = db.query(Account).filter(Account.user_id == user_id).all()
		if not accounts:
			return None
		return [
			{
				"account_id": a.account_id,
				"user_id": a.user_id,
				"balance": float(a.balance),
				"account_type": a.account_type,
				"created_at": a.created_at
			}
			for a in accounts
		]
