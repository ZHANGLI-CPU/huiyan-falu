// CacheClearScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CacheClearScreen = () => {
  const [isClearing, setIsClearing] = useState(false);

  const clearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      // 在这里可以添加实际的清理缓存逻辑
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => console.log('close')}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View> */}

      {/* 界面主体 */}
      <View style={styles.mainContent}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>缓存清理</Text>
        <Text style={styles.description}>
          清理缓存将删除所有缓存数据并释放内存空间。
        </Text>

        {/* 清理缓存按钮 */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearCache}
          disabled={isClearing}
        >
          <Text style={styles.clearButtonText}>
            {isClearing ? '正在清理中...' : '一键清理缓存'}
          </Text>
        </TouchableOpacity>

        {/* 进度条（假设有进度显示需求） */}
        {isClearing && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>预计释放 5.2 GB 空间</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
  mainContent: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B0C4DE',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#696969',
    marginBottom: 40,
  },
  clearButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressBarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#B0C4DE',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CacheClearScreen;
