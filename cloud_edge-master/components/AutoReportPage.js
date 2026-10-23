import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MapView, MapType, Marker } from 'react-native-amap3d';
import Toast from 'react-native-toast-message';
import { submitEvent } from '../api/EventApi';

const AUTO_EVIDENCE_IMAGE = 'https://via.placeholder.com/800x450/FF4444/FFFFFF?text=Auto+Captured+Evidence';

const DEFAULT_LATITUDE = 39.9042;
const DEFAULT_LONGITUDE = 116.4074;
const DEFAULT_ADDRESS = '北京市天安门广场';

const AutoReportPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { latitude: paramLat, longitude: paramLng, address: paramAddress } = route.params || {};

  const latitude = paramLat || DEFAULT_LATITUDE;
  const longitude = paramLng || DEFAULT_LONGITUDE;
  const address = paramAddress || DEFAULT_ADDRESS;

  const [submitting, setSubmitting] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const formatCurrentTime = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  };

  const violationType = '闯红灯';
  const detectedTime = formatCurrentTime();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const eventData = {
        violation_type: violationType,
        license_plate: null,
        location: address || null,
        latitude: latitude || null,
        longitude: longitude || null,
        description: '系统智能分析自动检测到闯红灯违章行为，已自动采集证据',
        scene_image: AUTO_EVIDENCE_IMAGE,
      };

      await submitEvent(eventData);

      Toast.show({ type: 'customSuccess', text1: '举报提交成功' });
      navigation.replace('AutoReportSuccessPage', {
        violationType,
        address: address || null,
        latitude,
        longitude,
        detectedTime,
      });
    } catch (error) {
      console.error('提交举报失败:', error);
      Toast.show({ type: 'customError', text1: '提交失败，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" type="ionicons" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>违章举报确认</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.alertBanner}>
          <Ionicons name="alert-circle" size={22} color="#faad14" />
          <Text style={styles.alertText}>智能系统检测到前方车辆存在闯红灯违章行为</Text>
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
                description={address || '当前位置'}
                color="#FF0000"
              />
            </MapView>
          </View>
        )}

        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color="#1890ff" />
            <Text style={styles.cardTitle}>违章信息</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>违章类型</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{violationType}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>违章时间</Text>
            <Text style={styles.infoValue}>{detectedTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>违章地点</Text>
            <Text style={styles.infoValue}>{address || '定位中...'}</Text>
          </View>

          {latitude && longitude && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GPS坐标</Text>
              <Text style={styles.infoValueSmall}>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.evidenceCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="camera" size={20} color="#1890ff" />
            <Text style={styles.cardTitle}>系统采集证据</Text>
          </View>

          <TouchableOpacity onPress={() => setFullscreenImage(AUTO_EVIDENCE_IMAGE)}>
            <View style={styles.evidenceContainer}>
              <Image
                source={{ uri: AUTO_EVIDENCE_IMAGE }}
                style={styles.evidenceImage}
                resizeMode="cover"
              />
              <View style={styles.evidenceOverlay}>
                <Ionicons name="expand" size={24} color="white" />
                <Text style={styles.evidenceOverlayText}>点击放大查看</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.evidenceNote}>
            <Ionicons name="information-circle" size={16} color="#999" />
            <Text style={styles.evidenceNoteText}>
              系统已自动拍摄并保存违章证据图片，若核实成功，将能得到50元奖励
            </Text>
          </View>
        </View>

        <View style={styles.rewardCard}>
          <Ionicons name="gift" size={20} color="#52c41a" />
          <Text style={styles.rewardText}>举报成功后，若核实有效可获得50元奖励</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <View style={styles.submittingRow}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.confirmButtonText}>  提交中...</Text>
            </View>
          ) : (
            <View style={styles.submittingRow}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.confirmButtonText}>  确认举报</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {fullscreenImage && (
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity
            style={styles.fullscreenClose}
            onPress={() => setFullscreenImage(null)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: fullscreenImage }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE58F',
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#874D00',
    marginLeft: 10,
    lineHeight: 20,
  },
  mapSection: {
    height: 180,
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    minWidth: 70,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  infoValueSmall: {
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
  evidenceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  evidenceContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  evidenceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  evidenceOverlayText: {
    color: 'white',
    fontSize: 13,
    marginLeft: 6,
  },
  evidenceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  evidenceNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
    lineHeight: 18,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFED',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7EB8F',
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    color: '#389E0D',
    marginLeft: 10,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1890ff',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: '#1890ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FF4D4F',
    elevation: 3,
    shadowColor: '#FF4D4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#FFA39E',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  fullscreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fullscreenClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10000,
  },
});

export default AutoReportPage;
