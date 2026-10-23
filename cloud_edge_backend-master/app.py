# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from api.events import events_bp
from api.appeals import appeals_bp
from api.reports import reports_bp
from api.reported import reported_bp
from api.user import user_blueprint
from api.hotspots import hotspots_bp
from api.geocoding import geocoding_bp
from api.user import token_required

from flask import request, send_from_directory
import random
import time
import os
import uuid


# 用于存储验证码（模拟数据库）
verification_codes = {}
# 可能无法并发

app = Flask(__name__)
CORS(app)

# 加载配置
app.config.from_object(Config)
# 初始化数据库
db.init_app(app)
# 注册蓝图
app.register_blueprint(events_bp, url_prefix='/api')
app.register_blueprint(appeals_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')
app.register_blueprint(reported_bp, url_prefix='/api')
app.register_blueprint(user_blueprint, url_prefix='/api')
app.register_blueprint(hotspots_bp, url_prefix='/api')
app.register_blueprint(geocoding_bp, url_prefix='/api')

# 创建所有表
with app.app_context():
    db.create_all()

migrate = Migrate(app, db)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file(user_id):
    if 'file' not in request.files:
        return jsonify({"error": "没有文件"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "未选择文件"}), 400
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
        return jsonify({"error": "不支持的文件格式"}), 400
    filename = f"{uuid.uuid4().hex}{ext}"
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    url = f"/uploads/{filename}"
    return jsonify({"message": "上传成功", "url": url}), 200


@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# 主页路由
@app.route("/")
def index():
    return "Hello, World!"
    



# 车辆位置接口
@app.route('/api/get_location', methods=['GET'])
def get_location():
    return jsonify({
        "latitude": 39.909187,  # 北京天安门
        "longitude": 116.397451

        # "latitude": 37.421998333333335,#系统给我的定位，应该是错的
        # "longitude": -122.084

        # "latitude": 29.58,  # 武汉
        # "longitude": 113.41
    })


# 发送验证码接口
@app.route('/api/sendVerificationCode', methods=['POST'])
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
@app.route('/api/verifVerificationCode', methods=['POST'])
def verify_verification_code():
    phone_number = request.json.get('phone_number')
    code = request.json.get('code')

    if phone_number in verification_codes:
        data = verification_codes[phone_number]
        if time.time() < data['expire_at'] and data['code'] == int(code):
            return jsonify({'message': '验证码验证成功'})
        return jsonify({'message': '验证码无效或已过期'}), 400
    return jsonify({'message': '验证码不存在'}), 400




# 宝塔中不会执行
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)












