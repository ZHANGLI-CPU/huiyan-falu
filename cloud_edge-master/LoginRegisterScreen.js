import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './contexts/UserContext';
import Toast from'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api/axiosInstance';

import { Alert } from 'react-native';

const baseUrl = API_BASE_URL;
//const baseUrl = 'http://10.77.49.78:5000/api'//用于真机调试——ISPwifi
//const baseUrl = 'http://10.82.24.155:5000/api'//用于真机调试——WHUTwifi
//const baseUrl = 'http://192.168.76.150:5000/api'
//const baseUrl = 'http://127.0.0.1:5000/api';


const LoginRegisterScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(''); // 手机号码
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);
  const [nickname, setNickname] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const [isVerificationValid, setIsVerificationValid] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isAgreementChecked, setIsAgreementChecked] = useState(false); // 同意协议
  const navigation = useNavigation();
  const { setUser, setToken } = useUser();

  // 手机号格式验证
  const isPhoneNumberValid = (phone) => {
    const phoneRegEx = /^[1][3-9][0-9]{9}$/; // 手机号正则，符合中国大陆手机号规则
    return phoneRegEx.test(phone);
  };

  useEffect(() => {
    const verifyCode = async () => {
      if (verificationCode.length === 6) {
        try {
            const response = await axios.post(`${baseUrl}/verifVerificationCode`, {
            phone_number: phoneNumber,
            code: verificationCode,
          });

          if (response.data.message === "验证码验证成功") {
            setVerificationStatus('success');
            setIsVerificationValid(true);
          } else {
            setVerificationStatus('error');
            setIsVerificationValid(false);
          }
        } catch (error) {
          setVerificationStatus('error');
          setIsVerificationValid(false);
          console.error(error.response?.data?.message);
        }
      } else {
        setVerificationStatus('');
        setIsVerificationValid(false);
      }
    };

    verifyCode();
  }, [verificationCode]);

  const handleSendVerificationCode = async () => {
    if (isCounting) return; // 如果正在倒计时，禁止再次点击
    if (!isPhoneNumberValid(phoneNumber)) {
      alert('请输入正确的手机号码');
      return;
    }
    try {
      console.log("Beginning");
  
        const response = await axios.post(`${baseUrl}/sendVerificationCode`, {
            phone_number: phoneNumber,
            code: verificationCode,
          });

      console.log("success");
      console.log("response.data: ",response.data);
      //return response.data;

      if (response.data.message === "验证码发送成功") {
        Toast.show({
          type: 'customSuccess', // 直接使用预定义类型
          text1: '验证码已发送'
        });
        setIsCounting(true);
        let timer = countdown;
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer <= 0) {
            clearInterval(interval);
            setIsCounting(false);
            setCountdown(60); // 重置倒计时
          }
        }, 1000);
      }
    } catch (error) {
      console.log("failure");
      console.log("error Info:",error);
      
    } // end of catch error
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}/login`, {
        phone_number: phoneNumber,
        password: password,
      });

      if (response.data.message === "登录成功") {
        const { token, user_id, nickname, id_card, userRealName } = response.data;

        // 存储 JWT 到 AsyncStorage
        await AsyncStorage.setItem('jwt', token);

        // 更新 UserContext
        setUser({
          id: user_id,
          phone: phoneNumber,
          id_card,
          nickname,
          userRealName,
        });
        setToken(token);

        navigation.navigate('HomeTabs');
      }
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  const handleRegister = async () => {
    if (!isVerificationValid) {
      Toast.show({
          type: 'customError', // 直接使用预定义类型
          text1: '请先完成验证码验证'
        });
      return;
    }
    if (!nickname) {
      Toast.show({
          type: 'customError', // 直接使用预定义类型
          text1: '请填写昵称！'
        });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
          type: 'customError', // 直接使用预定义类型
          text1: '两次输入的密码不一致！'
        });
      return;
    }
    if (!isAgreementChecked) {
      Toast.show({
          type: 'customError', // 直接使用预定义类型
          text1: '请勾选同意用户协议和隐私政策'
        });
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/register`, {
        phone_number: phoneNumber,
        password: password,
        nickname: nickname,
      });

      if (response.status === 201) {
        const { user_id } = response.data;

        // 更新 UserContext（注册时不需要 token，实名认证后也不需要直接返回主页）
        setUser({
          id: user_id,
          phone: phoneNumber,
          nickname,
          id_card: null,
          userRealName: null,
        });

        Toast.show({
          type: 'customSuccess',
          text1: '注册成功，请进行实名认证',
        });

        navigation.navigate('RealNameVerificationScreen');
      }
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>logo</Text>
        <Text style={styles.subtitle}>智能驾驶体验</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isLogin && styles.activeTab]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={styles.tabText}>登录</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isLogin && styles.activeTab]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={styles.tabText}>注册</Text>
        </TouchableOpacity>
      </View>
      {isLogin ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="手机号"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="密码"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isRemember}
              onValueChange={(newValue) => setIsRemember(newValue)}
            />
            <Text style={styles.checkboxText}>记住登录</Text>
          </View>
          <Button title="登录" onPress={handleLogin} />
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgotPassword}>忘记密码？</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="手机号"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
          {/* 验证码部分 */}
          <View style={styles.verificationContainer}>
            <TextInput
              style={[styles.input, styles.verificationInput]}
              placeholder="验证码"
              onChangeText={(text) => setVerificationCode(text)}
              value={verificationCode}
              maxLength={6}
              keyboardType="number-pad"
            />
            <Button
              title={isCounting ? `${countdown}s后重试` : "获取验证码"}
              onPress={handleSendVerificationCode}
              disabled={isCounting}
            />
          </View>
          {verificationStatus === 'success' && (
            <Text style={styles.verificationSuccessText}>验证码正确</Text>
          )}
          {verificationStatus === 'error' && (
            <Text style={styles.verificationErrorText}>验证码错误</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="用户昵称"
            onChangeText={(text) => setNickname(text)}
            value={nickname}
          />
          {/* 密码输入部分 */}
          <TextInput
            style={styles.input}
            placeholder="设置密码"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            editable={isVerificationValid}
          />
          <TextInput
            style={styles.input}
            placeholder="确认密码"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
            editable={isVerificationValid}
          />
          <View style={styles.agreementContainer}>
            <CheckBox
              value={isAgreementChecked}
              onValueChange={(newValue) => setIsAgreementChecked(newValue)}
            />
            <Text style={styles.agreementText}>
              我已阅读并同意<Text style={styles.agreementLink}>《用户协议》</Text>和<Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>
          <Button title="注册" onPress={handleRegister} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  subtitle: {
    fontSize: 16,
    color: '#1E90FF',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 2,
    borderBottomColor: '#3E6AE1',
  },
  tabText: {
    color: 'white',
    fontSize: 18,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#87CEFA',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'black',
    marginBottom: 12,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verificationInput: {
    flex: 1,
    marginRight: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxText: {
    color: 'black',
    marginLeft: 8,
  },
  forgotPassword: {
    color: '#3E6AE1',
    marginTop: 12,
    textAlign: 'right',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  agreementText: {
    color: 'black',
    fontSize: 12,
    marginLeft: 8,
  },
  agreementLink: {
    color: '#3E6AE1',
  },
  verificationSuccessText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 8,
  },
  verificationErrorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default LoginRegisterScreen;
