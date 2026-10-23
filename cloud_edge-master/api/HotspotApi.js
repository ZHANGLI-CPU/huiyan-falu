import axiosInstance from './axiosInstance';

/**
 * 获取用户附近3千米内的易发生地点
 * @param {number} latitude - 用户纬度
 * @param {number} longitude - 用户经度
 * @param {number} maxDistance - 最大距离（米），默认3000
 */
export const getNearbyHotspots = async (latitude, longitude, maxDistance = 3000) => {
    try {
        const response = await axiosInstance.get('/hotspots/nearby', {
            params: {
                latitude,
                longitude,
                max_distance: maxDistance
            }
        });
        return response.data.hotspots || [];
    } catch (error) {
        console.error("Error fetching nearby hotspots:", error);
        throw error;
    }
};

/**
 * 获取所有易发生地点（管理员功能）
 */
export const getAllHotspots = async () => {
    try {
        const response = await axiosInstance.get('/hotspots');
        return response.data.hotspots || [];
    } catch (error) {
        console.error("Error fetching all hotspots:", error);
        throw error;
    }
};

/**
 * 创建新的易发生地点（管理员功能）
 */
export const createHotspot = async (hotspotData) => {
    try {
        const response = await axiosInstance.post('/hotspots', hotspotData);
        return response.data;
    } catch (error) {
        console.error("Error creating hotspot:", error);
        throw error;
    }
};

/**
 * 更新易发生地点（管理员功能）
 */
export const updateHotspot = async (hotspotId, hotspotData) => {
    try {
        const response = await axiosInstance.put(`/hotspots/${hotspotId}`, hotspotData);
        return response.data;
    } catch (error) {
        console.error("Error updating hotspot:", error);
        throw error;
    }
};

/**
 * 删除易发生地点（管理员功能）
 */
export const deleteHotspot = async (hotspotId) => {
    try {
        const response = await axiosInstance.delete(`/hotspots/${hotspotId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting hotspot:", error);
        throw error;
    }
};
