import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { RequestCustom } from '../../../types/express.type';
import mongoose from 'mongoose';
import  passport  from 'passport';
import generateToken from '../../../utils/generateToken';
import User from '../../user/models/user.model';
import { comparePassword } from '../../../utils/hashPassword';
import { UserPayload } from '../../../types/user.type';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;
        const { user, token } = await userService.registerUser(email, password, fullName);
        res.status(201).json({ message: 'Đăng ký thành công', user, token });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);
        res.json({ message: 'Đăng nhập thành công', user, token });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


export const getUserById = async (req: RequestCustom, res: Response) => {
    try {
        if (!req.user) throw { statusCode: 401, message: "Unauthorized" };
        console.log("🔍 User object from request:", req.user); // Kiểm tra req.user

        // Kiểm tra nếu _id là string hợp lệ, thì chuyển sang ObjectId
        if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
            throw { statusCode: 400, message: "ID người dùng không hợp lệ" };
        }

        const userId = new mongoose.Types.ObjectId(req.user._id); // Chuyển từ string -> ObjectId
        const user = await userService.getUserById(userId);

        res.json(user);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};



export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateUser = async (req: RequestCustom, res: Response) => {
    try {
        if (!req.user) throw { statusCode: 401, message: "Unauthorized" };

        const userId = req.user._id;; // Lấy từ params thay vì req.user._id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw { statusCode: 400, message: "ID người dùng không hợp lệ" };
        }

        const updatedData = req.body;

        if (updatedData.password) {
            throw { statusCode: 400, message: "Không thể cập nhật mật khẩu từ API này" };
        }

        const user = await userService.updateUserService(new mongoose.Types.ObjectId(userId), updatedData);
        res.json({ message: "Cập nhật thành công", user });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const changePassword = async (req: RequestCustom, res: Response) => {
    console.log("🔹 API changePassword được gọi!");

    try {
        const { id } = req.params; // ✅ Lấy ID từ params
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw { statusCode: 400, message: "ID người dùng không hợp lệ" };
        }

        console.log("✅ User ID từ params:", id);

        const userId = new mongoose.Types.ObjectId(id);
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw { statusCode: 400, message: "Vui lòng nhập đủ thông tin" };
        }

        const result = await userService.changeUserPassword(userId, oldPassword, newPassword);
        res.json({ message: "Đổi mật khẩu thành công", result });
    } catch (error: any) {
        console.error("❌ Lỗi changePassword:", error);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await userService.requestPasswordReset(email);
        res.json(result);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        const result = await userService.resetPassword(token, newPassword);
        res.json(result);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
     
export const googleAuth = (req: Request, res: Response) => {
    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
}


export const googleCallback = (req: Request, res: Response) => {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
        if (err) {
            // Redirect về frontend với thông báo lỗi
            return res.redirect('http://localhost:3000?error=Authentication_failed');
        }
        if (!user) {
            return res.redirect('http://localhost:3000?error=No_user_found');
        }

        const token = generateToken(user);
        // Redirect về frontend với token trong query params
        return res.redirect(`http://localhost:3000?token=${token}`);
    })(req, res);
};