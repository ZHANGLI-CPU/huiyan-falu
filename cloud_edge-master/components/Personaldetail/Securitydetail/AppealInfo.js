// AppealInfo.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const AppealInfo = () => {
  const [appealText, setAppealText] = useState("");

  const handleSubmit = () => {
    if (appealText.length === 0) {
      Alert.alert("错误", "申诉内容不能为空");
      return;
    }
    // 在这里处理申诉提交的逻辑
    console.log("申诉内容: ", appealText);
    Alert.alert("成功", "申诉已提交");
    setAppealText("");
    Keyboard.dismiss(); // 提交后关闭键盘
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>信息申诉</Text>
        <Text style={styles.instructionText}>请描述您的问题，我们会尽快处理。</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入申诉内容"
          value={appealText}
          onChangeText={setAppealText}
          multiline
          returnKeyType="done" // 设置返回键类型为完成
          onSubmitEditing={Keyboard.dismiss} // 按下完成键关闭键盘
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={appealText.length === 0}
        >
          <Text style={styles.buttonText}>提交申诉</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "white", // 深色模式背景
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
    height: 100,
    width: "100%",
    borderWidth: 1,
    borderColor: "white", // 输入框边框颜色
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#C6E2FF", // 输入框背景颜色
    color: "black", // 输入文字颜色
  },
  button: {
    backgroundColor: "#007AFF", // 按钮颜色
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AppealInfo;
