// RealNameVerificationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useUser } from './contexts/UserContext';
import { API_BASE_URL } from './api/axiosInstance';

const RealNameVerificationScreen = ({ navigation }) => {
  const [realName, setRealName] = useState('');
  const [idCard, setIdCard] = useState('');
  const { user, setUser } = useUser(); // 从 UserContext 获取 user

const baseUrl = API_BASE_URL;
//  const baseUrl = 'http://10.77.49.78:5000/api'//用于真机调试——ISPwifi
//  const baseUrl = 'http://10.82.24.155:5000/api'//用于真机调试——WHUTwifi
//const baseUrl = 'http://192.168.76.150:5000/api'//手机热点
//const baseUrl = 'http://127.0.0.1:5000/api';

  const handleRealNameVerification = async () => {
    // 简单的字段验证
    if (!realName || !idCard) {
      Alert.alert('提示', '请填写真实姓名和身份证号');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/real-name-verification`,
        {
          user_id: user.id,
          real_name: realName,
          id_card: idCard,
        }
      );

      if (response.data.message === '实名认证成功') {
        Toast.show({
          type: 'customSuccess',
          text1: '认证成功！请登录',
        });

        // 更新用户信息
        setUser({
          ...user,
          id_card: idCard,
          userRealName: realName,
        });

        // 实名认证成功后返回登录页
        navigation.navigate('LoginRegister');
      } else if (response.data.message === "身份证号码格式不正确") {
        Toast.show({
          type: 'customError',
          text1: '身份证号码格式不正确'
        });
      } else if (response.data.message === "用户 ID、真实姓名和身份证号码不能为空") {
        Toast.show({
          type: 'customError',
          text1: '用户 ID、真实姓名和身份证号码不能为空'
        });
      } else if (response.data.message === "用户不存在") {
        Toast.show({
          type: 'customError',
          text1: '用户不存在'
        });
      } else if (response.data.message === "该用户已完成实名认证") {
        Toast.show({
          type: 'customError',
          text1: '该用户已完成实名认证'
        });
      } else {
        Toast.show({
          type: 'customError',
          text1: '实名认证失败，请重新尝试'
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: '服务器发生错误，请稍后再试',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>实名认证</Text>
      <TextInput
        style={styles.input}
        maxLength={10}
        placeholder="请输入真实姓名"
        value={realName}
        onChangeText={setRealName}
        keyboardType="default"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="请输入身份证号"
        value={idCard}
        maxLength={18}
        onChangeText={setIdCard}
        keyboardType="default"
      />
      <Button title="提交实名认证" onPress={handleRealNameVerification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default RealNameVerificationScreen;
