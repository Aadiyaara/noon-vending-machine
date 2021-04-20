from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request, url_for
from base64 import encodebytes
import jwt
from datetime import datetime, timedelta
from .constants import OrderStatus
from .settings import app_secret_key
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = app_secret_key

db = SQLAlchemy(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        print(token)
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        data = jwt.decode(token, app.config['SECRET_KEY'])
        try:
            current_user = Admin.query.filter_by(
                username=data['username']).first()
            print(current_user.name)
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, default='Admin')
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        print(
            f"Admin(name: '{self.name}'")


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    active_inventory = db.Column(db.Integer, nullable=False, default=0)
    image_file = db.Column(db.Text, nullable=True)
    orders = db.relationship('Order', backref='item', lazy=True)

    def __repr__(self):
        return (f"Order(Name: '{self.name}', Price: '{self.price}')")


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inbound_money = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(db.Enum(OrderStatus), nullable=False)
    refund = db.Column(db.Integer, nullable=False, default=0)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)

    def __repr__(self):
        print(
            f"Order(Inbound Amount: '{self.inbound_money}', Status: '{self.status}'), Refund: '{self.refund}''")


@app.route('/')
def home():
    return "<h1>Welcome</h1>"


@app.route('/create_admin', methods=['POST'])
@token_required
def add_admin(current_user):
    admin_data = request.get_json()

    if 'name' not in admin_data:
        return 'No Name Provided', 400

    if 'username' not in admin_data:
        return 'No Username Provided', 400

    if 'password' not in admin_data:
        return 'No Password Provided', 400

    admin_existing = Admin.query.filter_by(
        username=admin_data['username']).first()
    if admin_existing is not None:
        return 'Username already in use', 400

    hashed_password = generate_password_hash(
        admin_data['password'], method='sha256')

    new_admin = Admin(
        name=admin_data['name'], username=admin_data['username'], password=hashed_password)

    db.session.add(new_admin)
    db.session.commit()

    return 'Done', 200


@app.route('/create_order', methods=['POST'])
def add_order():
    order_data = request.get_json()

    if 'item_id' not in order_data:
        return 'No Item ID Provided', 400

    item = Item.query.get(order_data['item_id'])

    if not item:
        return 'No such item found', 400

    item_price = item.price
    refund = 0
    if(item.active_inventory < 1):
        return 'Out of Stock', 201
    if order_data['inbound_money'] < item_price:
        return 'Insufficient Funds', 201
    elif order_data['inbound_money'] > item_price:
        refund = order_data['inbound_money'] - item_price

    new_order = Order(
        item_id=order_data['item_id'], inbound_money=order_data['inbound_money'], status=OrderStatus.SUCCESSFUL, item=item, refund=refund)

    item.active_inventory = item.active_inventory - 1
    db.session.add(item)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({'refund': refund}), 200


@app.route('/login', methods=['POST'])
def login():
    auth = request.authorization
    print(auth)

    if not auth or not auth.username or not auth.password:
        return 'Username or Password invalid', 401

    admin = Admin.query.filter_by(
        username=auth.username).first()
    if not admin:
        return 'Username or Password invalid', 401
    print(auth.username)

    if check_password_hash(admin.password, auth['password']):
        token = jwt.encode({'username': admin.username, 'exp': datetime.utcnow(
        ) + timedelta(minutes=60)}, app.config['SECRET_KEY'])
        print(token.decode('UTF-8'))
        return jsonify({'token': token.decode('UTF-8')})

    return 'Username or Password invalid', 401


@app.route('/create_item', methods=['POST'])
@token_required
def add_item(current_user):
    item_data = request.form
    item_image = None

    if len(request.files) > 0:
        item_image = request.files['item_image'].read()

    if "name" not in item_data:
        return 'Item name missing', 400

    if "price" not in item_data:
        return 'Item price missing', 400

    if "active_inventory" not in item_data:
        return 'Item inventory missing', 400

    new_item = Item(name=item_data['name'], price=item_data['price'], image_file=item_image,
                    active_inventory=item_data['active_inventory'])

    db.session.add(new_item)
    db.session.commit()

    return 'Done', 200


@app.route('/update_item', methods=['POST'])
@token_required
def update_item(current_user):
    item_data = request.get_json()
    item_image = None

    if len(request.files) > 0:
        item.image_file = request.files['item_image'].read()

    if 'item_id' not in item_data:
        return 'No Item ID Provided', 400

    item = Item.query.get(item_data['item_id'])

    if not item:
        return 'No such item found', 400

    if 'name' in item_data and item_data['name'] is not None:
        item.name = item_data['name']

    if 'price' in item_data and item_data['price'] is not None:
        item.price = item_data['price']

    if 'active_inventory' in item_data and item_data['active_inventory'] is not None:
        item.active_inventory = item_data['active_inventory']

    db.session.add(item)
    db.session.commit()

    return 'Done', 200


@app.route('/items')
def items():
    items_list = Item.query.all()
    items = []

    for item in items_list:
        item_image = item.image_file
        if item_image is None:
            item_image = url_for(
                'static', filename='images/default.png')
        else:
            item_image = encodebytes(
                item_image).decode('ascii')
        items.append({'id': item.id, 'name': item.name, 'price': item.price,
                      'image_file': item_image, 'active_inventory': item.active_inventory})

    return jsonify({'items': items})


@app.route('/orders')
@token_required
def orders(current_user):
    orders_list = Order.query.all()
    order_items = []

    for order_item in orders_list:
        order_items.append({'id': order_item.id, 'item_name': order_item.item.name, 'selling_price': order_item.inbound_money - order_item.refund,
                            'inbound': order_item.inbound_money, 'refund': order_item.refund})

    return jsonify({'orders': order_items})
