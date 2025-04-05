import express from 'express';
import { getNotifications, markAsRead, createNotification } from '../controllers/notification.controller';
import authMiddleware from '../../../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/', authMiddleware, createNotification);
router.put('/:id/read', authMiddleware, markAsRead);

export default router;