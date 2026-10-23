// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建 Context 对象
const UserContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
});

// Provider 组件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 初始化用户状态（从 AsyncStorage 中读取 JWT）
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');

      if (storedToken) {
        setToken(storedToken);
        // 假设 decodeToken 是一个函数，用于解析 JWT
        const decodedUser = decodeToken(storedToken);
        setUser(decodedUser);

      }
    };
    loadToken();
  }, []);

  // 登出函数
  const logout = async () => {
    await AsyncStorage.removeItem('jwt');
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook
export const useUser = () => {
  return useContext(UserContext);
};

// 假设一个简单的 JWT 解码函数
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1])); // 解码 JWT 的 payload 部分
  } catch (e) {
    console.error('Invalid token');
    return null;
  }
};