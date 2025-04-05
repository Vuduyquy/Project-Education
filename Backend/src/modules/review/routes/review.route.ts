import express from 'express';
import * as reviewController from '../controllers/review.controller';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';

const router = express.Router();

// Route tạo đánh giá mới - chỉ học viên mới được đánh giá
router.post(
  '/',
  authMiddleware,
  //roleMiddleware(['student']),
  reviewController.createReview
);

// Route lấy danh sách đánh giá theo khóa học - ai cũng có thể xem
router.get('/course/:courseId', reviewController.getReviewsByCourse);

// Route cập nhật đánh giá - chỉ người tạo mới được cập nhật
router.put(
  '/:reviewId',
  authMiddleware,
  roleMiddleware(['student']),
  reviewController.updateReview
);

// Route xóa đánh giá - chỉ người tạo và admin mới được xóa
router.delete(
  '/:reviewId',
  authMiddleware,
  roleMiddleware(['student', 'admin']),
  reviewController.deleteReview
);

export default router;
