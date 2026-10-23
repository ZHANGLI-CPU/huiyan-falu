import axiosInstance from './axiosInstance';

// 对该用户来说 -- 被举报 | 申诉 对应相同 id 事件
export const getReportedEvents = async () => {
    try {
        const response = await axiosInstance.get('/reported');
        return response.data.reported_against_events;
    } catch (error) {
        console.error("Error fetching reported against events:", error);
        throw error;
    }
};


// 被举报方标记已读
export const markReportedEventRead = async (eventId) => {
    try {
        const response = await axiosInstance.post(`/reported_mark_read/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('标记被举报事件已读失败:', error);
        throw error;
    }
};

// 被举报方收藏/取消收藏
export const toggleReportedEventFavorite = async (eventId) => {
    try {
       const response = await axiosInstance.post(`/reported_collected/${eventId}`);
       return response.data;
    } catch (error) {
        console.error('切换被举报事件收藏状态失败:', error);
        throw error;
    }
};
