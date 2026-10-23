// app.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Platform, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AMapSdk } from 'react-native-amap3d';
import { UserProvider } from './contexts/UserContext';
import SettingsScreen from './screens/SettingsScreen';
import MessageScreen from './screens/MessageScreen';
import PersonalScreen from './screens/PersonalScreen';
import HomeScreen from './screens/HomeScreen';
import NextPage from './screens/NextPage';
import LoginRegisterScreen from './LoginRegisterScreen';
import RealNameVerificationScreen from './RealNameVerificationScreen';
import ManualAppealScreen from './components/ManualAppealScreen';
import AutoReportPage from './components/AutoReportPage';
import AutoReportSuccessPage from './components/AutoReportSuccessPage';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

// 初始化高德地图 SDK
// 请替换为你的高德地图 API Key
// Android: 在 https://console.amap.com/dev/key/app 获取
// iOS: 在 https://console.amap.com/dev/key/app 获取
const AMAP_API_KEY = Platform.select({
  android: 'd264533eccf820b1700ce2d570849ba5', // 替换为你的 Android API Key
  ios: 'YOUR_IOS_API_KEY', // 替换为你的 iOS API Key
});

console.log('高德地图 API Key 初始化:', AMAP_API_KEY ? '已设置' : '未设置');
console.log('平台:', Platform.OS);

AMapSdk.init(AMAP_API_KEY);

const customConfig: ToastConfig = {
  customSuccess: (params: ToastConfigParams<any>) => {
    const text1 = params.text1 || '默认消息'; // 处理 text1 可能为 undefined 的情况
    return (
      <View style={{ backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>{text1}</Text>
      </View>
    );
  },
  customError: (params: ToastConfigParams<any>) => {
    const text1 = params.text1 || '默认错误消息';
    return (
      <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>{text1}</Text>
      </View>
    );
  },
};
// 创建导航器
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 静态页面示例
const StaticScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is a static screen</Text>
    </View>
  );
};

// Stack 导航器
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NextPage" component={NextPage} />
    </Stack.Navigator>
  );
};

// 定义 route 参数的类型
type RouteParams = {
  name: string;
};

// Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false, // 不自动显示label
        tabBarIcon: ({ focused, color, size }) => {
          let iconName, label;
          switch (route.name) {
            case 'homepage':
              iconName = focused ? 'car' : 'car-outline';
              label = '主页';
              break;
            case 'message':
              iconName = focused ? 'mail-sharp' : 'mail-outline';
              label = '消息';
              break;
            case 'settings':
              iconName = focused ? 'settings' : 'settings-outline';
              label = '设置';
              break;
            case 'person':
              iconName = focused ? 'person' : 'person-outline';
              label = '个人';
              break;
            case 'brightness':
              iconName = 'contrast';
              label = '亮度';
              break;
            default:
              iconName = 'ellipse';
              label = '';
          }
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={size} color={color} />
              <Text style={{
                fontSize: 12,
                color: color,
                marginTop: 2,
              }}>{label}</Text>
            </View>
          );
        },
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="homepage" component={StackNavigator} />
      <Tab.Screen name="message" component={MessageScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
      <Tab.Screen name="person" component={PersonalScreen} />
      <Tab.Screen name="brightness" component={StaticScreen} />
    </Tab.Navigator>
  );
};


// export default function App() {
//   return (
//     <UserProvider>
//       <View style={{ flex: 1 }}>
//         <NavigationContainer>
//           <Stack.Navigator initialRouteName="HomeTabs">
//             {/* 注释掉登录注册和实名认证的屏幕 */}
//             {/* <Stack.Screen
//               name="LoginRegister"
//               component={LoginRegisterScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="RealNameVerificationScreen"
//               component={RealNameVerificationScreen}
//               options={{ headerShown: false }}
//             /> */}
//             <Stack.Screen
//               name="HomeTabs"
//               component={HomeTabs}
//               options={{ headerShown: false }}
//             />
//           </Stack.Navigator>
//         </NavigationContainer>
//         <Toast config={customConfig} />
//       </View>
//     </UserProvider>
//   );
// }

export default function App() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="LoginRegister">
            <Stack.Screen
              name="LoginRegister"
              component={LoginRegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RealNameVerificationScreen"
              component={RealNameVerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManualAppealScreen"
              component={ManualAppealScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AutoReportPage"
              component={AutoReportPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AutoReportSuccessPage"
              component={AutoReportSuccessPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={customConfig} />
      </View>
    </UserProvider>
  );
}








// // 样式表
// const styles = StyleSheet.create({
//   toastContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 8,
//     marginHorizontal: 20,
//     marginTop: 10,
//   },
//   icon: {
//     marginRight: 12
//   },
//   text: {
//     fontSize: 15,
//     fontWeight: '500',
//     flexShrink: 1
//   }
// });

// 如果要添加动画，可以使用 react-native 的 Animated
// const fadeAnim = useRef(new Animated.Value(0)).current;

// const fadeIn = () => {
//   Animated.timing(fadeAnim, {
//     toValue: 1,
//     duration: 500,
//     useNativeDriver: true,
//   }).start();
// };

// const fadeOut = () => {
//   Animated.timing(fadeAnim, {
//     toValue: 0,
//     duration: 500,
//     useNativeDriver: true,
//   }).start();
// };