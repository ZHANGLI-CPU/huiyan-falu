from flask import Blueprint, request, jsonify
from models import db, HotspotLocation
from api.user import token_required
import math

hotspots_bp = Blueprint('hotspots', __name__)


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    使用Haversine公式计算两个经纬度之间的距离（单位：米）
    """
    # 地球半径（米）
    R = 6371000
    
    # 转换为弧度
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    # Haversine公式
    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # 距离（米）
    distance = R * c
    return distance


@hotspots_bp.route('/hotspots/nearby', methods=['GET'])
@token_required
def get_nearby_hotspots(user_id):
    """获取用户附近3千米内的易发生地点"""
    try:
        # 获取用户当前位置
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        max_distance = request.args.get('max_distance', default=3000, type=float)  # 默认3千米
        
        if not latitude or not longitude:
            return jsonify({"error": "请提供经纬度参数"}), 400
        
        # 获取所有易发生地点
        all_hotspots = HotspotLocation.query.all()
        
        # 筛选距离用户3千米内的地点
        nearby_hotspots = []
        for hotspot in all_hotspots:
            distance = calculate_distance(
                latitude, longitude,
                hotspot.latitude, hotspot.longitude
            )
            if distance <= max_distance:
                nearby_hotspots.append({
                    "hotspot_id": hotspot.hotspot_id,
                    "location_name": hotspot.location_name,
                    "latitude": hotspot.latitude,
                    "longitude": hotspot.longitude,
                    "description": hotspot.description,
                    "event_count": hotspot.event_count,
                    "distance": round(distance, 2)  # 距离（米），保留2位小数
                })
        
        # 按距离排序
        nearby_hotspots.sort(key=lambda x: x['distance'])
        
        return jsonify({
            "hotspots": nearby_hotspots,
            "count": len(nearby_hotspots)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@hotspots_bp.route('/hotspots', methods=['GET'])
@token_required
def get_all_hotspots(user_id):
    """获取所有易发生地点（管理员功能）"""
    try:
        hotspots = HotspotLocation.query.all()
        hotspot_list = [{
            "hotspot_id": h.hotspot_id,
            "location_name": h.location_name,
            "latitude": h.latitude,
            "longitude": h.longitude,
            "description": h.description,
            "event_count": h.event_count,
            "created_at": h.created_at.isoformat() if h.created_at else None,
            "updated_at": h.updated_at.isoformat() if h.updated_at else None
        } for h in hotspots]
        
        return jsonify({"hotspots": hotspot_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@hotspots_bp.route('/hotspots', methods=['POST'])
@token_required
def create_hotspot(user_id):
    """创建新的易发生地点（管理员功能）"""
    try:
        data = request.json
        new_hotspot = HotspotLocation(
            location_name=data.get('location_name'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            description=data.get('description'),
            event_count=data.get('event_count', 0)
        )
        db.session.add(new_hotspot)
        db.session.commit()
        return jsonify({
            "message": "易发生地点创建成功",
            "hotspot_id": new_hotspot.hotspot_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@hotspots_bp.route('/hotspots/<int:hotspot_id>', methods=['PUT'])
@token_required
def update_hotspot(user_id, hotspot_id):
    """更新易发生地点（管理员功能）"""
    try:
        hotspot = HotspotLocation.query.get(hotspot_id)
        if not hotspot:
            return jsonify({"error": "易发生地点未找到"}), 404
        
        data = request.json
        if 'location_name' in data:
            hotspot.location_name = data['location_name']
        if 'latitude' in data:
            hotspot.latitude = data['latitude']
        if 'longitude' in data:
            hotspot.longitude = data['longitude']
        if 'description' in data:
            hotspot.description = data['description']
        if 'event_count' in data:
            hotspot.event_count = data['event_count']
        
        db.session.commit()
        return jsonify({"message": "易发生地点更新成功"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@hotspots_bp.route('/hotspots/<int:hotspot_id>', methods=['DELETE'])
@token_required
def delete_hotspot(user_id, hotspot_id):
    """删除易发生地点（管理员功能）"""
    try:
        hotspot = HotspotLocation.query.get(hotspot_id)
        if not hotspot:
            return jsonify({"error": "易发生地点未找到"}), 404
        
        db.session.delete(hotspot)
        db.session.commit()
        return jsonify({"message": "易发生地点删除成功"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
