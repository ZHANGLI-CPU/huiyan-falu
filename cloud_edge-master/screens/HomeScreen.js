import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import HomePage from '../components/HomePage'

function MessageScreen() {
  return (
    <View style={styles.container}>
      <HomePage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MessageScreen;
