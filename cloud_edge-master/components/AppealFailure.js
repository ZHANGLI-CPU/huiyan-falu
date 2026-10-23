import React, { useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert, ScrollView, Modal, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import { MapView, MapType, Marker } from 'react-native-amap3d';
import { Card, List, Tag } from '@ant-design/react-native';
import { resolveImageUrl } from '../api/axiosInstance';

const AppealFailure = ({ selectedCard, handleCloseModal }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const showFullText = (label, value) => {
    if (!value) return;
    Alert.alert(label, String(value));
  };

  const appealImages = useMemo(() => {
    const raw = selectedCard?.appeal_images;
    console.log('[AppealFailure] appeal_images raw:', raw, 'type:', typeof raw);
    if (!raw || raw === 'null' || raw === 'undefined') return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [raw];
      } catch {
        if (raw.startsWith('/') || raw.startsWith('http')) return [raw];
        return [];
      }
    }
    return [];
  }, [selectedCard?.appeal_images]);
  console.log('[AppealFailure] appealImages resolved:', appealImages);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mapSection}>
          {selectedCard && selectedCard.latitude && selectedCard.longitude ? (
            <MapView
              style={styles.map}
              mapType={MapType.Standard}
              compassEnabled={true}
              scaleControlsEnabled={true}
              zoomControlsEnabled={true}
              initialCameraPosition={{
                target: {
                  latitude: selectedCard.latitude,
                  longitude: selectedCard.longitude,
                },
                zoom: 16,
              }}
            >
              <Marker
                position={{
                  latitude: selectedCard.latitude,
                  longitude: selectedCard.longitude,
                }}
                title="事件位置"
                description={selectedCard.address || '申诉事件位置'}
                color="#FF0000"
                opacity={1}
                draggable={false}
              />
            </MapView>
          ) : selectedCard?.address ? (
            <View style={styles.noMapContainer}>
              <Ionicons name="map-outline" size={48} color="#999" />
              <Text style={styles.noMapText}>暂无地图坐标</Text>
              <Text style={styles.noMapAddress}>{selectedCard.address}</Text>
            </View>
          ) : (
            <View style={styles.noMapContainer}>
              <Ionicons name="map-outline" size={48} color="#999" />
              <Text style={styles.noMapText}>暂无位置信息</Text>
            </View>
          )}
          {selectedCard?.address && selectedCard.latitude && selectedCard.longitude ? (
            <View style={styles.mapAddressLabel}>
              <Ionicons name="location" size={14} color="#FF4444" />
              <Text style={styles.mapAddressText} numberOfLines={2}>{selectedCard.address}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Card style={styles.infoCard}>
              <Card.Header
                title={<Text style={styles.cardTitle}>申诉信息</Text>}
                thumb={<Icon name="times-circle" type="font-awesome" color="#F44336" size={18} />}
              />
              <Card.Body>
                <List>
                  {selectedCard?.licensePlate ? (
                    <List.Item extra={selectedCard.licensePlate} style={styles.listItem}>
                      车牌号
                    </List.Item>
                  ) : null}
                  <List.Item
                    extra={selectedCard?.address || '暂无'}
                    style={styles.listItem}
                    onPress={() => showFullText('地点', selectedCard?.address || '暂无')}
                  >
                    地点
                  </List.Item>
                  <List.Item
                    extra={selectedCard?.time || '暂无'}
                    style={styles.listItem}
                    onPress={() => showFullText('时间', selectedCard?.time || '暂无')}
                  >
                    时间
                  </List.Item>
                  <List.Item
                    extra={
                      selectedCard?.violation_type ? (
                        <Tag color="red">{selectedCard.violation_type}</Tag>
                      ) : '暂无'
                    }
                    style={styles.listItem}
                  >
                    举报类型
                  </List.Item>
                  <List.Item
                    extra={<Tag color="red">申诉失败</Tag>}
                    style={styles.listItemLast}
                  >
                    申诉结果
                  </List.Item>
                </List>
              </Card.Body>
            </Card>

            <Card style={styles.evidenceCard}>
              <Card.Header
                title={<Text style={styles.cardTitle}>申诉证据</Text>}
                thumb={<Icon name="file" type="font-awesome" color="#1890ff" size={18} />}
              />
              <Card.Body style={styles.evidenceCardBody}>
                <ScrollView style={styles.evidenceScrollView} contentContainerStyle={styles.evidenceScrollContent}>
                  {selectedCard?.appeal_description ? (
                    <View style={styles.appealReasonBox}>
                      <Text style={styles.appealReasonLabel}>申诉理由</Text>
                      <Text style={styles.appealReasonText}>{selectedCard.appeal_description}</Text>
                    </View>
                  ) : null}
                  {appealImages.length > 0 ? (
                    appealImages.map((imgUrl, index) => (
                      <TouchableOpacity key={index} onPress={() => setFullscreenImage(resolveImageUrl(imgUrl))}>
                        <View style={styles.videoContainer}>
                          <Image
                            source={{ uri: resolveImageUrl(imgUrl) }}
                            style={styles.videoImage}
                          />
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : selectedCard?.imageUri ? (
                    <TouchableOpacity onPress={() => setFullscreenImage(selectedCard.imageUri)}>
                      <View style={styles.videoContainer}>
                        <Image
                          source={{ uri: selectedCard.imageUri }}
                          style={styles.videoImage}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.noEvidenceText}>暂无申诉证据</Text>
                  )}
                </ScrollView>
              </Card.Body>
            </Card>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <Ionicons name="close-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <Modal visible={!!fullscreenImage} transparent={true} animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
        <TouchableOpacity style={styles.fullscreenOverlay} activeOpacity={1} onPress={() => setFullscreenImage(null)}>
          <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} resizeMode="contain" />
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setFullscreenImage(null)}>
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  mapSection: {
    height: 300,
    position: 'relative',
  },
  infoSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    gap: 10,
  },
  infoCard: {
    flex: 0.4,
    backgroundColor: '#E6F2FF',
    borderRadius: 8,
  },
  evidenceCard: {
    flex: 0.6,
    backgroundColor: '#E6F2FF',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  cardTitle: {
    color: '#4682B4',
    fontSize: 19,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  noMapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMapText: {
    color: '#999',
    fontSize: 16,
    marginTop: 8,
  },
  noMapAddress: {
    color: '#666',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  evidenceCardBody: {
    flex: 1,
  },
  evidenceScrollView: {
    flex: 1,
  },
  evidenceScrollContent: {
    padding: 8,
  },
  noEvidenceText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  appealReasonBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  appealReasonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4,
  },
  appealReasonText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fullscreenClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  mapAddressLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapAddressText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
    flex: 1,
  },
});
export default AppealFailure;
