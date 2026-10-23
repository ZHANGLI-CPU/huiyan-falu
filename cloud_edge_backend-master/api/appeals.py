from flask import Blueprint, request, jsonify
from models import db, Events
from api.user import token_required  # 导入 JWT 验证装饰器

appeals_bp = Blueprint('appeals', __name__)

@appeals_bp.route('/appeals', methods=['GET'])
@token_required  # 添加 JWT 验证
def get_appeals(user_id):
    """根据用户 ID 获取所有的申诉事件"""
    appealed_events = Events.query.filter(Events.reported_user_id == user_id, Events.appeal_status.isnot(None)).all()
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
    } for event in appealed_events]

    return jsonify({"appealed_events": event_list}), 200


@appeals_bp.route('/appeals/submit', methods=['POST'])
@token_required
def submit_appeal(user_id):
    """提交申诉"""
    try:
        data = request.json
        event_id = data.get('event_id')
        appeal_description = data.get('appeal_description')
        appeal_images = data.get('appeal_images')

        if not event_id:
            return jsonify({"error": "event_id 不能为空"}), 400

        if not appeal_description or not appeal_description.strip():
            return jsonify({"error": "申诉理由不能为空"}), 400

        event = Events.query.filter_by(event_id=event_id).first()
        if not event:
            return jsonify({"error": "事件未找到"}), 404

        if event.reported_user_id != user_id:
            return jsonify({"error": "无权操作此事件，只有被举报者可以申诉"}), 403

        event.appeal_status = 'pending'
        event.appeal_description = appeal_description.strip()
        event.appeal_images = appeal_images

        db.session.commit()
        return jsonify({"message": "申诉提交成功", "appeal_status": event.appeal_status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
