import express from 'express';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';
import usersQuizzesController from '../controllers/users_quizzes.controller';

const router = express.Router();

// Nộp bài thi
router.post(
    '/submit',
    authMiddleware,
    usersQuizzesController.submitQuiz
);

router.get('/', authMiddleware, usersQuizzesController.getAllQuizzUsers)

// Lấy danh sách bài thi của user
router.get(
    '/my-quizzes',
    authMiddleware,
    usersQuizzesController.getUserQuizzes
);

// Lấy chi tiết kết quả một bài thi
router.get(
    '/:id',
    authMiddleware,
    usersQuizzesController.getQuizResult
);

// Lấy danh sách kết quả của một bài thi (chỉ dành cho admin/teacher)
router.get(
    '/quiz/:quizId/results',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    usersQuizzesController.getQuizResults
);

export default router;
