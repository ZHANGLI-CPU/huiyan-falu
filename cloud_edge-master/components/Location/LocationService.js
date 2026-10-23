import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

class LocationService {
  // 请求定位权限
  static async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '位置权限申请',
            message: '应用需要访问您的位置信息',
            buttonPositive: '同意',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS在Info.plist中配置即可
  }

  // 获取当前经纬度
  static async getCurrentLocation() {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('位置权限被拒绝');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          // @react-native-community/geolocation 返回的格式是 position.coords
          const { longitude, latitude } = position.coords;
          console.log(`获取到位置: ${longitude}, ${latitude}`);
          resolve({ longitude, latitude });
        },
        (error) => {
          console.error('获取位置失败:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true, // 高精度模式
          timeout: 15000, // 15秒超时
          maximumAge: 10000, // 允许使用10秒内的缓存位置
        }
      );
    });
  }
}

// //持续监听位置
// static startWatchingPosition(callback) {
//   const hasPermission = await this.requestLocationPermission();
//   if (!hasPermission) {
//     throw new Error('位置权限被拒绝');
//   }

//   this.watchId = Geolocation.watchPosition(
//     (position) => {
//       const { longitude, latitude } = position;
//       callback({ longitude, latitude });
//     },
//     (error) => {
//       console.error('位置监听错误:', error);
//     },
//     {
//       enableHighAccuracy: true,
//       distanceFilter: 10, // 移动10米以上才更新
//       interval: 5000, // 5秒更新一次
//     }
//   );
// }

// // 停止监听
// static stopWatchingPosition() {
//   if (this.watchId) {
//     Geolocation.clearWatch(this.watchId);
//   }
// }

export { LocationService };