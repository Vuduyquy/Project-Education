import { Request, Response, RequestHandler } from 'express';
import { 
  createCourse, 
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse, 
} from '../services/course.service';
import { CustomError } from '../../../utils/custom-error';
import { createNewNotification } from "../../notification/services/notification.service"; // Import để tạo thông báo
// Thêm interface cho request body
interface CourseRequest {
  body: any;
  params: {
    id?: string;
  };
}

export const handleCreateCourse: RequestHandler<{}, any, CourseRequest['body']> = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo khóa học thành công',
      data: course
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};

export const handleGetAllCourses: RequestHandler = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách khóa học thành công',
      data: courses
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};

export const handleGetCourseById: RequestHandler<{id: string}> = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      throw new CustomError('Không tìm thấy khóa học', 404);
    }
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};

export const handleUpdateCourse: RequestHandler<{id: string}, any, CourseRequest['body']> = async (req, res) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    if (!course) {
      throw new CustomError('Không tìm thấy khóa học', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật khóa học thành công',
      data: course
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};

export const handleDeleteCourse: RequestHandler<{id: string}> = async (req, res) => {
  try {
    const course = await deleteCourse(req.params.id);
    if (!course) {
      throw new CustomError('Không tìm thấy khóa học', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Xóa khóa học thành công'
    });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
};

