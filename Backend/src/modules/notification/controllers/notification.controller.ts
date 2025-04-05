import { loginUser } from './../../user/controllers/auth.controller';
import { Request, Response } from 'express';
import Notification from '../models/notification.model';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông báo' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ message: 'Đã đọc thông báo' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông báo' });
    }
};

export const createNotification = async (req: Request, res: Response) => {
    try {
        const { userId, message, type } = req.body;
        const newNotification = await Notification.create({ userId, message, type });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo thông báo' });
    }
};