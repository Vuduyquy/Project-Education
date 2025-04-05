import { Response } from 'express';
import mongoose from 'mongoose';
import { RequestCustom } from '../../../types/express.type';
import usersQuizzesService from '../services/users_quizzes.service';

const submitQuiz = async (req: RequestCustom, res: Response): Promise<any> => {
    try {
        const { userId, quizId, score, timeTaken, feedback } = req.body;

        const result = await usersQuizzesService.createUserQuiz({
            userId: new mongoose.Types.ObjectId(userId),
            quizId: new mongoose.Types.ObjectId(quizId),
            score,
            timeTaken,
            feedback
        });

        return res.status(201).json({
            message: 'Nộp bài thi thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã có lỗi xảy ra',
            error
        });
    }
};

const getUserQuizzes = async (req: RequestCustom, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        const userQuizzes = await usersQuizzesService.getUserQuizzesByUserId(
            new mongoose.Types.ObjectId(userId)
        );

        return res.status(200).json({
            message: 'Lấy danh sách bài thi thành công',
            data: userQuizzes
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã có lỗi xảy ra',
            error
        });
    }
};

const getQuizResult = async (req: RequestCustom, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await usersQuizzesService.getUserQuizById(
            new mongoose.Types.ObjectId(id)
        );

        if (!result) {
            return res.status(404).json({
                message: 'Không tìm thấy kết quả bài thi'
            });
        }

        return res.status(200).json({
            message: 'Lấy kết quả bài thi thành công',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã có lỗi xảy ra',
            error
        });
    }
};

const getQuizResults = async (req: RequestCustom, res: Response): Promise<any> => {
    try {
        const { quizId } = req.params;
        const results = await usersQuizzesService.getQuizResults(
            new mongoose.Types.ObjectId(quizId)
        );

        return res.status(200).json({
            message: 'Lấy danh sách kết quả bài thi thành công',
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã có lỗi xảy ra',
            error
        });
    }
};

const getAllQuizzUsers = async (req: RequestCustom, res: Response): Promise<any> => {
    try {
        const results = await usersQuizzesService.getAllQuizzUsers();

        return res.status(200).json({
            message: 'Lấy danh sách tất cả bài thi thành công',
            data: results
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã có lỗi xảy ra',
            error
        });
    }
};

export default {
    submitQuiz,
    getUserQuizzes,
    getQuizResult,
    getQuizResults,
    getAllQuizzUsers
};
