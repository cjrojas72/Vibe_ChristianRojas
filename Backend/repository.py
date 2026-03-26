# MongoDB CRUD operations using pymongo
from bson import ObjectId
from datetime import datetime
from database import users_col, accounts_col, transactions_col, employees_col

# USERS
def getAllUsers():
    users = users_col.find()
    return [
        {
            "user_id": str(u["_id"]),
            "name": u["name"],
            "email": u["email"]
        }
        for u in users
    ]

def getUserById(user_id):
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None
    return {
        "user_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }

# EMPLOYEES
def get_all_employees():
    employees = employees_col.find()
    return [
        {
            "id": str(e["_id"]),
            "name": e["name"],
            "department": e["department"],
            "salary": float(e["salary"]),
            "email": e["email"],
        }
        for e in employees
    ]

def create_employee(name, department, salary):
    emp = {
        "name": name,
        "department": department,
        "salary": float(salary)
    }
    result = employees_col.insert_one(emp)
    emp["_id"] = result.inserted_id
    return emp

# ACCOUNTS
def createAccount(userId, accountType):
    account = {
        "user_id": ObjectId(userId),
        "balance": 0.0,
        "account_type": accountType.lower(),
        "created_at": datetime.utcnow()
    }
    result = accounts_col.insert_one(account)
    account["account_id"] = str(result.inserted_id)
    account["user_id"] = str(account["user_id"])
    account["created_at"] = account["created_at"].isoformat()
    return account

def getAccount(accountId):
    account = accounts_col.find_one({"_id": ObjectId(accountId)})
    if not account:
        return None
    return {
        "account_id": str(account["_id"]),
        "user_id": str(account["user_id"]),
        "balance": float(account["balance"]),
        "account_type": account["account_type"],
        "created_at": account["created_at"].isoformat() if isinstance(account["created_at"], datetime) else account["created_at"]
    }

def getAccountsByUser(user_id):
    accounts = accounts_col.find({"user_id": ObjectId(user_id)})
    result = []
    for a in accounts:
        result.append({
            "account_id": str(a["_id"]),
            "user_id": str(a["user_id"]),
            "balance": float(a["balance"]),
            "account_type": a["account_type"],
            "created_at": a["created_at"].isoformat() if isinstance(a["created_at"], datetime) else a["created_at"]
        })
    return result if result else None

# TRANSACTIONS & BALANCE UPDATES
def deposit(accountId, amount):
    account = accounts_col.find_one({"_id": ObjectId(accountId)})
    if not account:
        return None
    new_balance = float(account["balance"]) + float(amount)
    accounts_col.update_one({"_id": ObjectId(accountId)}, {"$set": {"balance": new_balance}})
    txn = {
        "account_id": ObjectId(accountId),
        "txn_type": "deposit",
        "amount": float(amount),
        "created_at": datetime.utcnow()
    }
    transactions_col.insert_one(txn)
    account["balance"] = new_balance
    account["created_at"] = account["created_at"].isoformat() if isinstance(account["created_at"], datetime) else account["created_at"]
    return {
        "account_id": str(account["_id"]),
        "user_id": str(account["user_id"]),
        "balance": new_balance,
        "account_type": account["account_type"],
        "created_at": account["created_at"]
    }

def withdraw(accountId, amount):
    account = accounts_col.find_one({"_id": ObjectId(accountId)})
    if not account or float(account["balance"]) < float(amount):
        return None
    new_balance = float(account["balance"]) - float(amount)
    accounts_col.update_one({"_id": ObjectId(accountId)}, {"$set": {"balance": new_balance}})
    txn = {
        "account_id": ObjectId(accountId),
        "txn_type": "withdrawal",
        "amount": float(amount),
        "created_at": datetime.utcnow()
    }
    transactions_col.insert_one(txn)
    account["balance"] = new_balance
    account["created_at"] = account["created_at"].isoformat() if isinstance(account["created_at"], datetime) else account["created_at"]
    return {
        "account_id": str(account["_id"]),
        "user_id": str(account["user_id"]),
        "balance": new_balance,
        "account_type": account["account_type"],
        "created_at": account["created_at"]
    }

def getTransactions(accountId):
    txns = transactions_col.find({"account_id": ObjectId(accountId)})
    return [
        {
            "txn_id": str(t["_id"]),
            "account_id": str(t["account_id"]),
            "txn_type": t["txn_type"],
            "amount": float(t["amount"]),
            "created_at": t["created_at"].isoformat() if isinstance(t["created_at"], datetime) else t["created_at"]
        }
        for t in txns
    ]
