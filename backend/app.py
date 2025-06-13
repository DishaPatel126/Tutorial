from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://root:root@tutorial.xkawvpq.mongodb.net/?retryWrites=true&w=majority&appName=tutorial")
db = client["tutorial"]
product_collection = db["products"]

# GET all products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = list(product_collection.find({}, {"_id": 0}))
    return jsonify(products)

# POST a new product
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400

    # Ensure ID is stored as integer
    data["id"] = int(data["id"])
    data["quantity"] = int(data["quantity"])

    if product_collection.find_one({"id": data["id"]}):
        return jsonify({"error": "Product with this ID already exists"}), 409

    product_collection.insert_one({
        "id": data["id"],
        "title": data["title"],
        "quantity": data["quantity"]
    })
    return jsonify({"message": "Product added successfully"}), 201

# PUT (update) product by ID
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400

    # Ensure numeric consistency
    data["id"] = int(data["id"])
    data["quantity"] = int(data["quantity"])

    # Only check for conflict if new ID ≠ original
    if data['id'] != product_id:
        if product_collection.find_one({'id': data['id']}):
            return jsonify({"error": "Another product with this ID already exists"}), 409

    result = product_collection.update_one(
        {"id": product_id},
        {"$set": {
            "id": data["id"],
            "title": data["title"],
            "quantity": data["quantity"]
        }}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Product updated successfully"}), 200

# DELETE a product by ID
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    result = product_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted successfully"}), 200

# (Optional) Insert test product
@app.route('/api/test-insert', methods=['GET'])
def test_insert():
    product_collection.insert_one({
        "id": 999,
        "title": "Test Mango",
        "quantity": 42
    })
    return jsonify({"message": "Inserted test product"}), 201

# Start the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)