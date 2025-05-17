// import { Request, Response, NextFunction } from 'express';
// import Quiz from '../models/quizz.model';
// import { RequestCustom } from '../../../types/express.type';
// import * as quizzService from '../services/quizz.service';

// export const createQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { title, description, questions, duration, level, category, highest_point } = req.body;

//         if (!questions || questions.length === 0) {
//             res.status(400).json({ message: 'Danh sách câu hỏi không được để trống.' });
//             return;
//         }

//         const quizz = await Quiz.create({
//             title,
//             description,
//             questions,
//             duration,
//             level,
//             category,
//             highest_point: highest_point || 0,
//         });

//         res.status(201).json({ message: 'Tạo đề thi thành công', quizz });
//     } catch (error) {
//         next(error);
//     }
// };

// // export const getAllQuizz = async (req: RequestCustom, res: Response) => {
// // 	try {
// // 		const { page, limit, sortBy, sortOrder, keyword, fields } = req.query;

// // 		const result = await quizzService.findQuizz({
// // 			page: Number(page),
// // 			limit: Number(limit),
// // 			sortBy: sortBy as string,
// // 			sortOrder: sortOrder as 'asc' | 'desc',
// // 			keyword: keyword as string,
// // 			fields: fields as string,
// // 		});

// // 		res.status(200).json({
// // 			success: true,
// // 			data: result.quizz,
// // 			pagination: result.pagination,
// // 		});
// // 	} catch (error: any) {
// // 		res.status(500).json({
// // 			success: false,
// // 			message: error.message || 'Lỗi khi lấy danh sách thể loại',
// // 		});
// // 	}
// // };

// // Lấy danh sách đề thi (phân trang)
// export const getAllQuizz: RequestHandler = async (req, res) => {
//     try {
//       // Lấy page và limit từ query string, mặc định page=1, limit=5
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 5;
  
//       const result = await quizzService.findQuizz(page, limit);
  
//       res.status(200).json({
//         success: true,
//         message: 'Lấy danh sách đề thi thành công',
//         data: result.data,
//         pagination: {
//           total: result.total,
//           page: result.page,
//           limit: result.limit,
//           totalPages: Math.ceil(result.total / result.limit),
//         },
//       });
//     } catch (error) {
//       if (error instanceof CustomError) {
//         res.status(error.statusCode).json({
//           success: false,
//           message: error.message,
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: 'Lỗi server',
//           error: process.env.NODE_ENV === 'development' ? error : undefined,
//         });
//       }
//     }
//   };

// export const getQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const quizz = await Quiz.findById(id).populate('questions') // Populate để lấy chi tiết các câu hỏi
//         .populate('category', 'title');;

//         if (!quizz) {
//             res.status(404).json({ message: 'Không tìm thấy đề thi' });
//             return;
//         }

//         res.status(200).json(quizz);
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         const quizz = await Quiz.findByIdAndUpdate(id, updates, { new: true }).populate('questions')
//         .populate('category', 'title');;

//         if (!quizz) {
//             res.status(404).json({ message: 'Không tìm thấy đề thi để cập nhật' });
//             return;
//         }

//         res.status(200).json({ message: 'Cập nhật đề thi thành công', quizz });
//     } catch (error) {
//         next(error);
//     }
// };


// export const deleteQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const quizz = await Quiz.findByIdAndDelete(id);

//         if (!quizz) {
//             res.status(404).json({ message: 'Không tìm thấy đề thi để xóa' });
//             return;
//         }

//         res.status(200).json({ message: 'Xóa đề thi thành công' });
//     } catch (error) {
//         next(error);
//     }
// };

import { RequestHandler } from 'express';
import Quiz from '../models/quizz.model';
import * as quizzService from '../services/quizz.service';
import { CustomError } from '../../../utils/custom-error';

// Định nghĩa interface cho request body (nếu cần)
interface QuizzRequest {
  body: any;
  params: {
    id?: string;
  };
}

// Tạo đề thi
export const createQuizz: RequestHandler<{}, any, QuizzRequest['body']> = async (req, res) => {
  try {
    const { title, description, questions, duration, level, category, highest_point } = req.body;

    if (!questions || questions.length === 0) {
      throw new CustomError('Danh sách câu hỏi không được để trống.', 400);
    }

    const quizz = await Quiz.create({
      title,
      description,
      questions,
      duration,
      level,
      category,
      highest_point: highest_point || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo đề thi thành công',
      data: quizz,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};

// Lấy danh sách đề thi (phân trang)
export const getAllQuizz: RequestHandler = async (req, res) => {
  try {
    // Lấy page và limit từ query string, mặc định page=1, limit=5
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string);

    const result = await quizzService.findQuizz(page, limit);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách đề thi thành công',
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};

// Lấy thông tin một đề thi
export const getQuizz: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const quizz = await Quiz.findById(id)
      .populate('questions')
      .populate('category', 'title');

    if (!quizz) {
      throw new CustomError('Không tìm thấy đề thi', 404);
    }

    res.status(200).json({
      success: true,
      data: quizz,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};

// Cập nhật đề thi
export const updateQuizz: RequestHandler<{ id: string }, any, QuizzRequest['body']> = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const quizz = await Quiz.findByIdAndUpdate(id, updates, { new: true })
      .populate('questions')
      .populate('category', 'title');

    if (!quizz) {
      throw new CustomError('Không tìm thấy đề thi để cập nhật', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đề thi thành công',
      data: quizz,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};

// Xóa đề thi
export const deleteQuizz: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const quizz = await Quiz.findByIdAndDelete(id);

    if (!quizz) {
      throw new CustomError('Không tìm thấy đề thi để xóa', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Xóa đề thi thành công',
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
};