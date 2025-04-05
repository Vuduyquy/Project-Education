import express from 'express';
import * as scheduleController from '../controllers/schedule.controller';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';

const router = express.Router();

// Routes không cần xác thực
router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);

//Routes cần xác thực
router.use(authMiddleware);

// Routes cho người dùng đã đăng nhập
router.post('/', scheduleController.createSchedule);
router.post('/:id/join', scheduleController.joinSchedule);

// Routes chỉ dành cho admin
router.put('/:id', roleMiddleware(['admin']), scheduleController.updateSchedule);
router.delete('/:id', roleMiddleware(['admin']), scheduleController.deleteSchedule);
router.put('/:id/users/:userId/status', roleMiddleware(['admin']), scheduleController.updateJoinStatus);

export default router;
