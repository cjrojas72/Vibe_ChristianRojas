from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["bankDB"]

users_col = db["users"]
accounts_col = db["accounts"]
transactions_col = db["transactions"]
employees_col = db["employees"]