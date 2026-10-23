import axiosInstance from './axiosInstance';

export const submitEvent = async (eventData) => {
    try {
        const response = await axiosInstance.post('/events/submit', eventData);
        
        return response.data;
    } catch (error) {
        console.error("Error when use EventApi:", error);
        throw error;
    }
};

/**
 * 更新事件的详细地址
 * @param {number} eventId - 事件ID
 * @param {string} detailLocation - 详细地址
 * @returns {Promise} API响应
 */
export const updateEventDetailLocation = async (eventId, detailLocation) => {
    try {
        const response = await axiosInstance.put(`/events/${eventId}/detail_location`, {
            detail_location: detailLocation
        });
        
        return response.data;
    } catch (error) {
        console.error("Error when updating event detail location:", error);
        throw error;
    }
};

/**
 * 更新事件的申诉状态
 * @param {number} eventId - 事件ID
 * @param {string} status - 申诉状态，默认 pending
 */
export const updateAppealStatus = async (eventId, status = 'pending') => {
    try {
        const response = await axiosInstance.put(`/events/${eventId}/appeal_status`, {
            appeal_status: status,
        });
        return response.data;
    } catch (error) {
        console.error("Error when updating event appeal status:", error);
        throw error;
    }
};
