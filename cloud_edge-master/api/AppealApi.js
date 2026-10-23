import axiosInstance from './axiosInstance';

export const getAppeals = async () => {
    try {
        const response = await axiosInstance.get('/appeals');
        return response.data.appealed_events;
    } catch (error) {
        console.error("Error fetching appealed events:", error);
        throw error;
    }
};

export const submitAppeal = async (eventId, appealDescription, appealImages) => {
    try {
        const response = await axiosInstance.post('/appeals/submit', {
            event_id: eventId,
            appeal_description: appealDescription,
            appeal_images: appealImages,
        });
        return response.data;
    } catch (error) {
        console.error("提交申诉失败:", error);
        throw error;
    }
};
