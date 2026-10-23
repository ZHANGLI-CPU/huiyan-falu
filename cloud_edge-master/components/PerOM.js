import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native';
import PersonaldataScreen from './Personaldetail/PersonaldataScreen' // 引入个人信息组件
import SecurityScreen from './Personaldetail/SecurityScreen';  // 引入账户安全组件

function PersonalMenuScreen() {

  const [type, setType] = useState('');  // 当前的详细信息类型
  const [selectedButton, setSelectedButton] = useState(''); // 添加选中按钮的状态


  // 处理点击个人信息按钮
  const handlePersonaldataPress = () => {
    setType('personaldata');  // 设置为个人信息类型
    setSelectedButton('personaldata');
  };

  // 处理账户安全按钮
  const handleSecurityPress = () => {
    setType('security');  // 设置为账户安全类型
    setSelectedButton('security');
  };




  // 根据不同的按钮点击渲染不同的内容
  const renderRightSideContent = () => {
    switch (type) {
      case 'personaldata':
        return <PersonaldataScreen />;
      case 'security':
        return <SecurityScreen />;
      default:
        return null;  // 默认不渲染任何内容
    }
  };

  return (
    <View style={styles.container}>
      {/* 左侧菜单栏 */}
      <View style={styles.leftMenu}>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'personaldata' && styles.menuCardSelected]} 
          onPress={handlePersonaldataPress}
          activeOpacity={0.85}
        >
          <Icon name="user" size={20} color={selectedButton === 'personaldata' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'personaldata' && styles.menuTitleSelected]}>个人信息</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'security' && styles.menuCardSelected]} 
          onPress={handleSecurityPress}
          activeOpacity={0.85}
        >
          <Icon name="lock" size={20} color={selectedButton === 'security' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'security' && styles.menuTitleSelected]}>账户安全</Text>
        </TouchableOpacity>
      </View>

      {/* 右侧详细信息区域 */}
      <View style={{ flex: 3, backgroundColor: "white" }}>
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
});

export default PersonalMenuScreen;
