from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initial product list
products = [
    {"id": 1, "title": "MacBook", "quantity": 10}
]

@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        for product in products:
            if 'quantity' not in product:
                product['quantity'] = 0
        return jsonify(products)

    if request.method == 'POST':
        new_product = request.get_json()
        if not new_product or 'title' not in new_product or 'id' not in new_product:
            return jsonify({"error": "id and title are required"}), 400

        quantity = new_product.get('quantity', 0)

        if any(p['id'] == new_product['id'] for p in products):
            return jsonify({"error": "Product with this ID already exists"}), 409

        new_entry = {
            "id": new_product['id'],
            "title": new_product['title'],
            "quantity": quantity
        }

        products.append(new_entry)
        return jsonify(new_entry), 201

@app.route('/api/products/<int:product_id>', methods=['PUT', 'DELETE'])
def modify_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if request.method == 'PUT':
        data = request.get_json()
        if not data or 'title' not in data or 'id' not in data or 'quantity' not in data:
            return jsonify({"error": "id, title, and quantity are required"}), 400

        # Check if new ID already exists in a different product
        if any(p['id'] == data['id'] and p['id'] != product_id for p in products):
            return jsonify({"error": "Another product with this ID already exists"}), 409

        # Remove the old product
        products.remove(product)

        # Add the updated product
        updated_product = {
            "id": data['id'],
            "title": data['title'],
            "quantity": data['quantity']
        }
        products.append(updated_product)

        # Optional: sort list by ID for consistent order
        products.sort(key=lambda p: p['id'])

        return jsonify(updated_product)

    if request.method == 'DELETE':
        products.remove(product)
        return jsonify({"message": "Product deleted"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
