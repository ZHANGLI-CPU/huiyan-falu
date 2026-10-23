import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UnderAsserted from '../components/EventShow/UnderAsserted' // 引入原始详细信息组件
import ReportScreen from '../components/EventShow/ReportScreen';  // 引入举报的组件
import AppealScreen from '../components/EventShow/AppealScreen';  // 引入申诉的组件

function OperatorMenu({
  reportEvents = [],
  reportedEvents = [],
  appealEvents = [],
  loading = false,
  error = null,
  onReload,
}) {

  const [type, setType] = useState('report');  // 当前的详细信息类型
  const [selectedButton, setSelectedButton] = useState('report'); // 添加选中按钮的状态


  // 处理点击举报按钮
  const handleReportPress = () => {
    setType('report');  // 设置为举报类型
    setSelectedButton('report');
  };

  // 处理点击被举报按钮
  const handleReportedPress = () => {
    setType('reported');  // 设置为被举报类型
    setSelectedButton('reported');
  };

  // 处理点击申诉按钮
  const handleAppealPress = () => {
    setType('appeal');  // 设置为申诉类型
    setSelectedButton('appeal');
  };



  // 根据不同的按钮点击渲染不同的内容
  const renderRightSideContent = () => {
    if (loading) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={styles.feedbackText}>消息加载中...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>消息加载失败，请重试。</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onReload}
            activeOpacity={0.85}
          >
            <Text style={styles.retryButtonText}>重新加载</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const hasAnyEvents =
      reportEvents.length > 0 || reportedEvents.length > 0 || appealEvents.length > 0;

    if (!hasAnyEvents) {
      return (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>暂无消息</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onReload}
            activeOpacity={0.85}
          >
            <Text style={styles.retryButtonText}>刷新</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (type) {
      case 'reported':
        return <UnderAsserted events={reportedEvents} onReload={onReload} />;
      case 'report':
        return <ReportScreen events={reportEvents} onReload={onReload} />;
      case 'appeal':
        return <AppealScreen events={appealEvents} onReload={onReload} />;
      default:
        return null;  // 默认不渲染任何内容
    }
  };

  return (

    <View style={styles.container}>
      {/* 信息栏 */}
      <View style={styles.leftMenu}>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'report' && styles.menuCardSelected]} 
          onPress={handleReportPress}
          activeOpacity={0.85}
        >
          <Icon name="exclamation-triangle" size={24} color={selectedButton === 'report' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'report' && styles.menuTitleSelected]}>举报</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'reported' && styles.menuCardSelected]} 
          onPress={handleReportedPress}
          activeOpacity={0.85}
        >
          <Icon name="flag" size={24} color={selectedButton === 'reported' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'reported' && styles.menuTitleSelected]}>被举报</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'appeal' && styles.menuCardSelected]} 
          onPress={handleAppealPress}
          activeOpacity={0.85}
        >
          <Icon name="gavel" size={24} color={selectedButton === 'appeal' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'appeal' && styles.menuTitleSelected]}>申诉</Text>
        </TouchableOpacity>
      </View>

      {/* 右侧详细信息区域 */}
      <View style={{ flex: 3, backgroundColor: "#444" }}>
        {renderRightSideContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftMenu: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    paddingVertical: 30,
    justifyContent: 'flex-start',
  },
  menuCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  menuCardSelected: {
    backgroundColor: '#1E90FF',
    shadowOpacity: 0.25,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 18,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  menuTitleSelected: {
    color: 'white',
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OperatorMenu;