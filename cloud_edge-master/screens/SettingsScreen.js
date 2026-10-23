import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SetOM from '../components/SetOM';

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <SetOM />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
