// SecurityScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChangePassword from './Securitydetail/ChangePassword';
// import ChangeGesturePassword from './Securitydetail/ChangeGesturePassword';
import DeleteAccount from './Securitydetail/DeleteAccount';
import SwitchAccount from './Securitydetail/SwitchAccount';
import AppealInfo from './Securitydetail/AppealInfo';

const SecurityScreen = () => {
  const [currentComponent, setCurrentComponent] = useState('default');

  const securityContent = [
    { label: '修改登录密码', component: 'ChangePassword' },
    // { label: '修改手势密码', component: 'ChangeGesturePassword' },
    { label: '删除账户', component: 'DeleteAccount' },
    { label: '切换账号', component: 'SwitchAccount' },
    { label: '信息申诉', component: 'AppealInfo' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => setCurrentComponent(item.component)}
    >
      <Text style={styles.text}>{item.label}</Text>
      <Icon name="chevron-forward-outline" size={20} color="white" />
    </TouchableOpacity>
  );

  const renderComponent = () => {
    switch (currentComponent) {
      case 'ChangePassword':
        return <ChangePassword />;
      // case 'ChangeGesturePassword':
      //   return <ChangeGesturePassword />;
      case 'DeleteAccount':
        return <DeleteAccount />;
      case 'SwitchAccount':
        return <SwitchAccount />;
      case 'AppealInfo':
        return <AppealInfo />;
      default:
        return (
          <View style={styles.container}>
            <FlatList
              data={securityContent}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  listContainer: {
    paddingVertical: 0,
    paddingBottom: 20,  // 添加底部内边距
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#00BFFF',
    borderRadius: 8,  // 添加圆角
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,  // 每个项之间的间隔
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    elevation: 3, // Android阴影
    shadowColor: '#000', // iOS阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default SecurityScreen;


// // SecurityScreen.js
// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const SecurityScreen = ({ navigation }) => {
//   const securityContent = [
//     { label: '修改登录密码', component: 'ChangePassword' },
//     { label: '修改手势密码', component: 'ChangeGesturePassword' },
//     { label: '删除账户', component: 'DeleteAccount' },
//     { label: '切换账号', component: 'SwitchAccount' },
//     { label: '信息申诉', component: 'AppealInfo' },
//   ];

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => navigation.navigate(item.component)} // 使用导航进行跳转
//     >
//       <Text style={styles.text}>{item.label}</Text>
//       <Icon name="chevron-forward-outline" size={20} color="white" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={securityContent}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#222',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 5,
//   },
//   listContainer: {
//     paddingVertical: 0,
//     paddingBottom: 20,  // 添加底部内边距
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//   },
//   itemContainer: {
//     backgroundColor: '#333',
//     borderRadius: 8,  // 添加圆角
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     marginBottom: 10,  // 每个项之间的间隔
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     elevation: 3, // Android阴影
//     shadowColor: '#000', // iOS阴影
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
// });

// export default SecurityScreen;


