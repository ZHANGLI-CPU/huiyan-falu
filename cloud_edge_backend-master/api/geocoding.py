from flask import Blueprint, request, jsonify
from api.user import token_required
import requests
import os

geocoding_bp = Blueprint('geocoding', __name__)

# 高德地图API Key（可以从环境变量或配置文件中获取）
AMAP_API_KEY = os.getenv('AMAP_API_KEY', '452f53eae3bcb8d07518277c9dd30e92')


@geocoding_bp.route('/geocoding/reverse', methods=['GET'])
@token_required
def reverse_geocoding(user_id):
    """逆地理编码：将经纬度转换为地址"""
    try:
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        
        print(f"逆地理编码请求: latitude={latitude}, longitude={longitude}")
        
        if latitude is None or longitude is None:
            print("错误: 经纬度参数缺失")
            return jsonify({"error": "请提供经纬度参数"}), 400
        
        # 验证经纬度范围
        if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
            print(f"错误: 经纬度超出有效范围 - lat: {latitude}, lng: {longitude}")
            return jsonify({"error": "经纬度超出有效范围"}), 400
        
        # 调用高德地图逆地理编码API
        url = f"https://restapi.amap.com/v3/geocode/regeo"
        params = {
            'key': AMAP_API_KEY,
            'location': f"{longitude},{latitude}",  # 高德地图API要求格式：经度,纬度
            'output': 'json',
            'radius': 1000,
            'extensions': 'all'
        }
        
        print(f"调用高德地图API: {url}, params: {params}")
        
        response = requests.get(url, params=params, timeout=10)
        print(f"高德地图API响应状态码: {response.status_code}")
        
        data = response.json()
        print(f"高德地图API响应数据: {data}")
        
        if data.get('status') == '1' and data.get('regeocode'):
            regeocode = data['regeocode']
            addressComponent = regeocode.get('addressComponent', {})
            
            # 构建完整地址
            formatted_address = regeocode.get('formatted_address', '')
            
            # 如果没有格式化地址，则手动构建
            if not formatted_address:
                province = addressComponent.get('province', '')
                city = addressComponent.get('city', '')
                district = addressComponent.get('district', '')
                township = addressComponent.get('township', '')
                street = addressComponent.get('street', '')
                streetNumber = addressComponent.get('streetNumber', '')
                
                formatted_address = f"{province}{city}{district}{township}{street}{streetNumber}".strip()
            
            result = {
                "address": formatted_address,
                "province": addressComponent.get('province', ''),
                "city": addressComponent.get('city', ''),
                "district": addressComponent.get('district', ''),
                "township": addressComponent.get('township', ''),
                "street": addressComponent.get('street', ''),
                "streetNumber": addressComponent.get('streetNumber', ''),
                "full_address": formatted_address
            }
            
            print(f"返回地址结果: {result}")
            return jsonify(result), 200
        else:
            # API调用失败，返回错误信息
            error_msg = data.get('info', '逆地理编码失败')
            error_code = data.get('infocode', '')
            print(f"高德地图API错误: {error_msg}, 错误码: {error_code}")
            return jsonify({
                "error": error_msg,
                "error_code": error_code,
                "amap_response": data
            }), 400
            
    except requests.exceptions.Timeout:
        print("错误: 请求超时")
        return jsonify({"error": "请求超时，请稍后重试"}), 500
    except requests.exceptions.RequestException as e:
        print(f"错误: 网络请求失败 - {str(e)}")
        return jsonify({"error": f"网络请求失败: {str(e)}"}), 500
    except Exception as e:
        print(f"错误: 未知异常 - {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

