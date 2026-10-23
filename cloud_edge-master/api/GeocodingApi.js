import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 高德地图 API Key
 * 注意：如果 Web API 调用失败，请在高德地图控制台申请 Web 服务 API Key
 * 获取方式：https://console.amap.com/dev/key/app
 * 注意：Android SDK Key 和 Web 服务 Key 是不同的，需要分别申请
 */
const AMAP_WEB_API_KEY = '452f53eae3bcb8d07518277c9dd30e92'; // 使用项目中的 API Key（如果 Web API 不可用，请替换为 Web 服务 Key）
const GEO_CACHE_PREFIX = 'geocode_cache:';
const geoCache = new Map();

const buildCacheKey = (latitude, longitude) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }
  return `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
};

const getCachedAddress = async (latitude, longitude) => {
  const cacheKey = buildCacheKey(latitude, longitude);
  if (!cacheKey) {
    return null;
  }

  if (geoCache.has(cacheKey)) {
    return geoCache.get(cacheKey);
  }

  try {
    const stored = await AsyncStorage.getItem(`${GEO_CACHE_PREFIX}${cacheKey}`);
    if (stored) {
      geoCache.set(cacheKey, stored);
      return stored;
    }
  } catch (error) {
    console.warn('读取地址缓存失败:', error.message);
  }

  return null;
};

const setCachedAddress = async (latitude, longitude, address) => {
  const cacheKey = buildCacheKey(latitude, longitude);
  if (!cacheKey || !address) {
    return;
  }
  geoCache.set(cacheKey, address);
  try {
    await AsyncStorage.setItem(`${GEO_CACHE_PREFIX}${cacheKey}`, address);
  } catch (error) {
    console.warn('写入地址缓存失败:', error.message);
  }
};

/**
 * 使用高德地图 Web API 进行反向地理编码（经纬度转地址）
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<{full_address: string, address: string, province: string, city: string, district: string}>}
 */
export const reverseGeocoding = async (latitude, longitude) => {
  try {
    // 验证输入参数
    if (!latitude || !longitude) {
      throw new Error('经纬度参数不能为空');
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('经纬度必须是数字类型');
    }

    // 检查 API Key 是否已配置
    if (!AMAP_WEB_API_KEY || AMAP_WEB_API_KEY === 'YOUR_AMAP_API_KEY') {
      console.warn('高德地图 API Key 未配置，无法进行地址转换');
      throw new Error('API Key 未配置');
    }

    // 调用高德地图逆地理编码 API
    const response = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
      params: {
        key: AMAP_WEB_API_KEY,
        location: `${longitude},${latitude}`, // 高德地图要求格式：经度,纬度
        output: 'json',
        radius: 1000, // 搜索半径（米）
        extensions: 'all', // 返回详细信息
      },
      timeout: 10000, // 10秒超时，防止弱网环境请求失败
    });

    if (response.data && response.data.status === '1' && response.data.regeocode) {
      const regeocode = response.data.regeocode;
      const addressComponent = regeocode.addressComponent || {};

      // 构建完整地址
      const fullAddress = regeocode.formatted_address || '';
      
      // 构建简化地址（省市区 + 街道）
      const addressParts = [
        addressComponent.province,
        addressComponent.city,
        addressComponent.district,
        addressComponent.street,
        addressComponent.streetNumber,
      ].filter(Boolean); // 过滤空值

      const address = addressParts.join('') || fullAddress;

      return {
        full_address: fullAddress,
        address: address,
        province: addressComponent.province || '',
        city: addressComponent.city || '',
        district: addressComponent.district || '',
        street: addressComponent.street || '',
        streetNumber: addressComponent.streetNumber || '',
      };
    } else {
      throw new Error(response.data?.info || '地址转换失败');
    }
  } catch (error) {
    console.error('反向地理编码失败:', error.message);
    throw error;
  }
};

/**
 * 使用后端 API 进行反向地理编码（如果后端支持）
 * 这是一个备选方案，如果高德地图 API 不可用，可以调用后端接口
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<{full_address: string, address: string}>}
 */
export const reverseGeocodingFromBackend = async (latitude, longitude) => {
  try {
    const axiosInstance = (await import('./axiosInstance')).default;
    
    const response = await axiosInstance.post('/reverse_geocoding', {
      latitude,
      longitude,
    });

    if (response.data && response.data.address) {
      return {
        full_address: response.data.full_address || response.data.address,
        address: response.data.address,
      };
    } else {
      throw new Error('后端返回数据格式错误');
    }
  } catch (error) {
    console.error('后端地址转换失败:', error.message);
    throw error;
  }
};

/**
 * 智能地址转换：优先使用高德地图，失败则尝试后端，最后返回默认值
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @param {string} fallbackAddress - 备用地址（如果转换失败）
 * @returns {Promise<string>} 返回地址字符串
 */
export const smartReverseGeocoding = async (latitude, longitude, fallbackAddress = '地址获取中...') => {
  try {
    const cached = await getCachedAddress(latitude, longitude);
    if (cached) {
      return cached;
    }

    // 优先使用高德地图 API
    const result = await reverseGeocoding(latitude, longitude);
    const resolvedAddress = result.full_address || result.address || fallbackAddress;
    await setCachedAddress(latitude, longitude, resolvedAddress);
    return resolvedAddress;
  } catch (error) {
    console.warn('高德地图地址转换失败，使用备用地址:', error.message);
    return fallbackAddress;
  }
};

