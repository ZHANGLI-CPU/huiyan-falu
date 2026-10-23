import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CheckUpdateScreen = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const checkUpdate = () => {
    setIsChecking(true);
    // 模拟检查更新操作
    setTimeout(() => {
      const latestVersion = '2.0.0';
      const appVersion = '1.0.0';
      if (latestVersion && appVersion < latestVersion) {
        setIsDownloading(true);
        // 模拟下载更新操作
        const downloadInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(downloadInterval);
              setIsDownloading(false);
              alert('更新下载完成！');
              return 100;
            }
            return prev + 5;
          });
        }, 100);
      } else {
        setIsChecking(false);
        alert('已是最新版本！');
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>检查更新</Text>
      {isChecking && !isDownloading && <Text style={styles.message}>正在检查更新...</Text>}
      {isDownloading && (
        <>
          <Text style={styles.message}>正在下载更新...</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
          </View>
        </>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      {!isChecking && !isDownloading && (
        <TouchableOpacity
          style={styles.checkUpdateButton}
          onPress={checkUpdate}
          disabled={isChecking || isDownloading}
        >
          <Text style={styles.buttonText}>检查更新</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  checkUpdateButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginTop: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});

export default CheckUpdateScreen;
