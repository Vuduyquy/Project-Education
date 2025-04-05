import mongoose from 'mongoose';
import Lesson, { ILesson } from '../models/lesson.model';

export const createLesson = async (lessonData: Partial<ILesson>): Promise<ILesson> => {
    const lesson = new Lesson(lessonData);
    return await lesson.save();
};

export const getAllLessons = async (): Promise<ILesson[]> => {
    return await Lesson.find().populate('courseId', 'title')
    
};

export const getLessonById = async (id: string): Promise<ILesson | null> => {
    return await Lesson.findById(id);
};

export const getLessonsByCourseId = async (courseId: string): Promise<ILesson[]> => {
    return await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) });
};

// export const updateLesson = async (id: string, updateData: Partial<ILesson>): Promise<ILesson | null> => {
//     const lesson = await Lesson.findById(id);
//     if (!lesson) return null;

//     // Nếu courseId là mảng các string ID, chuyển đổi chúng thành ObjectId
//     if (updateData.courseId) {
//         const newCourseIds = updateData.courseId.map((courseId) =>
//             typeof courseId === 'string' ? new mongoose.Types.ObjectId(courseId) : courseId
//         );

//         // Loại bỏ các khóa học trùng lặp
//         lesson.courseId = Array.from(new Set([...lesson.courseId, ...newCourseIds]));
//     }

//     Object.assign(lesson, updateData);
//     return await lesson.save();
// };


// export const updateLesson = async (id: string, updateData: Partial<ILesson>): Promise<ILesson | null> => {
//     const lesson = await Lesson.findById(id);
//     if (!lesson) return null;

//     // Cập nhật các khóa học mới (nếu có)
//     if (updateData.courseId) {
//         // Loại bỏ các khóa học trùng lặp
//         lesson.courseId = Array.from(new Set([...lesson.courseId, ...updateData.courseId]));
//     }

//     Object.assign(lesson, updateData);
//     return await lesson.save();
// };


export const updateLesson = async (id: string, updateData: Partial<ILesson>): Promise<ILesson | null> => {
    return await Lesson.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteLesson = async (id: string): Promise<ILesson | null> => {
    return await Lesson.findByIdAndDelete(id);
};
