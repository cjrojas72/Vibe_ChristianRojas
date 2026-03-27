import os
from pymongo import MongoClient

# Get MongoDB URI from environment variable, fallback to localhost for dev
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URI)
db = client["bankDB"]

users_col = db["users"]
accounts_col = db["accounts"]
transactions_col = db["transactions"]
employees_col = db["employees"]