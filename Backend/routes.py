import jwt
import datetime
from flask import current_app
from flask import Blueprint, request, jsonify
from repository import get_all_employees, create_employee, createAccount, getAccount, deposit, withdraw, getTransactions, getAllUsers, getUserById, getAccountsByUser
from bson import ObjectId

routes = Blueprint('routes', __name__)



@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    from database import users_col
    user = users_col.find_one({'email': email})
    if not user or 'password' not in user or user['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    # In production, check hashed password here
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
    return jsonify(account), 201



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


@routes.route('/api/accounts/<account_id>', methods=['GET'])
def api_get_account(account_id):
    account = getAccount(account_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)


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


@routes.route('/api/accounts/<account_id>/transactions', methods=['GET'])
def api_transactions(account_id):
    txns = getTransactions(account_id)
    return jsonify(txns)

@routes.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask app!"})
