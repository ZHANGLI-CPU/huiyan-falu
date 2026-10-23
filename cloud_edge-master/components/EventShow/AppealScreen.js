import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { smartReverseGeocoding } from '../../api/GeocodingApi'; // 导入地址转换函数
import { updateEventDetailLocation } from '../../api/EventApi'; // 导入更新详细地址的API
import { resolveImageUrl } from '../../api/axiosInstance';

import { markReportedEventRead, toggleReportedEventFavorite } from '../../api/ReportedApi';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import AppealFailure from '../AppealFailure';
import AppealSuccess from '../AppealSuccess';
import AppealPending from '../AppealPending';
const AppealScreen = ({ events = [] }) => {
  const [cards, setCards] = useState([]); // 存储所有卡片的状态
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [filter1, setFilter1] = useState('all'); // 筛选框1的值
  const [filter2, setFilter2] = useState('all'); // 筛选框2的值
  const [selectedCard, setSelectedCard] = useState(null); // 存储当前选中的卡片
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制Modal的显示和隐藏
  const itemsPerPage = 3; // 每页显示的卡片数量

  useEffect(() => {
    let isMounted = true;
    const buildCards = async () => {
      // 仅保留具有有效申诉状态的事件，避免空状态事件进入申诉列表
      const validEvents = Array.isArray(events)
        ? events.filter(
          (event) =>
            event &&
            event.appeal_status != null &&
            String(event.appeal_status).trim() !== '' &&
            String(event.appeal_status).toLowerCase() !== 'null'
        )
        : [];

      if (validEvents.length === 0) {
        if (isMounted) {
          setCards([]);
        }
        return;
      }
      try {
        const formattedCards = await Promise.all(validEvents.map(async (event) => {
          // 调试：打印事件数据，查看实际字段名
          console.log('申诉事件数据:', JSON.stringify(event, null, 2));

          let address = '地址获取中...';
          const latField = event.latitude;
          const lngField = event.longitude;

          const detailLocationField = event.detail_location;

          // 优先使用事件中的详细地址(detail_location)
          if (detailLocationField && typeof detailLocationField === 'string' && detailLocationField.trim() !== '' && detailLocationField !== 'null') {
            address = detailLocationField;
            console.log('使用事件中的详细地址(detail_location):', address);
          } else if (latField != null && lngField != null) {
            // 如果detail_location为空，使用经纬度进行逆地理编码
            console.log('使用数据库经纬度进行地址转换:', latField, lngField);
            try {
              const convertedAddress = await smartReverseGeocoding(
                parseFloat(latField),
                parseFloat(lngField),
                '地址获取中...'
              );
              address = convertedAddress;
              console.log('地址转换成功:', address);

              // 如果地址转换成功且不是默认值，更新数据库中的detail_location
              if (address && address !== '地址获取中...' && event.event_id) {
                try {
                  await updateEventDetailLocation(event.event_id, address);
                  console.log('已更新数据库中的detail_location:', address);
                } catch (updateError) {
                  console.warn('更新数据库detail_location失败:', updateError);
                  // 不抛出错误，因为地址已经获取成功，只是保存失败
                }
              }
            } catch (error) {
              console.error('获取地址失败:', error);
              address = `${parseFloat(latField).toFixed(6)}, ${parseFloat(lngField).toFixed(6)}`;
            }
          } else {
            // 如果既没有detail_location也没有经纬度，尝试使用location字段
            const locationField = event.location || event.address || event.location_name || event.place;
            if (locationField && typeof locationField === 'string' && locationField.trim() !== '' && locationField !== 'null') {
              address = locationField;
              console.log('使用后端地址（无经纬度）:', address);
            } else {
              console.warn('事件缺少经纬度和地址信息:', event.event_id);
            }
          }

          return {
            id: event.event_id,
            title: `事件 - ${event.violation_type}`,
            time: new Date(event.timestamp).toLocaleString(),
            imageUri: resolveImageUrl(event.scene_image),
            licensePlate: event.license_plate || '',
            isUnread: !event.reported_user_has_read,
            isFavorite: event.reported_user_has_favorited,
            isSuccess: event.appeal_status === 'success',
            isFailure: event.appeal_status === 'failure',
            isPending: event.appeal_status === 'pending',
            latitude: latField ? parseFloat(latField) : null,
            longitude: lngField ? parseFloat(lngField) : null,
            description: event.description || '暂无描述',
            address,
            violation_type: event.violation_type || '未知类型',
            appeal_description: event.appeal_description || '',
            appeal_images: event.appeal_images || '',
            report_status: event.report_status || '',
          };
        }));
        if (isMounted) {
          setCards(formattedCards);
        }
      } catch (error) {
        console.error('格式化申诉事件失败:', error);
      }
    };

    buildCards();
    return () => {
      isMounted = false;
    };
  }, [events]);

  // 添加一个新的卡片
  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      title: `事件发生 - ${Date.now()}`,
      time: new Date().toLocaleString(),
      imageUri: 'https://via.placeholder.com/100',
      isUnread: true,
      isFavorite: false,
      isSuccess: false,
      isFailure: false,
      isPending: true,
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  useEffect(() => {
    if (selectedCard) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === selectedCard.id ? { ...c, isUnread: false } : c
        )
      );
    }
  }, [selectedCard]);

  // 处理卡片点击事件，显示该卡片的详细信息
  const handleCardPress = (card) => {
    try {
      // 调用标记已读API
      markReportedEventRead(card.id);

      // 直接修改本地状态也行
      /*
    setCards((prevCards) => {
      const newCards = prevCards.map((c) =>
        c.id === card.id ? { ...c, isUnread: false } : c
      );
      return newCards;
    });
 */
      setSelectedCard(card);
      setIsModalVisible(true);
    } catch (error) {
      console.error("标记已读失败:", error);
    }
  };



  // 关闭Modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCard(null); // 清除选中的卡片
  };

  // 这里不用 UseEffect方法进行状态管理了,直接修改本地状态
  // 切换收藏状态
  const handleFavoritePress = (id) => {
    toggleReportedEventFavorite(id);
    setCards((prevCards) => {
      const newCards = prevCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      );
      return newCards;
    });
  };

  // 翻到下一页
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredCards.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 翻到上一页
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 根据筛选框1的值进行筛选
  const filteredCards = cards.filter((card) => {
    if (filter1 === 'unread' && card.isUnread) return true;
    if (filter1 === 'favorite' && card.isFavorite) return true;
    return filter1 === 'all';
  });
  // 根据筛选框2的值进行筛选
  const filteredCardsByStatus = filteredCards.filter((card) => {
    if (filter2 === 'success') return card.isSuccess;
    if (filter2 === 'failure') return card.isFailure;
    if (filter2 === 'pending') return card.isPending;
    return true;
  });
  // 计算总页数
  const totalPages = Math.ceil(filteredCardsByStatus.length / itemsPerPage);

  // 获取当前页的卡片
  const currentCards = filteredCardsByStatus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const options1 = [
    { label: '全部', value: 'all' },
    { label: '只看未读', value: 'unread' },
    { label: '只看收藏', value: 'favorite' },
  ];

  const options2 = [
    { label: '全部', value: 'all' },
    { label: '申诉成功', value: 'success' },
    { label: '申诉失败', value: 'failure' },
    { label: '申诉中', value: 'pending' },
  ];

  return (
    <View style={styles.details}>
      {selectedCard ? (
        // 当 selectedCard 不为空时，渲染 ReportedDetail
        selectedCard.isFailure ? (
          <AppealFailure
            selectedCard={selectedCard}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          selectedCard.isSuccess ? (
            <AppealSuccess
              selectedCard={selectedCard}
              handleCloseModal={handleCloseModal}
            />
          ) : (
            <AppealPending
              selectedCard={selectedCard}
              handleCloseModal={handleCloseModal}
            />
          )
        )

      ) : (
        // 当 selectedCard 为空时，渲染上面的其他部分
        <View style={{ flex: 1 }}>
          {/* 头部信息框 */}
          <View style={styles.header}>
            {/* 叉号按钮 */}
            <TouchableOpacity style={styles.closeButton}>
              <Icon name="times-circle" size={24} color="#f0f0f0" />
            </TouchableOpacity>

            {/* 加号按钮 */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
              <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>

            {/* 下拉框1 */}
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>筛选1：</Text>
              <Dropdown
                data={options1}
                labelField="label"
                valueField="value"
                placeholder="请选择"
                style={styles.dropdownStyle}
                value={filter1}
                onChange={(item) => setFilter1(item.value)} // 更新筛选框1的值
              />
            </View>

            {/* 下拉框2 */}
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>筛选2：</Text>
              <Dropdown
                data={options2}
                labelField="label"
                valueField="value"
                placeholder="请选择"
                style={styles.dropdownStyle}
                value={filter2}
                onChange={(item) => setFilter2(item.value)}
              />
            </View>
          </View>

          {/* 卡片列表区域 */}
          <ScrollView style={styles.cardList}>
            {currentCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.card}
                onPress={() => handleCardPress(card)} // 点击卡片显示详细信息
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.eventTitle}>{card.title}</Text>
                  <Text style={styles.eventTime}>{card.time}</Text>
                  {card.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {card.description}
                    </Text>
                  )}
                  {card.address && (
                    <Text style={styles.eventAddress} numberOfLines={1}>
                      📍 {card.address}
                    </Text>
                  )}
                </View>

                <View style={styles.cardImageContainer}>
                  {/* 申诉状态显示 - 移到最上方 */}
                  <View style={styles.appealStatusContainer}>
                    {card.isSuccess && (
                      <Text style={[styles.appealStatus, styles.successText]}>申诉成功</Text>
                    )}
                    {card.isPending && (
                      <Text style={[styles.appealStatus, styles.pendingText]}>审核中</Text>
                    )}
                    {card.isFailure && (
                      <Text style={[styles.appealStatus, styles.failureText]}>申诉失败</Text>
                    )}
                  </View>

                  <Image
                    source={{ uri: card.imageUri }}
                    style={styles.cardImage}
                  />

                  {/* 右上角的红点 */}
                  {card.isUnread && <View style={styles.redDot} />}

                  {/* 右下角的星星图标 */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleFavoritePress(card.id)}>
                    <Icon
                      name={card.isFavorite ? 'star' : 'star-o'}
                      size={30}
                      color={card.isFavorite ? 'gold' : '#888'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 翻页按钮 */}
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 1}>
              <Text style={styles.pageButton}>◀ 上一页</Text>
            </TouchableOpacity>

            {/* 当前页和总页数 */}
            <Text style={styles.pageIndicator}>
              {`第 ${currentPage} 页 / 共 ${totalPages} 页`}
            </Text>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage * itemsPerPage >= filteredCards.length}>
              <Text style={styles.pageButton}>下一页 ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      }
    </View >
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#63B8FF',
    padding: 10,
    height: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  closeButton: {
    padding: 5,
    borderRadius: 50,
  },
  addButton: {
    padding: 5,
    borderRadius: 50,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownLabel: {
    color: 'black',
    marginRight: 10,
    fontSize: 16,
  },
  dropdownStyle: {
    width: 120,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
  },
  details: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardList: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#00BFFF',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#666',
    fontSize: 24,
    marginTop: 10,
  },
  eventDescription: {
    color: '#444',
    fontSize: 18,
    marginTop: 8,
    lineHeight: 24,
  },
  eventAddress: {
    color: '#0066CC',
    fontSize: 16,
    marginTop: 6,
    fontWeight: '500',
  },
  cardImageContainer: {
    marginLeft: 15,
    position: 'relative', // 添加相对定位
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  pageButton: {
    backgroundColor: '#1E90FF',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    overflow: 'hidden',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pageIndicator: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  appealStatusContainer: {
    position: 'absolute', // 绝对定位
    top: 10, // 距离顶部10
    right: 10, // 距离右侧10
    zIndex: 2, // 确保显示在最上层
  },
  appealStatus: {
    fontSize: 24, // 增大字体
    fontWeight: '900', // 加粗字体
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // 添加文字阴影
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  successText: {
    color: '#4CAF50', // 绿色
  },
  pendingText: {
    color: '#FFC107', // 黄色
  },
  failureText: {
    color: '#F44336', // 红色
  },
});

export default AppealScreen;