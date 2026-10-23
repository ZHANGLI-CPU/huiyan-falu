import axiosInstance from './axiosInstance';

/**
 * 从后端获取车辆位置
 * @returns {Promise<{latitude: number, longitude: number}>} 返回位置对象，包含 latitude 和 longitude
 * @throws {Error} 如果获取失败或数据无效，会抛出错误
 */
export const getVehicleLocation = async () => {
  try {
    console.log('开始从后端获取位置...');
    
    const response = await axiosInstance.get('/get_location');
    
    if (response.data && 
        response.data.latitude !== null && 
        response.data.latitude !== undefined &&
        response.data.longitude !== null && 
        response.data.longitude !== undefined) {
      
      const { latitude, longitude } = response.data;
      
      // 验证位置数据有效性
      if (typeof latitude === 'number' && 
          typeof longitude === 'number' &&
          !isNaN(latitude) && 
          !isNaN(longitude) &&
          latitude >= -90 && latitude <= 90 &&
          longitude >= -180 && longitude <= 180) {
        
        const location = {
          latitude: latitude,
          longitude: longitude
        };
        
        console.log('后端位置获取成功:', location);
        return location;
      } else {
        const error = new Error('后端返回的位置数据无效');
        console.warn('后端返回的位置数据无效:', response.data);
        throw error;
      }
    } else {
      const error = new Error('后端返回的位置数据格式错误');
      console.warn('后端返回的位置数据格式错误:', response.data);
      throw error;
    }
  } catch (error) {
    console.error('获取后端位置失败:', error);
    throw error;
  }
};


