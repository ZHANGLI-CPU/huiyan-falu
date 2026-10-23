import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert, ScrollView, Modal, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import { MapView, MapType, Marker } from 'react-native-amap3d';
import { Card, List, Tag } from '@ant-design/react-native';
import { resolveImageUrl } from '../api/axiosInstance';

// ReportedDetail 组件，负责渲染事件详情
const ReportFailure = ({ selectedCard, handleCloseModal }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const detailText = `${selectedCard?.location || ''}${selectedCard?.description ? (selectedCard?.location ? ' - ' : '') + selectedCard.description : ''}`;
  const evidencePlaceholder = 'https://via.placeholder.com/240x140';
  const showFullText = (label, value) => {
    if (!value) return;
    Alert.alert(label, String(value));
  };
  return (

    <View

      visible={!!selectedCard}  // 只有 selectedCard 存在时才显示 Modal
      onRequestClose={handleCloseModal}  // 关闭 Modal
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* 地图区域：占整体 60% 高度 */}
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
                description={selectedCard.address || '举报事件位置'}
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
          {/* 地图上显示 detail_location 地址标签 */}
          {selectedCard?.address && selectedCard.latitude && selectedCard.longitude ? (
            <View style={styles.mapAddressLabel}>
              <Ionicons name="location" size={14} color="#FF4444" />
              <Text style={styles.mapAddressText} numberOfLines={2}>{selectedCard.address}</Text>
            </View>
          ) : null}
        </View>

        {/* 信息区域：占整体 40% 高度 */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            {/* 左：信息卡片 */}
            <Card style={styles.infoCard}>
              <Card.Header
                title={<Text style={styles.cardTitle}>举报失败信息</Text>}
                thumb={<Icon name="car" type="font-awesome" color="#1890ff" size={18} />}
              />
              <Card.Body>
                <List>
                  {selectedCard?.licensePlate ? (
                    <List.Item
                      extra={selectedCard.licensePlate}
                      style={styles.listItem}
                    >
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
                    extra={detailText || '暂无'}
                    style={styles.listItemLast}
                    onPress={() => showFullText('具体描述', detailText || '暂无')}
                  >
                    具体描述
                  </List.Item>
                </List>
              </Card.Body>
            </Card>

            {/* 右：证据卡片 */}
            <Card style={styles.evidenceCard}>
              <Card.Header
                title={<Text style={styles.cardTitle}>我的证据</Text>}
                thumb={<Icon name="file" type="font-awesome" color="#1890ff" size={18} />}
              />
              <Card.Body style={styles.evidenceCardBody}>
                <ScrollView style={styles.evidenceScrollView}>
                  <TouchableOpacity onPress={() => setFullscreenImage(resolveImageUrl(selectedCard?.imageUri))}>
                    <View style={styles.videoContainer}>
                      <Image
                        source={{ uri: resolveImageUrl(selectedCard?.imageUri) }}
                        style={styles.videoImage}
                      />
                    </View>
                  </TouchableOpacity>
                  {selectedCard?.description ? (
                    <Text style={styles.evidenceDesc}>{selectedCard.description}</Text>
                  ) : null}
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
    backgroundColor: '#F0F8FF', // 与信息卡片一致的浅蓝背景
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
  infoColumnLeft: {
    flex: 1,
    paddingRight: 8,
  },
  infoColumnRight: {
    flex: 1,
    paddingLeft: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  titleText: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    color: 'white',
  },
  infoItem: {
    marginBottom: 10,
  },
  infoLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  text1: {
    color: 'white',
    fontSize: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,//离顶部为10
    right: 10,//离右侧为10
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',//使图标在按钮内居中对齐
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    marginTop: 15,
    resizeMode: 'contain',
  },
  mediaImage: {
    width: '100%',
    height: 160,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: 'cover',
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
  infoContainer: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  infoLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  evidenceScrollView: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playIcon: {
    position: 'absolute',
  },
  evidenceDesc: {
    fontSize: 13,
    color: '#4682B4',
    marginTop: 10,
    lineHeight: 20,
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
export default ReportFailure;