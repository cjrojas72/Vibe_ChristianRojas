# Boilerplate Flask app with CORS
from flask import Flask, jsonify
from flask_cors import CORS

# Mock data collections for USERS, ACCOUNTS, TRANSACTIONS
users = [
	{"user_id": 1, "name": "Alice Smith", "email": "alice@example.com"},
	{"user_id": 2, "name": "Bob Johnson", "email": "bob@example.com"},
	{"user_id": 3, "name": "Charlie Lee", "email": "charlie@example.com"},
]

accounts = [
	{"account_id": 1, "user_id": 1, "balance": 1500.00, "account_type": "checking", "created_at": "2026-03-01 10:00:00"},
	{"account_id": 2, "user_id": 1, "balance": 3200.50, "account_type": "savings", "created_at": "2026-03-02 11:30:00"},
	{"account_id": 3, "user_id": 2, "balance": 500.00, "account_type": "checking", "created_at": "2026-03-03 09:15:00"},
]

transactions = [
	{"txn_id": 1, "account_id": 1, "txn_type": "deposit", "amount": 1000.00, "created_at": "2026-03-01 10:05:00"},
	{"txn_id": 2, "account_id": 1, "txn_type": "withdrawal", "amount": 200.00, "created_at": "2026-03-01 12:00:00"},
	{"txn_id": 3, "account_id": 2, "txn_type": "deposit", "amount": 3200.50, "created_at": "2026-03-02 11:35:00"},
	{"txn_id": 4, "account_id": 3, "txn_type": "deposit", "amount": 500.00, "created_at": "2026-03-03 09:20:00"},
]


app = Flask(__name__)
CORS(app)

# --- Business Logic Methods ---
from datetime import datetime

def createAccount(userId, accountType):
	new_id = max([a["account_id"] for a in accounts], default=0) + 1
	account = {
		"account_id": new_id,
		"user_id": userId,
		"balance": 0.0,
		"account_type": accountType.lower(),
		"created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	}
	accounts.append(account)
	return account

def getAccount(accountId):
	return next((a for a in accounts if a["account_id"] == accountId), None)

def deposit(accountId, amount):
	account = getAccount(accountId)
	if account:
		account["balance"] += amount
		txn_id = max([t["txn_id"] for t in transactions], default=0) + 1
		txn = {
			"txn_id": txn_id,
			"account_id": accountId,
			"txn_type": "deposit",
			"amount": amount,
			"created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
		}
		transactions.append(txn)
		return account
	return None

def withdraw(accountId, amount):
	account = getAccount(accountId)
	if account and account["balance"] >= amount:
		account["balance"] -= amount
		txn_id = max([t["txn_id"] for t in transactions], default=0) + 1
		txn = {
			"txn_id": txn_id,
			"account_id": accountId,
			"txn_type": "withdrawal",
			"amount": amount,
			"created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
		}
		transactions.append(txn)
		return account
	return None

def getTransactions(accountId):
	return [t for t in transactions if t["account_id"] == accountId]

# --- API Routes ---
from flask import request

# Create Account
@app.route('/api/accounts', methods=['POST'])
def api_create_account():
	data = request.get_json()
	user_id = data.get("userId")
	account_type = data.get("accountType")
	if not user_id or not account_type:
		return jsonify({"error": "Missing userId or accountType"}), 400
	account = createAccount(user_id, account_type)
	return jsonify(account), 201

# Get Account Details
@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def api_get_account(account_id):
	account = getAccount(account_id)
	if not account:
		return jsonify({"error": "Account not found"}), 404
	return jsonify(account)

# Deposit Money
@app.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def api_deposit(account_id):
	data = request.get_json()
	amount = data.get("amount")
	if amount is None or amount <= 0:
		return jsonify({"error": "Invalid amount"}), 400
	account = deposit(account_id, amount)
	if not account:
		return jsonify({"error": "Account not found"}), 404
	return jsonify(account)

# Withdraw Money
@app.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def api_withdraw(account_id):
	data = request.get_json()
	amount = data.get("amount")
	if amount is None or amount <= 0:
		return jsonify({"error": "Invalid amount"}), 400
	account = withdraw(account_id, amount)
	if not account:
		return jsonify({"error": "Insufficient funds or account not found"}), 400
	return jsonify(account)

# Transaction History
@app.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def api_transactions(account_id):
	txns = getTransactions(account_id)
	return jsonify(txns)

@app.route('/')
def home():
	return jsonify({"message": "Welcome to the Flask app!"})

if __name__ == '__main__':
	app.run(debug=True)
