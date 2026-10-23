from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone_number = db.Column(db.String(11), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nickname = db.Column(db.String(50))
    userRealName = db.Column(db.String(100))
    id_card = db.Column(db.String(20), unique=True)

    def __repr__(self):
        return f'<User {self.phone_number}>'


class Events(db.Model):
    __tablename__ = 'events'

    # 事件id 唯一标识
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 关联信息  id按 Integer 取
    reporter_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)  # 举报者id
    reported_user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=True)  # 被举报者id（手动举报时可为空）

    # 关联外键
    reporter = db.relationship('User', foreign_keys=[reporter_id])
    reported_user = db.relationship('User', foreign_keys=[reported_user_id])

    # 时间和地点
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # 时间
    location = db.Column(db.String(256), nullable=False)  # 地点
    latitude = db.Column(db.Float)  # 纬度
    longitude = db.Column(db.Float)  # 经度
    detail_location = db.Column(db.String(512))  # 详细地点（通过经纬度转换得到的完整地址）

    # 违法信息
    license_plate = db.Column(db.String(20))  # 违法车辆车牌号
    violation_type = db.Column(db.String(128), nullable=False)  # 违法类型 -- 如果改成 Integer 则需要建对应的表
    description = db.Column(db.Text)  # 事件描述
    scene_image = db.Column(db.String(256))  # 现场图（存储路径/URL）
    video = db.Column(db.String(256))  # 录像（存储路径/URL）

    # 状态管理
    report_status = db.Column(db.String(64), default='pending')  # 举报状态（pending/approved/rejected）
    appeal_status = db.Column(db.String(64))  # 申诉状态
    appeal_description = db.Column(db.Text)  # 申诉理由
    appeal_images = db.Column(db.Text)  # 申诉证据图片路径(JSON数组字符串)
    estimated_processing_time = db.Column(db.DateTime)  # 预计处理时间

    # 布尔标记
    reporter_has_read = db.Column(db.Boolean, default=False)  # 举报者是否已读
    reporter_has_favorited = db.Column(db.Boolean, default=False)  # 举报者是否收藏

    reported_user_has_read = db.Column(db.Boolean, default=False)  # 被举报者是否已读
    reported_user_has_favorited = db.Column(db.Boolean, default=False)  # 被举报者是否收藏

    # 申诉信息是否收藏也是看被举报者有没有收藏这个信息

    is_reported_user_processed = db.Column(db.Boolean, default=False)  # 被举报者是否已被处理


class HotspotLocation(db.Model):
    __tablename__ = 'hotspot_location'

    # 易发生地点id
    hotspot_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # 位置信息
    location_name = db.Column(db.String(256), nullable=False)  # 地点名称
    latitude = db.Column(db.Float, nullable=False)  # 纬度
    longitude = db.Column(db.Float, nullable=False)  # 经度
    description = db.Column(db.Text)  # 地点描述
    event_count = db.Column(db.Integer, default=0)  # 该地点发生的事件数量

    # 时间信息
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间

    def __repr__(self):
        return f'<HotspotLocation {self.location_name}>'
