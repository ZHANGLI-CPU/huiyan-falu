// ChangePassword.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from '../../../api/axiosInstance';
import Toast from 'react-native-toast-message';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePasswordChange = async () => {
    setError(null);
    
    if (!oldPassword) {
      setError("请输入旧密码");
      return;
    }
    
    if (!password || !confirmPassword) {
      setError("请输入新密码");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("两次输入的新密码不匹配");
      return;
    }
    
    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/change-password', {
        old_password: oldPassword,
        new_password: password,
      });

      if (response.data.message === "密码修改成功") {
        Toast.show({
          type: 'customSuccess',
          text1: '密码修改成功',
        });
        // 清空输入
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "密码修改失败，请重试";
      setError(errorMessage);
      Toast.show({
        type: 'customError',
        text1: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
        <Text style={styles.closeText}>{'< 返回'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>修改密码</Text>
        <Text style={styles.instructionText}>
          请输入旧密码和新密码
        </Text>
        <TextInput
          style={styles.input}
          placeholder="旧密码"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="新密码（至少6位）"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="确认新密码"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePasswordChange}
          disabled={loading || oldPassword.length === 0 || password.length === 0 || confirmPassword.length === 0}
        >
          <Text style={styles.buttonText}>
            {loading ? "修改中..." : "修改密码"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  closeButton: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  closeText: {
    fontSize: 16,
    color: "#1E90FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black", // 标题颜色
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 20,
    color: "black", // 说明文字颜色
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DCDCDC", // 输入框边框颜色
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#C6E2FF", // 输入框背景颜色
    color: "black", // 输入文字颜色
  },
  error: {
    color: "#FF3B30", // 错误提示颜色
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007AFF", // 按钮颜色
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC", // 禁用状态的颜色
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ChangePassword;
