import express from 'express';
import { changePassword,  forgotPassword, getAllUsers, getUserById, googleAuth, googleCallback, loginUser, registerUser, resetPassword, updateUser } from '../controllers/auth.controller';
import roleMiddleware from '../../../middleware/role.middleware';
import authMiddleware from '../../../middleware/auth.middleware';


const router = express.Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id',authMiddleware, getUserById); // API mới để lấy userId
router.get("/", authMiddleware, getAllUsers);
router.put('/:userId', authMiddleware, updateUser); // API mới để cập nhật user
router.put('/changePassword/:id', authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleCallback);


// router.post('/auth/login', emailLogin);
export default router