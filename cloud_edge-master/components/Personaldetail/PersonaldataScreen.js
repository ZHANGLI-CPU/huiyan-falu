// PersonaldataScreen.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../../contexts/UserContext';

const PersonaldataScreen = () => {
  // const { user, token } = useUser();
  // // const [additionalData, setAdditionalData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('http://your-api-endpoint/personal-data', {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // 使用 JWT 进行认证
  //         },
  //       });
  //       setAdditionalData(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch personal data:', error);
  //     }
  //   };

  //   if (token) {
  //     fetchData();
  //   }
  // }, [token]);
  const { user } = useUser();
  

  const infoContent = [
    { label: 'id', value: user?.id ?? "未设置" },
    { label: '昵称', value: user?.nickname ?? "未设置" },
    { label: '姓名', value: user?.userRealName ?? "未设置" }, 
    { label: '实名认证', value: '已认证' },
    { label: '证件类型', value: 'A 居民身份证' },
    { label: '证件号码', value: user?.id_card ?? "未设置" }, 
    { label: '手机号码', value: user?.phone ?? "未绑定" }, 
    { label: '注册时间', value: '2024-09-15' },
    { label: '注册地', value: '湖北武汉' },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>个人信息</Text>
        <View style={styles.divider} />
        {infoContent.map((item, index) => (
          <View key={index}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
            {index !== infoContent.length - 1 && (
              <View style={styles.itemDivider} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 12,
    textAlign: 'left',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  label: {
    color: 'black',
    fontSize: 18,
  },
  value: {
    color: 'black',
    fontSize: 18,
    textAlign: 'right', // 右对齐值
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 8,
    marginRight: 8,
  },
});

export default PersonaldataScreen
