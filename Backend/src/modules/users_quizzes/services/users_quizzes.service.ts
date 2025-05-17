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

// const getUserQuizzesByUserId = async (
//     userId: mongoose.Types.ObjectId
// ): Promise<IUsersQuizzes[]> => {
//     return await UsersQuizzes.find({ userId })
//         .populate('quizId')
//         .sort({ createdAt: -1 });
// };

const getUserQuizzesByUserId = async (
    userId: mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 5
): Promise<{
    data: IUsersQuizzes[];
    total: number;
    page: number;
    limit: number;
}> => {
    const pageNumber = Math.max(1, parseInt(String(page), 10)); // Đảm bảo page >= 1
    const pageSize = Math.max(1, parseInt(String(limit), 10)); // Đảm bảo limit >= 1
    const skip = (pageNumber - 1) * pageSize; // Tính số bản ghi cần bỏ qua

    // Lấy danh sách bài thi với phân trang
    const userQuizzes = await UsersQuizzes.find({ userId })
        .populate('quizId', 'title description category') // Populate quizId
        .skip(skip) // Bỏ qua các bản ghi trước trang hiện tại
        .limit(pageSize) // Giới hạn số bản ghi trả về
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo giảm dần

    // Đếm tổng số bản ghi
    const total = await UsersQuizzes.countDocuments({ userId });

    return {
        data: userQuizzes,
        total,
        page: pageNumber,
        limit: pageSize,
    };
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
        .populate('userId', 'fullName email') // Lấy thông tin user
        .populate('quizId', 'title description category') // Lấy thông tin quiz
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian nộp bài mới nhất
};

export default {
    createUserQuiz,
    getUserQuizzesByUserId,
    getUserQuizById,
    getQuizResults,
    getAllQuizzUsers, 
};
