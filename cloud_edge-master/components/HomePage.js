import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapView, MapType, Marker } from 'react-native-amap3d';
import { Geolocation, init as initAMapGeolocation, setOnceLocation } from 'react-native-amap-geolocation';
import CustomModal from './CustomModal';
import { getNearbyHotspots } from '../api/HotspotApi';

const DEFAULT_LOCATION = {
  latitude: 39.9042,
  longitude: 116.4074,
};

const HomePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonSelected, setIsButtonSelected] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [nearbyHotspots, setNearbyHotspots] = useState([]);
  const mapRef = useRef(null);
  const locationUpdatedRef = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    const initLocation = async () => {
      let permissionGranted = false;

      if (Platform.OS === 'android') {
        try {
          const results = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          const fineGranted = results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
          const coarseGranted = results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
          console.log('权限结果 - FINE:', fineGranted, 'COARSE:', coarseGranted);
          permissionGranted = fineGranted || coarseGranted;
          if (!permissionGranted) {
            console.log('位置权限被拒绝，使用默认位置');
          }
        } catch (err) {
          console.log('请求位置权限错误:', err);
        }
      } else {
        permissionGranted = true;
      }

      setLocationPermissionGranted(true);

      try {
        await initAMapGeolocation({
          android: 'd264533eccf820b1700ce2d570849ba5',
          ios: 'd264533eccf820b1700ce2d570849ba5',
        });
        console.log('高德定位 SDK 初始化成功');
      } catch (err) {
        console.log('高德定位 SDK 初始化失败:', err);
      }

      if (!permissionGranted) {
        setCurrentLocation(DEFAULT_LOCATION);
        setIsLoadingLocation(false);
      }
    };

    initLocation();
  }, []);

  const applyLocation = useCallback((latitude, longitude, accuracy, address) => {
    const accuracyMeters = typeof accuracy === 'number' ? accuracy : null;
    setCurrentLocation((prev) => {
      const newLocation = {
        latitude,
        longitude,
        accuracy: accuracyMeters,
        address: address || (prev?.address) || null,
      };
      return newLocation;
    });
    setIsLoadingLocation(false);
    console.log('✓ 定位成功:', latitude.toFixed(6), longitude.toFixed(6),
      accuracyMeters != null ? `精度${accuracyMeters.toFixed(0)}m` : '',
      address ? `地址:${address}` : '(保留已有地址)');

    if (!locationUpdatedRef.current) {
      locationUpdatedRef.current = true;
      if (mapRef.current) {
        try {
          mapRef.current.moveCamera(
            { target: { latitude, longitude }, zoom: 15 },
            500,
          );
        } catch (e) {
          console.warn('移动相机失败:', e);
        }
      }
    }

    fetchNearbyHotspots(latitude, longitude);
  }, []);

  const fetchNearbyHotspots = useCallback(async (latitude, longitude) => {
    try {
      const hotspots = await getNearbyHotspots(latitude, longitude, 3000);
      setNearbyHotspots(hotspots);
      console.log(`✓ 找到 ${hotspots.length} 个附近的易发生地点`);
    } catch (error) {
      console.error('获取附近易发生地点失败:', error);
      setNearbyHotspots([]);
    }
  }, []);

  const requestFallbackLocation = useCallback(() => {
    console.log('使用高德定位 SDK 获取位置');
    try {
      setOnceLocation(true);
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const address = position.location?.address || position.location?.description || '';
          console.log('✓ 高德定位成功:', latitude, longitude, '精度:', accuracy, '地址:', address);
          applyLocation(latitude, longitude, accuracy, address);
        },
        (error) => {
          console.log('高德定位失败(模拟器环境)，使用默认位置 - 错误码:', error?.code, '信息:', error?.message);
          if (!locationUpdatedRef.current) {
            setIsLoadingLocation(false);
            setCurrentLocation(DEFAULT_LOCATION);
            locationUpdatedRef.current = true;
          }
        },
      );
    } catch (err) {
      console.log('调用高德定位出错(模拟器环境)，使用默认位置:', err);
      if (!locationUpdatedRef.current) {
        setIsLoadingLocation(false);
        setCurrentLocation(DEFAULT_LOCATION);
        locationUpdatedRef.current = true;
      }
    }
  }, [applyLocation]);

  useEffect(() => {
    if (locationPermissionGranted) {
      requestFallbackLocation();
    }
  }, [locationPermissionGranted, requestFallbackLocation]);

  const handleLocationUpdate = ({ nativeEvent }) => {
    let latitude, longitude, accuracy;

    if (nativeEvent?.coords) {
      latitude = nativeEvent.coords.latitude;
      longitude = nativeEvent.coords.longitude;
      accuracy = nativeEvent.coords.accuracy;
    } else if (nativeEvent?.latitude !== undefined && nativeEvent?.longitude !== undefined) {
      latitude = nativeEvent.latitude;
      longitude = nativeEvent.longitude;
      accuracy = nativeEvent.accuracy;
    } else {
      return;
    }

    if (latitude === undefined || longitude === undefined) return;
    if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
      isNaN(latitude) || isNaN(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return;

    applyLocation(latitude, longitude, accuracy);
  };

  const handleButtonClick = (button) => {
    setIsButtonSelected(button);

    if (button === 'yes') {
      setModalVisible(false);
      setIsButtonSelected(null);
      navigation.navigate('AutoReportPage', {
        latitude: currentLocation?.latitude || null,
        longitude: currentLocation?.longitude || null,
        address: currentLocation?.address || null,
      });
      return;
    }

    if (button !== null) {
      setModalVisible(false);
      setTimeout(() => {
        setIsButtonSelected(null);
      }, 200);
    }
  };

  const handleMapLoad = () => {
    console.log('地图加载完成');
    setIsMapReady(true);
    setMapError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {isMapReady && currentLocation && (
          <View style={styles.mapStatusIndicator}>
            <Text style={styles.mapStatusText}>
              📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            {currentLocation.accuracy !== null && currentLocation.accuracy !== undefined && (
              <Text style={styles.mapStatusSubText}>
                精度: {currentLocation.accuracy.toFixed(0)}m
                {currentLocation.accuracy > 500 && ' (精度较差)'}
              </Text>
            )}
            {nearbyHotspots.length > 0 && (
              <Text style={styles.mapStatusSubText}>
                ⚠️ 附近有 {nearbyHotspots.length} 个易发生地点
              </Text>
            )}
          </View>
        )}

        {locationPermissionGranted && (
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType={MapType.Standard}
            onLoad={handleMapLoad}
            compassEnabled={true}
            scaleControlsEnabled={true}
            zoomControlsEnabled={true}
            myLocationEnabled={true}
            myLocationButtonEnabled={true}
            onLocation={handleLocationUpdate}
            initialCameraPosition={{
              target: {
                latitude: DEFAULT_LOCATION.latitude,
                longitude: DEFAULT_LOCATION.longitude,
              },
              zoom: 15,
            }}
          >
            {nearbyHotspots.map((hotspot) => (
              <Marker
                key={hotspot.hotspot_id}
                position={{
                  latitude: hotspot.latitude,
                  longitude: hotspot.longitude,
                }}
                title={hotspot.location_name || "易发生地点"}
                description={`距离: ${hotspot.distance}m | 事件数: ${hotspot.event_count || 0}`}
                color="#FF6B00"
                opacity={1}
                draggable={false}
              />
            ))}
          </MapView>
        )}

        {isLoadingLocation && !currentLocation && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>正在获取位置...</Text>
              <Text style={styles.loadingSubText}>请确保GPS已开启</Text>
            </View>
          </View>
        )}

        {mapError && (
          <View style={styles.errorOverlay}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>地图加载失败</Text>
              <Text style={styles.errorSubText}>{mapError.message || '请检查网络连接和API Key配置'}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setMapError(null)}
              >
                <Text style={styles.retryButtonText}>重试</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.floatingButtonText}>违章提示</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualReportButton}
            onPress={() => {
              if (currentLocation) {
                navigation.navigate('NextPage', {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  detailLocation: currentLocation.address || null,
                });
              } else {
                navigation.navigate('NextPage');
              }
            }}
          >
            <Text style={styles.floatingButtonText}>手动举报</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="违章提示"
        content="经智能分析，前方车辆存在闯红灯违章行为，若核实成功，将能得到50元奖励。系统已自动拍摄并保存证据。为一同维护道路安全，您是否选择举报该行为："
        iconName="warning"
        iconColor="#faad14"
        buttons={[
          {
            text: '否',
            onPress: () => handleButtonClick('no'),
            style: { backgroundColor: 'white', borderWidth: 1, borderColor: '#1890ff' },
            textStyle: { color: '#1890ff' }
          },
          {
            text: '是',
            onPress: () => handleButtonClick('yes'),
            style: { backgroundColor: '#1890ff' },
            textStyle: { color: 'white' }
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f0f0f0', // 添加背景色以便调试
    width: '100%',
    height: '100%',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  mapStatusIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
    zIndex: 1000,
    minWidth: 200,
  },
  mapStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapStatusSubText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.9,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  floatingButton: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  manualReportButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#999',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  errorContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4d4f',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomePage;

