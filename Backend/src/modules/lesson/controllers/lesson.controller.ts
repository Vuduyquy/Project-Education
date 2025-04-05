import { RequestHandler, Response } from 'express';
import { RequestCustom } from '../../../types/express.type';
import * as lessonService from '../services/lesson.service';

export const createLesson: RequestHandler = async (req, res) => {
    try {
        const lesson = await lessonService.createLesson(req.body);
        res.status(201).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo bài học'
        });
    }
};

export const getAllLessons: RequestHandler = async (req, res) => {
    try {
        const lessons = await lessonService.getAllLessons();
        res.status(200).json({
            success: true,
            data: lessons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy danh sách tất cả bài học'
        });
    }
};

export const getLessonById: RequestHandler = async (req, res) => {
    try {
        const lesson = await lessonService.getLessonById(req.params.id);
        if (!lesson) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài học'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy thông tin bài học'
        });
    }
};

export const getLessonsByCourse: RequestHandler = async (req, res) => {
    try {
        const lessons = await lessonService.getLessonsByCourseId(req.params.courseId);
        res.status(200).json({
            success: true,
            data: lessons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy danh sách bài học'
        });
    }
};

// export const updateLesson: RequestHandler = async (req, res) => {
//     try {
//         const { courseId } = req.body;
//         const lesson = await lessonService.updateLesson(req.params.id, { courseId });
//         if (!lesson) {
//             res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy bài học'
//             });
//             return;
//         }
//         res.status(200).json({
//             success: true,
//             data: lesson
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Có lỗi xảy ra khi cập nhật bài học'
//         });
//     }
// };


export const updateLesson: RequestHandler = async (req, res) => {
    try {
        const lesson = await lessonService.updateLesson(req.params.id, req.body);
        if (!lesson) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài học'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật bài học'
        });
    }
};

export const deleteLesson: RequestHandler = async (req, res) => {
    try {
        const lesson = await lessonService.deleteLesson(req.params.id);
        if (!lesson) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài học'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Xóa bài học thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa bài học'
        });
    }
};
