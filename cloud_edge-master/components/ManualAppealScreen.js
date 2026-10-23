import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadImage } from '../api/UploadApi';
import { submitAppeal } from '../api/AppealApi';

const ManualAppealScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  const [appealDescription, setAppealDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isAppealPending = event?.isPending || event?.appeal_status === 'pending';
  const isAppealSuccess = event?.isSuccess || event?.appeal_status === 'success';

  useEffect(() => {
    if (isAppealPending || isAppealSuccess) {
      const msg = isAppealPending ? '该事件正在审核中，不可重复申诉' : '该事件已申诉通过，无需再次申诉';
      Toast.show({ type: 'customError', text1: msg });
      setTimeout(() => navigation.goBack(), 1500);
    }
  }, []);

  const handleAddImage = () => {
    Alert.alert('选择图片来源', '', [
      {
        text: '拍照',
        onPress: () => pickFromCamera(),
      },
      {
        text: '从相册选择',
        onPress: () => pickFromLibrary(),
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const pickFromCamera = () => {
    launchCamera(
      { mediaType: 'photo', quality: 0.8, maxWidth: 1920, maxHeight: 1080 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error('拍照失败:', response.errorMessage);
          Toast.show({ type: 'customError', text1: '拍照失败' });
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setImages((prev) => [...prev, { uri: asset.uri, fileName: asset.fileName, type: asset.type }]);
        }
      }
    );
  };

  const pickFromLibrary = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, maxWidth: 1920, maxHeight: 1080, selectionLimit: 5 - images.length },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error('选择图片失败:', response.errorMessage);
          Toast.show({ type: 'customError', text1: '选择图片失败' });
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const newImages = response.assets.map((asset) => ({
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
          }));
          setImages((prev) => [...prev, ...newImages].slice(0, 5));
        }
      }
    );
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!appealDescription.trim()) {
      Toast.show({ type: 'customError', text1: '请填写申诉理由' });
      return false;
    }
    if (appealDescription.trim().length < 10) {
      Toast.show({ type: 'customError', text1: '申诉理由至少需要10个字' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!event?.id) {
      Toast.show({ type: 'customError', text1: '事件信息缺失' });
      return;
    }

    setSubmitting(true);
    try {
      let appealImages = null;
      if (images.length > 0) {
        const uploadedUrls = [];
        for (const img of images) {
          const url = await uploadImage(img.uri, img.fileName, img.type);
          uploadedUrls.push(url);
        }
        appealImages = JSON.stringify(uploadedUrls);
      }

      await submitAppeal(event.id, appealDescription.trim(), appealImages);

      Toast.show({ type: 'customSuccess', text1: '申诉提交成功' });
      navigation.goBack();
    } catch (error) {
      console.error('提交申诉失败:', error);
      Toast.show({ type: 'customError', text1: '提交失败，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" type="ionicons" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>提交申诉</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>原始举报信息</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>违法类型</Text>
              <Text style={styles.infoValue}>{event?.title?.split(' - ')[1] || event?.violation_type || '暂无'}</Text>
            </View>
            {event?.licensePlate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>车牌号</Text>
                <Text style={styles.infoValue}>{event.licensePlate}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>地点</Text>
              <Text style={styles.infoValue}>{event?.address || '暂无'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>时间</Text>
              <Text style={styles.infoValue}>{event?.time || '暂无'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>描述</Text>
              <Text style={styles.infoValue}>{event?.description || '暂无描述'}</Text>
            </View>
            {event?.imageUri && (
              <View style={styles.evidenceContainer}>
                <Text style={styles.infoLabel}>举报人证据</Text>
                <Image source={{ uri: event.imageUri }} style={styles.evidenceImage} />
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>申诉理由 *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="请详细说明您的申诉理由（至少10字）..."
              placeholderTextColor="#999"
              value={appealDescription}
              onChangeText={setAppealDescription}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>申诉证据（选填）</Text>
            <Text style={styles.sectionHint}>最多上传5张</Text>
            <View style={styles.imageContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                  <TouchableOpacity
                    style={styles.imageRemoveBtn}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" type="ionicons" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                  <Icon name="camera-alt" type="material" size={32} color="#1890ff" />
                  <Text style={styles.addImageText}>添加图片</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <View style={styles.submittingRow}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.submitButtonText}>  提交中...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>提交申诉</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
  },
  formSection: {
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    marginTop: -8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  evidenceContainer: {
    marginTop: 8,
  },
  evidenceImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    resizeMode: 'cover',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 120,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4D4F',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  addImageText: {
    fontSize: 11,
    color: '#1890ff',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#1890ff',
    marginHorizontal: 12,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1890ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ManualAppealScreen;
