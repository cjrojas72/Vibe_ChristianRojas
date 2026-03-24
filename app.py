
# Starter Flask app
from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# In-memory collection for demonstration
items = [
    {'id': 1, 'name': 'Apple'},
    {'id': 2, 'name': 'Banana'},
    {'id': 3, 'name': 'Carrot'}
]

# Endpoint to return a fruit that starts with 'a'
@app.route('/fruit/a', methods=['GET'])
def fruit_starts_with_a():
    for item in items:
        if item['name'].lower().startswith('a'):
            return jsonify(item)
    return jsonify({'error': 'No fruit found starting with "a"'}), 404

# Home route
@app.route('/')
def home():
	return 'Flask CRUD API is running!'

# Get all items
@app.route('/items', methods=['GET'])
def get_items():
	return jsonify(items)

# Get a single item by id
@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
	for item in items:
		if item['id'] == item_id:
			return jsonify(item)
	abort(404, description='Item not found')

# Create a new item
@app.route('/items', methods=['POST'])
def create_item():
	if not request.json or 'name' not in request.json:
		abort(400, description='Name is required')
	item = {
		'id': items[-1]['id'] + 1 if items else 1,
		'name': request.json['name']
	}
	items.append(item)
	return jsonify(item), 201

# Update an item
@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
	for item in items:
		if item['id'] == item_id:
			if not request.json or 'name' not in request.json:
				abort(400, description='Name is required')
			item['name'] = request.json['name']
			return jsonify(item)
	abort(404, description='Item not found')

# Delete an item
@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
	for i, item in enumerate(items):
		if item['id'] == item_id:
			deleted = items.pop(i)
			return jsonify(deleted)
	abort(404, description='Item not found')

if __name__ == '__main__':
	app.run(debug=True)
