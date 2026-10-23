import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PerOM from '../components/PerOM';

function PersonalScreen() {
  return (
    <View style={styles.container}>
      <PerOM />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PersonalScreen;
