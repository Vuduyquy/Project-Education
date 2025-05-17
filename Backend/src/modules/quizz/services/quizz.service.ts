// import Quiz, { IQuiz } from '../models/quizz.model';
// import Question from '../../question/models/question.model';
// import { CustomError } from '../../../utils/custom-error';
// import mongoose from 'mongoose';

// interface QueryOptions {
//     page?: number;
//     limit?: number;
//     sortBy?: string;
//     sortOrder?: 'asc' | 'desc';
//     keyword?: string;
//     fields?: string;
//   }
  
//   export const findQuizz = async (options: QueryOptions = {}) => {
//     try {
//       const {
//         page = 1,
//         limit = 5,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         keyword = '',
//         fields = '',
//       } = options;
  
//       // Tạo query filter
//       const filter: any = {};
//       if (keyword) {
//         filter.$or = [
//           { title: { $regex: keyword, $options: 'i' } },
//           { description: { $regex: keyword, $options: 'i' } },
//           { questions: { $regex: keyword, $options: 'i' } },
//           { duration: { $regex: keyword, $options: 'i' } },
//           { level: { $regex: keyword, $options: 'i' } },
//           { category: { $regex: keyword, $options: 'i' } },
//           { highest_point: { $regex: keyword, $options: 'i' } },
//         ];
//       }
  
//       // console.log('filter: ', filter)
  
//       // Tính toán skip cho phân trang
//       const skip = (page - 1) * limit;
  
//       // Tạo sort object
//       const sort: any = {};
//       sort[sortBy] = sortOrder;
  
//       // Xử lý select fields
//       const selectFields = fields ? fields.split(',').join(' ') : '';
  
//       // Thực hiện query với filter và phân trang
//       const [quizz, totalCount] = await Promise.all([
//         Quiz.find(filter)
//           .populate('questions')
//           .populate('category', 'title')
//           .select(selectFields)
//           .sort(sort)
//           .skip(skip)
//           .limit(limit),
//         Quiz.countDocuments(filter)
//       ]);
  
//       return {
//         quizz,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(totalCount / limit),
//           totalItems: totalCount,
//           itemsPerPage: limit
//         }
//       };
//     } catch (error) {
//       throw error;
//     }
//   };

// export const createQuizFromQuestionBank = async (data: {
//     title: string;
//     description: string;
//     questions:  string[];
//     duration: number;
//     level: number;
//     category: string;
//     highest_point: number;
// }): Promise<IQuiz> => {
//     if (!data.questions || data.questions.length === 0) {
//         throw new CustomError('Cần phải cung cấp ít nhất một câu hỏi', 400);
//     }

//     return await Quiz.create({
//         ...data,
//         questions: data.questions,
//         highest_point: data.highest_point,
//     });
// };

// export const getAllQuizzesService = async (): Promise<IQuiz[]> => {
//     return await Quiz.find().populate('questions')
//     .populate('category', 'title');;
// };

// export const getQuizWithQuestions = async (id: string): Promise<any> => {
//     const quiz = await Quiz.findById(id)
//     .populate('questions') 
//         .populate('category').exec();;
    
//     if (!quiz) throw new CustomError('Không tìm thấy bài kiểm tra', 404);
//     return quiz;
// };

// export const getQuizzesByCategory = async (categoryId: string): Promise<IQuiz[]> => {
//     return await Quiz.find({ category: categoryId })
//     .populate('questions')
//         .populate('category', 'title')
//         .select('title duration level');
// };

// export const getQuizLeaderboard = async (quizId: string): Promise<any[]> => {
//     return await Quiz.aggregate([
//         { $match: { _id: new mongoose.Types.ObjectId(quizId) } },
//         {
//             $lookup: {
//                 from: 'usersquizzes',
//                 localField: '_id',
//                 foreignField: 'quizId',
//                 as: 'attempts'
//             }
//         },
//         { $unwind: '$attempts' },
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'attempts.userId',
//                 foreignField: '_id',
//                 as: 'user'
//             }
//         },
//         { $unwind: '$user' },
//         {
//             $project: {
//                 'user.fullName': 1,
//                 'attempts.score': 1,
//                 'attempts.createdAt': 1
//             }
//         },
//         { $sort: { 'attempts.score': -1 } },
//         { $limit: 10 }
//     ]);
// };


import Quiz, { IQuiz } from '../models/quizz.model';
import Question from '../../question/models/question.model';
import { CustomError } from '../../../utils/custom-error';
import mongoose from 'mongoose';

// Hàm lấy danh sách đề thi với phân trang
export async function findQuizz(page: number = 1, limit: number = 5) {
  // Chuyển đổi page và limit thành số nguyên, đảm bảo giá trị hợp lệ
  const pageNumber = Math.max(1, parseInt(String(page), 10));
  const pageSize = Math.max(1, parseInt(String(limit), 10));

  // Tính số bản ghi cần bỏ qua
  const skip = (pageNumber - 1) * pageSize;

  // Lấy danh sách đề thi với phân trang
  const quizzes = await Quiz.find()
    .populate('questions')
    .populate('category', 'title')
    .skip(skip)
    .limit(pageSize);

  // Đếm tổng số đề thi
  const total = await Quiz.countDocuments();

  return {
    data: quizzes,
    total,
    page: pageNumber,
    limit: pageSize,
  };
}

// Các hàm khác giữ nguyên
export const createQuizFromQuestionBank = async (data: {
  title: string;
  description: string;
  questions: string[];
  duration: number;
  level: number;
  category: string;
  highest_point: number;
}): Promise<IQuiz> => {
  if (!data.questions || data.questions.length === 0) {
    throw new CustomError('Cần phải cung cấp ít nhất một câu hỏi', 400);
  }

  return await Quiz.create({
    ...data,
    questions: data.questions,
    highest_point: data.highest_point,
  });
};

export const getAllQuizzesService = async (): Promise<IQuiz[]> => {
  return await Quiz.find()
    .populate('questions')
    .populate('category', 'title');
};

export const getQuizWithQuestions = async (id: string): Promise<any> => {
  const quiz = await Quiz.findById(id)
    .populate('questions')
    .populate('category')
    .exec();

  if (!quiz) throw new CustomError('Không tìm thấy bài kiểm tra', 404);
  return quiz;
};

export const getQuizzesByCategory = async (categoryId: string): Promise<IQuiz[]> => {
  return await Quiz.find({ category: categoryId })
    .populate('questions')
    .populate('category', 'title')
    .select('title duration level');
};

export const getQuizLeaderboard = async (quizId: string): Promise<any[]> => {
  return await Quiz.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(quizId) } },
    {
      $lookup: {
        from: 'usersquizzes',
        localField: '_id',
        foreignField: 'quizId',
        as: 'attempts',
      },
    },
    { $unwind: '$attempts' },
    {
      $lookup: {
        from: 'users',
        localField: 'attempts.userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        'user.fullName': 1,
        'attempts.score': 1,
        'attempts.createdAt': 1,
      },
    },
    { $sort: { 'attempts.score': -1 } },
    { $limit: 10 },
  ]);
};