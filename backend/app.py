from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# SQLAlchemy (for user accounts)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# MongoDB (for products)
mongo_client = MongoClient(os.getenv("MONGO_URI"))
mdb = mongo_client["tutorial"]
product_collection = mdb["products"]

# --- SQLAlchemy User model ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))

# --- JWT Middleware ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except:
                return jsonify({'error': 'Token format invalid'}), 401
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(email=data['email']).first()
        except:
            return jsonify({'error': 'Invalid or expired token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# --- AUTH ROUTES ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'All fields required'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'], password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    token = jwt.encode({
        'email': new_user.email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = jwt.encode({
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})

# --- PRODUCT ROUTES (MongoDB + JWT Protected) ---

@app.route('/api/products', methods=['GET'])
@token_required
def get_products(current_user):
    products = list(product_collection.find({}, {"_id": 0}))
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
@token_required
def add_product(current_user):
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400
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

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400
    data["id"] = int(data["id"])
    data["quantity"] = int(data["quantity"])
    if data['id'] != product_id and product_collection.find_one({'id': data['id']}):
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

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    result = product_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted successfully"}), 200

# Optional test insert
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
    with app.app_context():
        db.create_all()  # Creates tables once at startup
    app.run(host='0.0.0.0', port=5000, debug=True)



# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient

# app = Flask(__name__)
# CORS(app)

# # Connect to MongoDB Atlas
# client = MongoClient("mongodb+srv://root:root@tutorial.xkawvpq.mongodb.net/?retryWrites=true&w=majority&appName=tutorial")
# db = client["tutorial"]
# product_collection = db["products"]

# # GET all products
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     products = list(product_collection.find({}, {"_id": 0}))
#     return jsonify(products)

# # POST a new product
# @app.route('/api/products', methods=['POST'])
# def add_product():
#     data = request.get_json()
#     if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
#         return jsonify({"error": "id, title, and quantity are required"}), 400

#     # Ensure ID is stored as integer
#     data["id"] = int(data["id"])
#     data["quantity"] = int(data["quantity"])

#     if product_collection.find_one({"id": data["id"]}):
#         return jsonify({"error": "Product with this ID already exists"}), 409

#     product_collection.insert_one({
#         "id": data["id"],
#         "title": data["title"],
#         "quantity": data["quantity"]
#     })
#     return jsonify({"message": "Product added successfully"}), 201

# # PUT (update) product by ID
# @app.route('/api/products/<int:product_id>', methods=['PUT'])
# def update_product(product_id):
#     data = request.get_json()
#     if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
#         return jsonify({"error": "id, title, and quantity are required"}), 400

#     # Ensure numeric consistency
#     data["id"] = int(data["id"])
#     data["quantity"] = int(data["quantity"])

#     # Only check for conflict if new ID ≠ original
#     if data['id'] != product_id:
#         if product_collection.find_one({'id': data['id']}):
#             return jsonify({"error": "Another product with this ID already exists"}), 409

#     result = product_collection.update_one(
#         {"id": product_id},
#         {"$set": {
#             "id": data["id"],
#             "title": data["title"],
#             "quantity": data["quantity"]
#         }}
#     )

#     if result.matched_count == 0:
#         return jsonify({"error": "Product not found"}), 404

#     return jsonify({"message": "Product updated successfully"}), 200

# # DELETE a product by ID
# @app.route('/api/products/<int:product_id>', methods=['DELETE'])
# def delete_product(product_id):
#     result = product_collection.delete_one({"id": product_id})
#     if result.deleted_count == 0:
#         return jsonify({"error": "Product not found"}), 404
#     return jsonify({"message": "Product deleted successfully"}), 200

# # (Optional) Insert test product
# @app.route('/api/test-insert', methods=['GET'])
# def test_insert():
#     product_collection.insert_one({
#         "id": 999,
#         "title": "Test Mango",
#         "quantity": 42
#     })
#     return jsonify({"message": "Inserted test product"}), 201

# # Start the server
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)