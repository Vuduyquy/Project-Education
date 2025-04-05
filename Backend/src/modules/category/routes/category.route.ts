import express from 'express';
import authMiddleware from '../../../middleware/auth.middleware';
import roleMiddleware from '../../../middleware/role.middleware';
import {
	createCategory,
	createManyCategories,
	deleteCategory,
	deleteManyCategories,
	getCategories,
	getCategory,
	updateCategory,
} from '../controllers/category.controller';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', authMiddleware, roleMiddleware(['admin']), createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCategory);
router.delete(
	'/:id',
	authMiddleware,
	roleMiddleware(['admin']),
	deleteCategory
);
router.post('/bulk',authMiddleware, roleMiddleware(['admin']), createManyCategories);
router.delete('/bulk',authMiddleware, roleMiddleware(['admin']), deleteManyCategories);


export default router;