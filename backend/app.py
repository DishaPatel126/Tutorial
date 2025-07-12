from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)

# JWT secret key
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGO_URI"))
db = client["tutorial"]
users_collection = db["users"]
products_collection = db["products"]

# ----------------- AUTH MIDDLEWARE --------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            bearer = request.headers["Authorization"]
            token = bearer.split(" ")[1] if " " in bearer else bearer

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid"}), 403

        return f(*args, **kwargs)
    return decorated


@app.route("/")
def index():
    return "Backend running", 200

# ----------------- AUTH ROUTES --------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"token": token})

# ----------------- PRODUCT CRUD --------------------
@app.route("/api/products", methods=["GET"])
@token_required
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
@token_required
def add_product():
    data = request.get_json()
    if not data or 'id' not in data or 'title' not in data or 'quantity' not in data:
        return jsonify({"error": "id, title, and quantity are required"}), 400

    data["id"] = int(data["id"])
    data["quantity"] = int(data["quantity"])

    if products_collection.find_one({"id": data["id"]}):
        return jsonify({"error": "Product with this ID already exists"}), 409

    products_collection.insert_one({
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
        if products_collection.find_one({'id': data['id']}):
            return jsonify({"error": "Another product with this ID already exists"}), 409

    result = products_collection.update_one(
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

@app.route("/api/products/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(product_id):
    deleted = products_collection.delete_one({"id": product_id})

    if deleted.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Product deleted"}), 200

# ----------------- START SERVER --------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)