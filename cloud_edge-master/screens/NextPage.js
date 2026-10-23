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
import { Dropdown } from 'react-native-element-dropdown';
import { submitEvent } from '../api/EventApi';
import { uploadImage } from '../api/UploadApi';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const VIOLATION_TYPES = [
  { label: '闯红灯', value: '闯红灯' },
  { label: '违法停车', value: '违法停车' },
  { label: '逆向行驶', value: '逆向行驶' },
  { label: '超速行驶', value: '超速行驶' },
  { label: '违法变道', value: '违法变道' },
  { label: '酒后驾驶', value: '酒后驾驶' },
  { label: '不礼让行人', value: '不礼让行人' },
  { label: '占用应急车道', value: '占用应急车道' },
  { label: '其他', value: '其他' },
];

const PLATE_REGEX = /^[\u4e00-\u9fa5][A-Z][A-HJ-NP-Z0-9]{4,6}[A-HJ-NP-Z0-9挂学警港澳]?$/;

const DEFAULT_LATITUDE = 39.9042;
const DEFAULT_LONGITUDE = 116.4074;
const DEFAULT_ADDRESS = '北京市天安门广场';

const NextPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeLatitude = route.params?.latitude || DEFAULT_LATITUDE;
  const routeLongitude = route.params?.longitude || DEFAULT_LONGITUDE;
  const routeDetailLocation = route.params?.detailLocation || DEFAULT_ADDRESS;

  const [violationType, setViolationType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [location, setLocation] = useState(routeDetailLocation);
  const [latitude, setLatitude] = useState(routeLatitude);
  const [longitude, setLongitude] = useState(routeLongitude);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (routeDetailLocation) {
      setLocation(routeDetailLocation);
    }
    if (routeLatitude) {
      setLatitude(routeLatitude);
    }
    if (routeLongitude) {
      setLongitude(routeLongitude);
    }
  }, [routeDetailLocation, routeLatitude, routeLongitude]);

  const formatCurrentTime = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  };

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
    if (!violationType) {
      Toast.show({ type: 'customError', text1: '请选择违法类型' });
      return false;
    }
    if (!licensePlate.trim()) {
      Toast.show({ type: 'customError', text1: '请输入车牌号' });
      return false;
    }
    if (!PLATE_REGEX.test(licensePlate.trim())) {
      Toast.show({ type: 'customError', text1: '车牌号格式不正确' });
      return false;
    }
    if (!location.trim()) {
      Toast.show({ type: 'customError', text1: '请输入违法地点' });
      return false;
    }
    if (images.length === 0) {
      Toast.show({ type: 'customError', text1: '请至少上传一张证据图片' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const uploadedImageUrls = [];
      for (const img of images) {
        const url = await uploadImage(img.uri, img.fileName, img.type);
        uploadedImageUrls.push(url);
      }

      const eventData = {
        violation_type: violationType,
        license_plate: licensePlate.trim().toUpperCase(),
        location: location.trim(),
        latitude,
        longitude,
        description: description.trim() || null,
        scene_image: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
      };

      const result = await submitEvent(eventData);

      Toast.show({ type: 'customSuccess', text1: '举报提交成功' });
      navigation.goBack();
    } catch (error) {
      console.error('提交举报失败:', error);
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
          <Text style={styles.headerTitle}>手动举报</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>基本信息</Text>

            <Text style={styles.label}>违法类型 *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={VIOLATION_TYPES}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="请选择违法类型"
              value={violationType}
              onChange={(item) => setViolationType(item.value)}
            />

            <Text style={styles.label}>车牌号 *</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入车牌号，如：鄂A12345"
              placeholderTextColor="#999"
              value={licensePlate}
              onChangeText={setLicensePlate}
              maxLength={10}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>违法地点 *</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="请输入违法地点"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
              multiline={false}
            />
            {latitude && longitude && (
              <Text style={styles.coordHint}>
                GPS: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            )}

            <Text style={styles.label}>违法时间</Text>
            <View style={styles.timeDisplay}>
              <Icon name="access-time" type="material" size={18} color="#666" />
              <Text style={styles.timeText}>{formatCurrentTime()}</Text>
              <Text style={styles.timeHint}>（当前时间，提交后自动记录）</Text>
            </View>

            <Text style={styles.label}>违法描述</Text>
            <TextInput
              style={[styles.input, styles.inputDescription]}
              placeholder="请描述具体违章行为..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>证据图片 *</Text>
            <Text style={styles.sectionHint}>最多上传5张（支持拍照或从相册选择）</Text>
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
              <Text style={styles.submitButtonText}>提交举报</Text>
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
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputMultiline: {
    minHeight: 44,
  },
  inputDescription: {
    minHeight: 100,
    fontSize: 15,
  },
  coordHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#333',
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  timeHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
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

export default NextPage;
