from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

products = [
    {"id": 1, "title": "MacBook"}
]

@app.route('/api/products', methods=['GET', 'POST'])
def handle_products():
    if request.method == 'GET':
        return jsonify(products)
    if request.method == 'POST':
        new_product = request.get_json()
        if not new_product or 'title' not in new_product:
            return jsonify({"error": "Title is required"}), 400
        new_id = products[-1]["id"] + 1 if products else 1
        new_entry = {"id": new_id, "title": new_product["title"]}
        products.append(new_entry)
        return jsonify(new_entry), 201

@app.route('/api/products/<int:product_id>', methods=['PUT', 'DELETE'])
def modify_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if request.method == 'PUT':
        data = request.get_json()
        if not data or 'title' not in data:
            return jsonify({"error": "Title is required"}), 400
        product['title'] = data['title']
        return jsonify(product)

    if request.method == 'DELETE':
        products.remove(product)
        return jsonify({"message": "Product deleted"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
