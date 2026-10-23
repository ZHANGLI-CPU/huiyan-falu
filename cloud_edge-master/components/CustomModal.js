//自定义弹窗组件
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const CustomModal = ({
  visible,
  onClose,
  title,
  content,
  iconName,
  iconColor,
  buttons,
  animationType = 'fade'
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Icon name={iconName} type="font-awesome" color={iconColor} size={24} />
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          {Array.isArray(content) ? (
            content.map((text, index) => (
              <Text key={index} style={styles.modalText}>{text}</Text>
            ))
          ) : (
            <Text style={styles.modalText}>{content}</Text>
          )}
          <View style={styles.modalButtons}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modalButton, button.style]}
                onPress={button.onPress}
              >
                <Text style={[styles.modalButtonText, button.textStyle]}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomModal; 