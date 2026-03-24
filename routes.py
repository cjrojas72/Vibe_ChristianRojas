from flask import Blueprint, request, jsonify
from repository import get_all_employees, create_employee, createAccount, getAccount, deposit, withdraw, getTransactions
from sqlalchemy.exc import SQLAlchemyError

routes = Blueprint('routes', __name__)

@routes.route("/employees", methods=["GET"])
def get_employees():
    employees = get_all_employees()
    return jsonify([{
        "id": e.id,
        "name": e.name,
        "department": e.department,
        "salary": float(e.salary)
    } for e in employees])

@routes.route("/employees", methods=["POST"])
def add_employee():
    try:
        data = request.get_json()
        name = data.get("name")
        department = data.get("department")
        salary = data.get("salary")
        if not name or not department or not salary:
            return jsonify({"error": "Missing required fields"}), 400
        emp = create_employee(name, department, salary)
        return jsonify({"id": emp.id}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

@routes.route('/api/accounts', methods=['POST'])
def api_create_account():
    data = request.get_json()
    user_id = data.get("userId")
    account_type = data.get("accountType")
    if not user_id or not account_type:
        return jsonify({"error": "Missing userId or accountType"}), 400
    account = createAccount(user_id, account_type)
    return jsonify(account), 201

@routes.route('/api/accounts/<int:account_id>', methods=['GET'])
def api_get_account(account_id):
    account = getAccount(account_id)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)

@routes.route('/api/accounts/<int:account_id>/deposit', methods=['POST'])
def api_deposit(account_id):
    data = request.get_json()
    amount = data.get("amount")
    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400
    account = deposit(account_id, amount)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)

@routes.route('/api/accounts/<int:account_id>/withdraw', methods=['POST'])
def api_withdraw(account_id):
    data = request.get_json()
    amount = data.get("amount")
    if amount is None or amount <= 0:
        return jsonify({"error": "Invalid amount"}), 400
    account = withdraw(account_id, amount)
    if not account:
        return jsonify({"error": "Insufficient funds or account not found"}), 400
    return jsonify(account)

@routes.route('/api/accounts/<int:account_id>/transactions', methods=['GET'])
def api_transactions(account_id):
    txns = getTransactions(account_id)
    return jsonify(txns)

@routes.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask app!"})
