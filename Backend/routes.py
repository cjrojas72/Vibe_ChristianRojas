import jwt
import datetime
from flask import current_app
from flask import Blueprint, request, jsonify
from repository import get_all_employees, create_employee, createAccount, getAccount, deposit, withdraw, getTransactions, getAllUsers, getUserById, getAccountsByUser, createUser, deleteAccount, updateAccount, deleteTransaction, updateTransaction, login_user, updateUser, deleteUser
from bson import ObjectId

routes = Blueprint('routes', __name__)



@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    user = login_user(email, password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    user_id = str(user['_id'])
    user_role = user.get('role', 'customer')
    payload = {
        'user_id': user_id,
        'role': user_role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    secret = current_app.config.get('JWT_SECRET', 'dev_secret')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return jsonify({'user_id': user_id, 'role': user_role, 'token': token})

@routes.route("/employees", methods=["GET"])
def get_employees():
    employees = get_all_employees()
    return jsonify(employees)


@routes.route("/employees", methods=["POST"])
def add_employee():
    data = request.get_json()
    name = data.get("name")
    department = data.get("department")
    salary = data.get("salary")
    if not name or not department or not salary:
        return jsonify({"error": "Missing required fields"}), 400
    emp = create_employee(name, department, salary)
    return jsonify({"id": str(emp["_id"])}), 201


@routes.route('/api/accounts', methods=['POST'])
def api_create_account():
    data = request.get_json()
    user_id = data.get("userId")
    account_type = data.get("accountType")
    if not user_id or not account_type:
        return jsonify({"error": "Missing userId or accountType"}), 400
    account = createAccount(user_id, account_type)
    # Convert ObjectId fields to strings for JSON serialization
    account_dict = dict(account)
    if '_id' in account_dict:
        account_dict['_id'] = str(account_dict['_id'])
    # Optionally convert user_id if present and is ObjectId
    if 'user_id' in account_dict and isinstance(account_dict['user_id'], ObjectId):
        account_dict['user_id'] = str(account_dict['user_id'])
    return jsonify(account_dict), 201



# Route to get all users
@routes.route('/api/users', methods=['GET'])
def api_get_all_users():
    users = getAllUsers()
    return jsonify(users)


# Route to get all accounts for a user
@routes.route('/api/users/<user_id>/accounts', methods=['GET'])
def api_get_user_accounts(user_id):
    accounts = getAccountsByUser(user_id)
    if accounts is None:
        return jsonify({"error": "User not found or no accounts"}), 404
    return jsonify(accounts)


# Route to get user information
@routes.route('/api/users/<user_id>', methods=['GET'])
def api_get_user(user_id):
    user = getUserById(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)


# Route to get account information
@routes.route('/api/accounts/<account_id>', methods=['GET'])
def api_get_account(account_id):
    account = getAccount(account_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)


# Route to deposit money into an account
@routes.route('/api/accounts/<account_id>/deposit', methods=['POST'])
def api_deposit(account_id):
    data = request.get_json()
    amount = float(data.get("amount"))
    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400
    account = deposit(account_id, amount)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)

# Route to withdraw money from an account
@routes.route('/api/accounts/<account_id>/withdraw', methods=['POST'])
def api_withdraw(account_id):
    data = request.get_json()
    amount = float(data.get("amount"))
    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400
    account = withdraw(account_id, amount)
    if not account:
        return jsonify({"error": "Insufficient funds or account not found"}), 400
    return jsonify(account)

# Route to get all transactions for an account
@routes.route('/api/accounts/<account_id>/transactions', methods=['GET'])
def api_transactions(account_id):
    txns = getTransactions(account_id)
    return jsonify(txns)

# --- API EXTENSIONS ---

# Route to create a new user
@routes.route('/api/users', methods=['POST'])
def api_create_user():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "customer")
    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    user = createUser(name, email, password, role)
    # Convert ObjectId to string for JSON serialization
    user_dict = dict(user)
    if '_id' in user_dict:
        user_dict['_id'] = str(user_dict['_id'])
    return jsonify(user_dict), 201

# Route to delete an account
@routes.route('/api/accounts/<account_id>', methods=['DELETE'])
def api_delete_account(account_id):
    success = deleteAccount(account_id)
    if not success:
        return jsonify({"error": "Account not found"}), 404
    return jsonify({"message": "Account deleted"}), 200

# Route to update an account
@routes.route('/api/accounts/<account_id>', methods=['PATCH'])
def api_update_account(account_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No update fields provided"}), 400
    success = updateAccount(account_id, data)
    if not success:
        return jsonify({"error": "Account not found or not updated"}), 404
    return jsonify({"message": "Account updated"}), 200

# Route to delete a transaction
@routes.route('/api/accounts/<account_id>/transactions/<transaction_id>', methods=['DELETE'])
def api_delete_transaction(account_id, transaction_id):
    success = deleteTransaction(account_id, transaction_id)
    if not success:
        return jsonify({"error": "Transaction not found"}), 404
    return jsonify({"message": "Transaction deleted"}), 200

# Route to update a transaction
@routes.route('/api/accounts/<account_id>/transactions/<transaction_id>', methods=['PATCH'])
def api_update_transaction(account_id, transaction_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No update fields provided"}), 400
    success = updateTransaction(account_id, transaction_id, data)
    if not success:
        return jsonify({"error": "Transaction not found or not updated"}), 404
    return jsonify({"message": "Transaction updated"}), 200

# --- USER EXTENSIONS ---

# Route to update a user
@routes.route('/api/users/<user_id>', methods=['PATCH'])
def api_update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No update fields provided"}), 400
    success = updateUser(user_id, data)
    if not success:
        return jsonify({"error": "User not found or not updated"}), 404
    return jsonify({"message": "User updated"}), 200

# Route to delete a user
@routes.route('/api/users/<user_id>', methods=['DELETE'])
def api_delete_user(user_id):
    success = deleteUser(user_id)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"}), 200

@routes.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask app!"})
