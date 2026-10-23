// SwitchAccount.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SwitchAccount = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleAccountSwitch = () => {
    // 在这里添加切换账户的逻辑，例如验证账户和密码
    console.log("切换到账户: ", account);
    navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>{'< 返回'}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>切换账户</Text>
        <Text style={styles.instructionText}>请输入要切换的账户名和密码</Text>
        <TextInput
          style={styles.input}
          placeholder="账户名称"
          value={account}
          onChangeText={setAccount}
        />
        <TextInput
          style={styles.input}
          placeholder="密码"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleAccountSwitch}
          disabled={account.length === 0 || password.length === 0}
        >
          <Text style={styles.buttonText}>切换账户</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "white", // 深色模式背景
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
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
    borderColor: "white", // 输入框边框颜色
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#C6E2FF", // 输入框背景颜色
    color: "black", // 输入文字颜色
  },
  button: {
    backgroundColor: "#007AFF", // 按钮颜色
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SwitchAccount;
