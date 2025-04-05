import { Request, Response, NextFunction } from 'express';
import Quiz from '../models/quizz.model';
import { RequestCustom } from '../../../types/express.type';
import * as quizzService from '../services/quizz.service';

export const createQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, description, questions, duration, level, category, highest_point } = req.body;

        if (!questions || questions.length === 0) {
            res.status(400).json({ message: 'Danh sách câu hỏi không được để trống.' });
            return;
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

        res.status(201).json({ message: 'Tạo đề thi thành công', quizz });
    } catch (error) {
        next(error);
    }
};

export const getAllQuizz = async (req: RequestCustom, res: Response) => {
	try {
		const { page, limit, sortBy, sortOrder, keyword, fields } = req.query;

		const result = await quizzService.findQuizz({
			page: Number(page),
			limit: Number(limit),
			sortBy: sortBy as string,
			sortOrder: sortOrder as 'asc' | 'desc',
			keyword: keyword as string,
			fields: fields as string,
		});

		res.status(200).json({
			success: true,
			data: result.quizz,
			pagination: result.pagination,
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message || 'Lỗi khi lấy danh sách thể loại',
		});
	}
};

export const getQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const quizz = await Quiz.findById(id).populate('questions') // Populate để lấy chi tiết các câu hỏi
        .populate('category', 'title');;

        if (!quizz) {
            res.status(404).json({ message: 'Không tìm thấy đề thi' });
            return;
        }

        res.status(200).json(quizz);
    } catch (error) {
        next(error);
    }
};

export const updateQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const quizz = await Quiz.findByIdAndUpdate(id, updates, { new: true }).populate('questions')
        .populate('category', 'title');;

        if (!quizz) {
            res.status(404).json({ message: 'Không tìm thấy đề thi để cập nhật' });
            return;
        }

        res.status(200).json({ message: 'Cập nhật đề thi thành công', quizz });
    } catch (error) {
        next(error);
    }
};


export const deleteQuizz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const quizz = await Quiz.findByIdAndDelete(id);

        if (!quizz) {
            res.status(404).json({ message: 'Không tìm thấy đề thi để xóa' });
            return;
        }

        res.status(200).json({ message: 'Xóa đề thi thành công' });
    } catch (error) {
        next(error);
    }
};