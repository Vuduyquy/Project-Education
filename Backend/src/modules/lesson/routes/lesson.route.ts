import express from 'express';
import * as lessonController from '../controllers/lesson.controller';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    lessonController.createLesson
);

router.get(
    '/',
    authMiddleware,
    lessonController.getAllLessons
);

router.get(
    '/:id',
    authMiddleware,
    lessonController.getLessonById
);

router.get(
    '/course/:courseId',
    authMiddleware,
    lessonController.getLessonsByCourse
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    lessonController.updateLesson
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    lessonController.deleteLesson
);

export default router;
