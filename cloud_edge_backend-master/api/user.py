import random
import re
import time
import jwt  # 添加导入
from datetime import datetime, timedelta  # 添加导入
from flask import Blueprint, request, jsonify, current_app  # 用于获取配置
from functools import wraps

from werkzeug.security import generate_password_hash, check_password_hash

from models import User, db  # 导入用户模型

user_blueprint = Blueprint('user', __name__)

# 用于存储验证码（模拟数据库）
# verification_codes = {}


"""
# 发送验证码接口
@user_blueprint.route('/sendverificationcode', methods=['POST'])
def send_verification_code():
    phone_number = request.json.get('phone_number')
    if not phone_number:
        return jsonify({'message': '手机号不能为空'}), 400

    # 生成验证码并存储
    code = random.randint(100000, 999999)
    verification_codes[phone_number] = {'code': code, 'expire_at': time.time() + 300}
    print(f"发送验证码: {code} 到 {phone_number}")  # 调试信息
    return jsonify({'message': '验证码发送成功'})


# 验证验证码接口
@user_blueprint.route('/verify-verification-code', methods=['POST'])
def verify_verification_code():
    print(111111111111)
    phone_number = request.json.get('phone_number')
    code = request.json.get('code')

    if phone_number in verification_codes:
        data = verification_codes[phone_number]
        if time.time() < data['expire_at'] and data['code'] == int(code):
            return jsonify({'message': '验证码验证成功'})
        return jsonify({'message': '验证码无效或已过期'}), 400
    return jsonify({'message': '验证码不存在'}), 400


"""

# 定义生成 JWT 的函数------------------------原代码，但运行时显示写法已经过时了，应该是我的pyjwt版本不一样
# def generate_token(user_id):
#     payload = {
#         "user_id": user_id,
#         "exp": datetime.utcnow() + timedelta(days=1)  # 设置过期时间为 1 天
#     }
#     token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
#     return token

# 适应我的版本代码
def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)  # 设置过期时间为 1 天
    }
    token = jwt.encode(
        payload=payload,
        key=current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token


# 定义验证 JWT 的装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"message": "缺少认证令牌"}), 401
        
        # 处理 Bearer token 格式
        if auth_header.startswith('Bearer '):
            token = auth_header.replace('Bearer ', '')
        else:
            token = auth_header
            
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "令牌已过期"}), 402
        except jwt.InvalidTokenError:
            return jsonify({"message": "无效的令牌"}), 403

        return f(user_id, *args, **kwargs)
    return decorated


# 用户注册接口
@user_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = data.get('password')
    nickname = data.get('nickname')

    if not phone_number or not password:
        return jsonify({"message": "手机号和密码不能为空"}), 400

    if User.query.filter_by(phone_number=phone_number).first():
        return jsonify({"message": "该手机号已注册"}), 409

    try:
        new_user = User(
            phone_number=phone_number,
            password_hash=generate_password_hash(password),
            nickname=nickname
        )
        db.session.add(new_user)
       
        db.session.commit()

        return jsonify({"message": "注册成功，请进行实名认证", "user_id": new_user.user_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"注册失败: {str(e)}"}), 500


# 实名认证接口
@user_blueprint.route('/real-name-verification', methods=['POST'])
def verify_real_name():
    data = request.get_json()
    user_id = data.get('user_id')
    real_name = data.get('real_name')
    id_card = data.get('id_card')

    if not user_id or not real_name or not id_card:
        return jsonify({"message": "用户 ID、真实姓名和身份证号码不能为空"}), 400

    id_card_pattern = re.compile(r'^\d{17}[\dXx]$')
    if not id_card_pattern.match(id_card):
        return jsonify({"message": "身份证号码格式不正确"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "用户不存在"}), 404

    if user.id_card:
        return jsonify({"message": "该用户已完成实名认证"}), 400

    user.userRealName = real_name
    user.id_card = id_card
    db.session.commit()

    return jsonify({"message": "实名认证成功"}), 200


# 用户登录接口
@user_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data.get('phone_number')
    password = data.get('password')

    if not phone_number or not password:
        return jsonify({"message": "手机号码和密码不能为空"}), 400

    user = User.query.filter_by(phone_number=phone_number).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "手机号码或密码错误"}), 401

    if not user.id_card:
        return jsonify({"message": "该用户尚未完成实名认证，请先进行认证"}), 403

    # 生成 JWT
    token = generate_token(user.user_id)

    return jsonify({
        "message": "登录成功",
        "token": token,  # 返回生成的 token
        "user_id": user.user_id,
        "id_card": user.id_card,
        "phone_number": user.phone_number,
        "nickname": user.nickname,
        "userRealName": user.userRealName
    }), 200


# 修改密码接口
@user_blueprint.route('/change-password', methods=['POST'])
@token_required  # 添加 JWT 验证
def change_password(user_id):
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"message": "旧密码和新密码不能为空"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "用户不存在"}), 404

    # 验证旧密码
    if not check_password_hash(user.password_hash, old_password):
        return jsonify({"message": "旧密码错误"}), 401

    # 更新密码
    try:
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"message": "密码修改成功"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"密码修改失败: {str(e)}"}), 500


# 示例：需要登录才能访问的接口
@user_blueprint.route('/protected', methods=['GET'])
@token_required
def protected_route(user_id):
    return jsonify({"message": f"欢迎用户 {user_id}，这是一个受保护的路由"}), 200
