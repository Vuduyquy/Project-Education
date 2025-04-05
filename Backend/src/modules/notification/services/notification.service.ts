import Notification from '../models/notification.model';

export const getUserNotifications = async (userId: string) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (id: string) => {
    return await Notification.findByIdAndUpdate(id, { seen: true }, { new: true });
};

export const createNewNotification = async (userId: string, message: string, type: string) => {
    return await Notification.create({ userId, message, type });
};