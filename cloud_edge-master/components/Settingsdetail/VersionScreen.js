// VersionScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const VersionScreen = () => {
  const appVersion = '1.0.0';
  const buildDate = '2024-04-01'; // 假设的构建日期
  const appName = 'MyApp'; // 应用名称
  const appDescription = '这是一个简单易用的应用程序，致力于提供最佳的用户体验。'; // 应用描述

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.version}>版本 {appVersion}</Text>
      <Text style={styles.buildDate}>构建日期 {buildDate}</Text>
      <Text style={styles.description}>{appDescription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    //color:'#4682B4',
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 10,
  },
  version: {
    fontSize: 20,
    color: '#4682B4',
    marginBottom: 10,
  },
  buildDate: {
    fontSize: 20,
    color: '#4682B4',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#4682B4',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VersionScreen;
