import axiosInstance from './axiosInstance';
import { Platform } from 'react-native';

export const uploadImage = async (fileUri, fileName, fileType) => {
  try {
    const formData = new FormData();

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const uriParts = fileUri.split('.');
      const extension = uriParts[uriParts.length - 1].toLowerCase();
      const mimeTypeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        bmp: 'image/bmp',
      };
      const mimeType = fileType || mimeTypeMap[extension] || 'image/jpeg';

      formData.append('file', {
        uri: fileUri,
        name: fileName || `photo_${Date.now()}.jpg`,
        type: mimeType,
      });
    } else {
      formData.append('file', fileUri);
    }

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data.url;
  } catch (error) {
    console.error('图片上传失败:', error);
    throw error;
  }
};
