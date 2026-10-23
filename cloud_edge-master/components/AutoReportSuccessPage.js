import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MapView, MapType, Marker } from 'react-native-amap3d';

const DEFAULT_LATITUDE = 39.9042;
const DEFAULT_LONGITUDE = 116.4074;
const DEFAULT_ADDRESS = '北京市天安门广场';

const AutoReportSuccessPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { violationType, latitude: paramLat, longitude: paramLng, address: paramAddress, detectedTime } = route.params || {};

  const latitude = paramLat || DEFAULT_LATITUDE;
  const longitude = paramLng || DEFAULT_LONGITUDE;
  const address = paramAddress || DEFAULT_ADDRESS;

  const handleGoHome = () => {
    navigation.navigate('HomeTabs', { screen: 'homepage' });
  };

  const handleViewReports = () => {
    navigation.navigate('HomeTabs', { screen: 'message' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successHeader}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={80} color="#52c41a" />
          </View>
          <Text style={styles.successTitle}>举报提交成功</Text>
          <Text style={styles.successSubtitle}>
            系统已成功提交违章举报，等待审核中
          </Text>
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotDone]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>违章检测</Text>
              <Text style={styles.timelineTime}>{detectedTime || '已完成'}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#52c41a" />
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotDone]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>证据采集</Text>
              <Text style={styles.timelineTime}>系统自动完成</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#52c41a" />
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotDone]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>举报提交</Text>
              <Text style={styles.timelineTime}>已提交</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#52c41a" />
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotPending]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineTitle, styles.timelineTitlePending]}>审核中</Text>
              <Text style={styles.timelineTime}>预计1-3个工作日内完成</Text>
            </View>
            <Ionicons name="time" size={20} color="#faad14" />
          </View>
        </View>

        {latitude && longitude && (
          <View style={styles.mapSection}>
            <MapView
              style={styles.map}
              mapType={MapType.Standard}
              compassEnabled={false}
              scaleControlsEnabled={false}
              zoomControlsEnabled={false}
              initialCameraPosition={{
                target: { latitude, longitude },
                zoom: 16,
              }}
            >
              <Marker
                position={{ latitude, longitude }}
                title="违章发生位置"
                description={address || ''}
                color="#FF0000"
              />
            </MapView>
          </View>
        )}

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>违章类型</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{violationType || '闯红灯'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>违章地点</Text>
            <Text style={styles.detailValue}>{address || '未知'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>举报时间</Text>
            <Text style={styles.detailValue}>{detectedTime || '未知'}</Text>
          </View>

          {latitude && longitude && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>GPS坐标</Text>
              <Text style={styles.detailValueSmall}>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.rewardBanner}>
          <Ionicons name="gift" size={24} color="#52c41a" />
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>奖励提示</Text>
            <Text style={styles.rewardText}>
              若举报核实成功，您将获得50元奖励，届时将通过APP通知您
            </Text>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={18} color="#1890ff" />
          <Text style={styles.noticeText}>
            您可以在「消息」页面查看举报审核进度和结果
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoHome}
        >
          <Ionicons name="home" size={20} color="#1890ff" />
          <Text style={styles.homeButtonText}>返回首页</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={handleViewReports}
        >
          <Ionicons name="list" size={20} color="white" />
          <Text style={styles.viewButtonText}>查看举报</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  successIconCircle: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#52c41a',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  timelineCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  timelineDotDone: {
    backgroundColor: '#52c41a',
  },
  timelineDotPending: {
    backgroundColor: '#faad14',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timelineTitlePending: {
    color: '#faad14',
  },
  timelineTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E8E8E8',
    marginLeft: 5,
    marginVertical: 4,
  },
  mapSection: {
    height: 160,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  detailCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    minWidth: 70,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  detailValueSmall: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    textAlign: 'right',
  },
  typeTag: {
    backgroundColor: '#FF4D4F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F6FFED',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7EB8F',
    marginBottom: 12,
  },
  rewardContent: {
    flex: 1,
    marginLeft: 10,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#389E0D',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 13,
    color: '#52c41a',
    lineHeight: 20,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#91D5FF',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#1890ff',
    marginLeft: 8,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1890ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  homeButtonText: {
    color: '#1890ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1890ff',
    elevation: 3,
    shadowColor: '#1890ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default AutoReportSuccessPage;
