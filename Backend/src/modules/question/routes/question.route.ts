import express from 'express';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';
import { createQuestion, getQuestions, updateQuestion, deleteQuestion, getQuestionsByFilters } from '../controllers/question.controller';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['teacher', 'admin']), createQuestion);
router.get('/', authMiddleware, getQuestions);
router.put('/:id', authMiddleware, roleMiddleware(['teacher', 'admin']), updateQuestion);
router.delete('/:id', authMiddleware, roleMiddleware(['teacher', 'admin']), deleteQuestion);
router.get('/bank', authMiddleware, getQuestionsByFilters);

export default router;