import mongoose from 'mongoose';
import UsersQuizzes, { IUsersQuizzes } from '../models/users_quizzes.model';

const createUserQuiz = async (data: {
    userId: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    score: number;
    timeTaken: number;
    feedback?: string;
}): Promise<IUsersQuizzes> => {
    const userQuiz = new UsersQuizzes(data);
    return await userQuiz.save();
};

const getUserQuizzesByUserId = async (
    userId: mongoose.Types.ObjectId
): Promise<IUsersQuizzes[]> => {
    return await UsersQuizzes.find({ userId })
        .populate('quizId')
        .sort({ createdAt: -1 });
};

const getUserQuizById = async (
    id: mongoose.Types.ObjectId
): Promise<IUsersQuizzes | null> => {
    return await UsersQuizzes.findById(id)
        .populate('quizId')
};

const getQuizResults = async (
    quizId: mongoose.Types.ObjectId
): Promise<IUsersQuizzes[]> => {
    return await UsersQuizzes.find({ quizId })
        .populate('userId')
        .sort({ score: -1 });
};

const getAllQuizzUsers = async (): Promise<IUsersQuizzes[]> => {
    return await UsersQuizzes.find()
        .populate('User', 'fullName email') // Lấy thông tin user
        .populate('quiz', 'title description category') // Lấy thông tin quiz
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian nộp bài mới nhất
};

export default {
    createUserQuiz,
    getUserQuizzesByUserId,
    getUserQuizById,
    getQuizResults,
    getAllQuizzUsers, 
};
