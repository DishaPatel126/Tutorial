from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import bcrypt
import jwt
import datetime
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ========== MongoDB for Products ==========
mongo_client = MongoClient(os.getenv("MONGOURI"))
mongo_db = mongo_client["tutorial"]
product_collection = mongo_db["products"]

# ========== SQLAlchemy for Users ==========
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ========== JWT Secret ==========
SECRET_KEY = os.getenv("SECRET_KEY")

# ========== SQLAlchemy User Model ==========
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# ========== AUTH ROUTES ==========

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already registered"}), 409

    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    new_user = User(name=name, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 200


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password.encode()):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})


# ========== Auth Middleware ==========

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            token = bearer.replace("Bearer ", "")

        if not token:
            return jsonify({'error': 'Token missing'}), 401

        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated


# ========== PRODUCTS ROUTES (MongoDB) ==========

@app.route('/api/products', methods=['GET'])
@token_required  
def get_products(current_user):
    products = list(product_collection.find({}, {"_id": 0}))
    return jsonify(products)


@app.route('/api/products', methods=['POST'])
@token_required
def add_product():
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
def update_product(product_id):
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400

    data["id"] = int(data["id"])
    data["quantity"] = int(data["quantity"])

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


@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    result = product_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted successfully"}), 200


# ========== Start Server ==========

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
