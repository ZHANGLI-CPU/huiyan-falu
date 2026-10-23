// DeleteAccount.js
import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DeleteAccountScreen = () => {
  const navigation = useNavigation();

  const confirmDeletion = () => {
    Alert.alert(
      "确认删除",
      "您真的确定要删除您的账号吗？",
      [
        {
          text: "取消",
          style: "cancel"
        },
        { 
          text: "确定", 
          onPress: () => {
            Alert.alert("账号删除请求已提交。");
            navigation.goBack();
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'< 返回'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>删除账号</Text>
      <Text style={styles.warning}>
        您确定要删除您的账号吗？此操作是不可逆的。
      </Text>
      <Text style={styles.alert}>
        警告：删除账号将导致您的所有数据和信息被永久删除。
      </Text>
      
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletion}>
        <Text style={styles.deleteButtonText}>确认删除账号</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // 设置页面背景色为灰色
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: '#00BFFF', // 调整返回按钮的背景颜色
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // 调整标题颜色
    marginBottom: 20,
  },
  warning: {
    color: 'black', // 调整字体颜色
    marginBottom: 10,
    textAlign: 'center',
  },
  alert: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteAccountScreen;
