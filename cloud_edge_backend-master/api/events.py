from flask import Blueprint, request, jsonify
from models import db, Events
from api.user import token_required  # 导入 JWT 验证装饰器
import os
import requests

events_bp = Blueprint('events', __name__)

@events_bp.route('/events/submit', methods=['POST'])
@token_required  # 添加 JWT 验证
def submit_event(user_id):
    """提交举报事件"""
    try:
        data = request.json

        latitude = data.get('latitude')
        longitude = data.get('longitude')

        detail_location = None
        if latitude is not None and longitude is not None:
            try:
                lat_value = float(latitude)
                lng_value = float(longitude)

                if -90 <= lat_value <= 90 and -180 <= lng_value <= 180:
                    amap_api_key = os.getenv('AMAP_API_KEY', '452f53eae3bcb8d07518277c9dd30e92')
                    url = "https://restapi.amap.com/v3/geocode/regeo"
                    params = {
                        'key': amap_api_key,
                        'location': f"{lng_value},{lat_value}",
                        'output': 'json',
                        'radius': 1000,
                        'extensions': 'all'
                    }

                    response = requests.get(url, params=params, timeout=10)
                    data_resp = response.json()

                    if data_resp.get('status') == '1' and data_resp.get('regeocode'):
                        regeocode = data_resp['regeocode']
                        address_component = regeocode.get('addressComponent', {})
                        formatted_address = regeocode.get('formatted_address', '')

                        if not formatted_address:
                            province = address_component.get('province', '')
                            city = address_component.get('city', '')
                            district = address_component.get('district', '')
                            township = address_component.get('township', '')
                            street = address_component.get('street', '')
                            street_number = address_component.get('streetNumber', '')
                            formatted_address = f"{province}{city}{district}{township}{street}{street_number}".strip()

                        if formatted_address:
                            detail_location = formatted_address
            except Exception:
                detail_location = None
        reported_user_id = data.get('reported_user_id')
        license_plate = data.get('license_plate')

        new_event = Events(
            reporter_id=user_id,  # 使用 JWT 中的 user_id
            reported_user_id=reported_user_id if reported_user_id else None,
            location=data.get('location'),
            latitude=latitude,
            longitude=longitude,
            license_plate=license_plate,
            violation_type=data.get('violation_type'),
            description=data.get('description'),
            scene_image=data.get('scene_image'),
            video=data.get('video'),
            detail_location=detail_location
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify({"message": "Event submitted successfully", "event_id": new_event.event_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@events_bp.route('/events/<int:event_id>/detail_location', methods=['PUT', 'PATCH'])
@token_required  # 添加 JWT 验证
def update_event_detail_location(user_id, event_id):
    """更新事件的详细地址"""
    try:
        event = Events.query.filter_by(event_id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        # 验证用户权限：只有举报者或被举报者可以更新
        if event.reporter_id != user_id and event.reported_user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        data = request.json
        detail_location = data.get('detail_location')
        
        if detail_location and isinstance(detail_location, str):
            event.detail_location = detail_location.strip()
            db.session.commit()
            return jsonify({"message": "Detail location updated successfully", "detail_location": event.detail_location}), 200
        else:
            return jsonify({"error": "Invalid detail_location"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@events_bp.route('/events/<int:event_id>/appeal_status', methods=['PUT', 'PATCH'])
@token_required  # 添加 JWT 验证
def update_event_appeal_status(user_id, event_id):
    """更新事件的申诉状态"""
    try:
        event = Events.query.filter_by(event_id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # 仅举报者或被举报者可修改申诉状态
        if event.reporter_id != user_id and event.reported_user_id != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        data = request.json or {}
        appeal_status = data.get('appeal_status', '').strip() if isinstance(data.get('appeal_status'), str) else data.get('appeal_status')

        if appeal_status is None or appeal_status == '':
            return jsonify({"error": "Invalid appeal_status"}), 400

        event.appeal_status = appeal_status
        db.session.commit()
        return jsonify({"message": "Appeal status updated successfully", "appeal_status": event.appeal_status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

