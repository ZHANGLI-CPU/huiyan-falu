import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LocationService } from './LocationService';

const MapLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取当前位置
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);

      // 获取到经纬度后，可以进行逆地理编码
      if (currentLocation) {
        const addressInfo = await reverseGeocode(
          currentLocation.latitude,
          currentLocation.longitude
        );
        setAddress(addressInfo);
      }
    } catch (error) {
      console.error('获取位置失败:', error);
      alert('获取位置失败，请检查位置权限是否开启');
    } finally {
      setLoading(false);
    }
  };

  // 逆地理编码 - 将经纬度转换为具体地址
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const result = await Geocode.fromCoord(latitude, longitude);
      if (result && result.address) {
        return result.address;
      }
      return '未知地址';
    } catch (error) {
      console.error('逆地理编码失败:', error);
      return '地址解析失败';
    }
  };

  useEffect(() => {
    // 组件加载时自动获取位置
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={loading ? "定位中..." : "获取当前位置"}
        onPress={getCurrentLocation}
        disabled={loading}
      />

      {location && (
        <View style={styles.locationInfo}>
          <Text>经度: {location.longitude}</Text>
          <Text>纬度: {location.latitude}</Text>
          {address && <Text>地址: {address}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  locationInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});

export default MapLocation;