# MongoDB collections are used instead of SQLAlchemy models.
# See database.py for collection setup.
#
# users: { _id: ObjectId, name: str, email: str }
# accounts: { _id: ObjectId, user_id: ObjectId, balance: float, account_type: str, created_at: datetime }
# transactions: { _id: ObjectId, account_id: ObjectId, txn_type: str, amount: float, created_at: datetime }
# employees: { _id: ObjectId, name: str, department: str, salary: float }
