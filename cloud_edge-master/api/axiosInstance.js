import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_BASE_URL = 'http://10.82.24.155:5000/api'//用于真机调试——WHUTwifi
//const API_BASE_URL = 'http://192.168.76.150:5000/api'//手机热点
const API_BASE_URL = 'http://127.0.0.1:5000/api';//用于模拟器调试


// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动添加 token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        config.headers.Authorization = token;
      }
    } catch (error) {
      console.error('获取 token 失败:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理常见错误
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('认证失败：', error.response.data?.message);
    } else if (error.response?.status === 402) {
      console.error('令牌已过期');
    } else if (error.response?.status === 403) {
      console.error('权限不足：', error.response.data?.error || error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };

const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/100';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${SERVER_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

