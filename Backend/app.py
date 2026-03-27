# Boilerplate Flask app with CORS
from flask_cors import CORS
from flask import Flask, request, jsonify

# Mock data collections for USERS, ACCOUNTS, TRANSACTIONS
# users = [
# 	{"user_id": 1, "name": "Alice Smith", "email": "alice@example.com"},
# 	{"user_id": 2, "name": "Bob Johnson", "email": "bob@example.com"},
# 	{"user_id": 3, "name": "Charlie Lee", "email": "charlie@example.com"},
# ]

# accounts = [
# 	{"account_id": 1, "user_id": 1, "balance": 1500.00, "account_type": "checking", "created_at": "2026-03-01 10:00:00"},
# 	{"account_id": 2, "user_id": 1, "balance": 3200.50, "account_type": "savings", "created_at": "2026-03-02 11:30:00"},
# 	{"account_id": 3, "user_id": 2, "balance": 500.00, "account_type": "checking", "created_at": "2026-03-03 09:15:00"},
# ]

# transactions = [
# 	{"txn_id": 1, "account_id": 1, "txn_type": "deposit", "amount": 1000.00, "created_at": "2026-03-01 10:05:00"},
# 	{"txn_id": 2, "account_id": 1, "txn_type": "withdrawal", "amount": 200.00, "created_at": "2026-03-01 12:00:00"},
# 	{"txn_id": 3, "account_id": 2, "txn_type": "deposit", "amount": 3200.50, "created_at": "2026-03-02 11:35:00"},
# 	{"txn_id": 4, "account_id": 3, "txn_type": "deposit", "amount": 500.00, "created_at": "2026-03-03 09:20:00"},
# ]


app = Flask(__name__)
# Enable CORS for all origins, all headers, all methods, and credentials (for debugging)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers="*",
    expose_headers="*",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
)

# Register routes from routes.py
from routes import routes as routes_blueprint
app.register_blueprint(routes_blueprint)
print(app.url_map)

if __name__ == '__main__':
    app.run(debug=True)
    
