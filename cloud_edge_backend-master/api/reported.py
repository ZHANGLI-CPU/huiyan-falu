from flask import Blueprint, jsonify
from models import db, Events
from api.user import token_required  # 导入 JWT 验证装饰器

reported_bp = Blueprint('reported', __name__)


@reported_bp.route('/reported', methods=['GET'])
@token_required  # 添加 JWT 验证
def get_reported_against_events(user_id):
    """根据用户 ID 获取所有的被举报事件"""
    reported_against_events = Events.query.filter_by(reported_user_id=user_id).all()

    event_list = [{
        "event_id": event.event_id,
        "reporter_id": event.reporter_id,
        "reported_user_id": event.reported_user_id,
        "timestamp": event.timestamp,
        "location": event.location,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "detail_location": event.detail_location,
        "license_plate": event.license_plate,
        "violation_type": event.violation_type,
        "description": event.description,
        "scene_image": event.scene_image,
        "video": event.video,
        "report_status": event.report_status,
        "appeal_status": event.appeal_status,
        "appeal_description": event.appeal_description,
        "appeal_images": event.appeal_images,
        "estimated_processing_time": event.estimated_processing_time,

        "reporter_has_read": event.reporter_has_read,
        "reporter_has_favorited": event.reporter_has_favorited,
        "reported_user_has_favorited": event.reported_user_has_favorited,
        "reported_user_has_read": event.reported_user_has_read,

        "is_reported_user_processed": event.is_reported_user_processed
    } for event in reported_against_events]

    return jsonify({"reported_against_events": event_list}), 200



# 被举报方的已读
@reported_bp.route('/reported_mark_read/<int:event_id>', methods=['POST'])
@token_required  # 添加 JWT 验证
def mark_reported_event_read(user_id, event_id):
    event = Events.query.filter_by(event_id=event_id).first()  # 取单个对象
    if not event:
        return jsonify({"error": "事件未找到"}), 404
    
    # 验证权限：只有被举报者才能标记已读
    if event.reported_user_id != user_id:
        return jsonify({"error": "无权操作此事件"}), 403

    event.reported_user_has_read = True  # 标记为已读
    db.session.commit()  # 保存到数据库
    return jsonify({"message": "事件已标记为已读"}), 200


# 被举报方和收藏
@reported_bp.route('/reported_collected/<int:event_id>', methods=['POST'])
@token_required  # 添加 JWT 验证
def toggle_reported_event_favorite(user_id, event_id):
    event = Events.query.filter_by(event_id=event_id).first()  # 取单个对象
    if not event:
        return jsonify({"error": "事件未找到"}), 404
    
    # 验证权限：只有被举报者才能收藏/取消收藏
    if event.reported_user_id != user_id:
        return jsonify({"error": "无权操作此事件"}), 403

    event.reported_user_has_favorited = not event.reported_user_has_favorited  # 取反收藏状态
    db.session.commit()  # 保存到数据库
    return jsonify({"message": "事件收藏状态已更新", "new_status": event.reported_user_has_favorited}), 200

