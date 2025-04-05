import express from 'express';
import * as discussionController from '../controllers/discussion.controller';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';

const router = express.Router();

// Routes cho mọi người dùng đã đăng nhập
router.post('/', 
  authMiddleware,
  roleMiddleware(['student', 'teacher', 'admin']),
  discussionController.createDiscussion
);

router.get('/course/:courseId', 
  authMiddleware,
  roleMiddleware(['student', 'teacher', 'admin']),
  discussionController.getDiscussionsByCourse
);

router.get('/:id', 
  authMiddleware,
  roleMiddleware(['student', 'teacher', 'admin']),
  discussionController.getDiscussionById
);

router.post('/:id/answer', 
  authMiddleware,
  roleMiddleware(['student', 'teacher', 'admin']),
  discussionController.addAnswer
);

// Route chỉ dành cho admin và giảng viên
router.patch('/:id/close', 
  authMiddleware,
  roleMiddleware(['admin', 'teacher']),
  discussionController.closeDiscussion
);

export default router;