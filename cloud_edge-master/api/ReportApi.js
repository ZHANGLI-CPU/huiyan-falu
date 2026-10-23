import axiosInstance from './axiosInstance';

export const getReportEvents = async () => {
    try {
        const response = await axiosInstance.get('/reports');
        return response.data.reported_events;
    } catch (error) {
        console.error("Error fetching reported events:", error);
        throw error;
    }
};



// 注意格式一定要与后端对应,这种是参数带在路径上
export const markReporterEventRead = async (eventId) => {
    try {
        const response = await axiosInstance.post(`/reporter_mark_read/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('标记举报事件已读失败:', error);
        throw error;
    }
};

// 举报方收藏/取消收藏
export const toggleReporterEventFavorite = async (eventId) => {
    try {
        const response = await axiosInstance.post(`/reporter_collected/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('切换举报事件收藏状态失败:', error);
        throw error;
    }
};
