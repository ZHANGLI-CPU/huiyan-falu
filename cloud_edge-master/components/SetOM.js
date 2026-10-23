// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import CacheClearScreen from '../components/CacheClearScreen'; // 引入缓存清理组件
// import RatingScreen from '../components/RatingScreen'; // 引入评分组件
// import ServiceProtocolScreen from '../components/ServiceProtocolScreen'; // 引入服务协议组件
// import PrivacyPolicyScreen from '../components/PrivacyPolicyScreen'; // 引入隐私政策组件
// import CheckUpdateScreen from '../components/CheckUpdateScreen'; // 引入检查更新组件
// import VersionScreen from '../components/VersionScreen'; // 引入版本组件

// const settingsData = [
//   { key: '清理缓存', icon: 'tachometer', Component: CacheClearScreen },
//   { key: '去评分', icon: 'star', Component: RatingScreen },
//   { key: '隐私政策', icon: 'file', Component: PrivacyPolicyScreen },
//   { key: '服务协议', icon: 'eye' , Component: ServiceProtocolScreen },
//   { key: '检查更新', icon: 'car' , Component: CheckUpdateScreen },
//   { key: '版本', icon: 'cogs' , Component: VersionScreen },
// ];

// export default function SettingsScreen() {
//   const [selectedItem, setSelectedItem] = React.useState(null);

//   const renderDetail = () => {
//     if (!selectedItem) return null;
//     const SelectedComponent = selectedItem.Component;
//     return <SelectedComponent />;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.leftContainer}>
//         {/* 车辆展示页面可以放在这里 */}
//         <Text style={styles.vehicleText}>车辆展示区域</Text>
//       </View>
//       <View style={styles.middleContainer}>
//         <FlatList
//           data={settingsData}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.item}
//               onPress={() => setSelectedItem(item)}
//             >
//               <Icon name={item.icon} size={20} color="white" style={styles.icon} />
//               <Text style={styles.text}>{item.key}</Text>
//               <View style={styles.rightSection}>
//                 {item.value && <Text style={styles.value}>{item.value}</Text>}
//                 <Icon name="ios-arrow-forward" size={20} color="white" />
//               </View>
//             </TouchableOpacity>
//           )}
//           keyExtractor={item => item.key}
//         />
//       </View>
//       <View style={styles.rightContainer}>
//         {renderDetail()}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#1c1c1e',
//     paddingHorizontal: 10,
//   },
//   leftContainer: {
//     flex: 3, // 左边2份
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#2c2c2e',
//   },
//   middleContainer: {
//     flex: 2, // 第三份
//     backgroundColor: '#1c1c1e',
//   },
//   rightContainer: {
//     flex: 5, // 最右边3份
//     backgroundColor: '#2c2c2e',
//     padding: 10,
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   icon: {
//     marginRight: 15,
//   },
//   text: {
//     flex: 1,
//     color: 'white',
//     fontSize: 16,
//   },
//   rightSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   value: {
//     color: 'white',
//     marginRight: 5,
//   },
//   vehicleText: {
//     color: 'white',
//     fontSize: 20,
//   },
// });

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CacheClearScreen from './Settingsdetail/CacheClearScreen'; // 引入缓存清理组件
import RatingScreen from './Settingsdetail/RatingScreen'; // 引入评分组件
import ServiceProtocolScreen from './Settingsdetail/ServiceProtocolScreen'; // 引入服务协议组件
import PrivacyPolicyScreen from './Settingsdetail/PrivacyPolicyScreen'; // 引入隐私政策组件
import CheckUpdateScreen from './Settingsdetail/CheckUpdateScreen'; // 引入检查更新组件
import VersionScreen from './Settingsdetail/VersionScreen'; // 引入版本组件

function Detail() {
  const [type, setType] = useState('report');
  const [selectedButton, setSelectedButton] = useState(''); // 添加选中按钮的状态

  // 处理清理缓存按钮
  const handleCleanCachePress = () => {
    setType('cleanCache');
    setSelectedButton('cleanCache');
  };

  // 处理点击去评分按钮
  const handleRatingPress = () => {
    setType('rating');
    setSelectedButton('rating');
  };

  // 处理点击隐私政策按钮
  const handlePrivacyPolicyPress = () => {
    setType('privacyPolicy');
    setSelectedButton('privacyPolicy');
  };

  // 处理点击服务协议按钮
  const handleServiceProtocolPress = () => {
    setType('serviceProtocol');
    setSelectedButton('serviceProtocol');
  };

  // 处理点击检查更新按钮
  const handleCheckUpdatePress = () => {
    setType('checkUpdate');
    setSelectedButton('checkUpdate');
  };

  // 处理点击版本按钮
  const handleVersionPress = () => {
    setType('version');
    setSelectedButton('version');
  };

  // 根据不同的按钮点击渲染不同的内容
  const renderRightSideContent = () => {
    switch (type) {
      case 'cleanCache':
        return <CacheClearScreen />;
      case 'rating':
        return <RatingScreen />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen />;
      case 'serviceProtocol':
        return <ServiceProtocolScreen />;
      case 'checkUpdate':
        return <CheckUpdateScreen />;
      case 'version':
        return <VersionScreen />;
      default:
        return null;  // 默认不渲染任何内容
    }
  };

  return (
    <View style={styles.container}>
      {/* 左侧菜单栏 */}
      <View style={styles.leftMenu}>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'cleanCache' && styles.menuCardSelected]} 
          onPress={handleCleanCachePress}
          activeOpacity={0.85}
        >
          <Icon name="exclamation-triangle" size={20} color={selectedButton === 'cleanCache' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'cleanCache' && styles.menuTitleSelected]}>清理缓存</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'rating' && styles.menuCardSelected]} 
          onPress={handleRatingPress}
          activeOpacity={0.85}
        >
          <Icon name="star" size={20} color={selectedButton === 'rating' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'rating' && styles.menuTitleSelected]}>去评分</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'privacyPolicy' && styles.menuCardSelected]} 
          onPress={handlePrivacyPolicyPress}
          activeOpacity={0.85}
        >
          <Icon name="file" size={20} color={selectedButton === 'privacyPolicy' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'privacyPolicy' && styles.menuTitleSelected]}>隐私政策</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'serviceProtocol' && styles.menuCardSelected]} 
          onPress={handleServiceProtocolPress}
          activeOpacity={0.85}
        >
          <Icon name="eye" size={20} color={selectedButton === 'serviceProtocol' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'serviceProtocol' && styles.menuTitleSelected]}>服务协议</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'checkUpdate' && styles.menuCardSelected]} 
          onPress={handleCheckUpdatePress}
          activeOpacity={0.85}
        >
          <Icon name="car" size={20} color={selectedButton === 'checkUpdate' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'checkUpdate' && styles.menuTitleSelected]}>检查更新</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuCard, selectedButton === 'version' && styles.menuCardSelected]} 
          onPress={handleVersionPress}
          activeOpacity={0.85}
        >
          <Icon name="cogs" size={20} color={selectedButton === 'version' ? 'white' : '#1E90FF'} style={styles.menuIcon} />
          <Text style={[styles.menuTitle, selectedButton === 'version' && styles.menuTitleSelected]}>版本</Text>
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
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  menuTitleSelected: {
    color: 'white',
  },
});

export default Detail;