// import mongoose from 'mongoose';
// import Lesson, { ILesson } from '../models/lesson.model';

// export const createLesson = async (lessonData: Partial<ILesson>): Promise<ILesson> => {
//     const lesson = new Lesson(lessonData);
//     return await lesson.save();
// };

// export const getAllLessons = async (): Promise<ILesson[]> => {
//     return await Lesson.find().populate('courseId', 'title')
    
// };

// export const getLessonById = async (id: string): Promise<ILesson | null> => {
//     return await Lesson.findById(id);
// };

// export const getLessonsByCourseId = async (courseId: string): Promise<ILesson[]> => {
//     return await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) });
// };

// export const updateLesson = async (id: string, updateData: Partial<ILesson>): Promise<ILesson | null> => {
//     return await Lesson.findByIdAndUpdate(id, updateData, { new: true });
// };

// export const deleteLesson = async (id: string): Promise<ILesson | null> => {
//     return await Lesson.findByIdAndDelete(id);
// };

import mongoose from 'mongoose';
import Lesson, { ILesson } from '../models/lesson.model';

export const createLesson = async (lessonData: Partial<ILesson>): Promise<ILesson> => {
  const lesson = new Lesson(lessonData);
  return await lesson.save();
};

export const getAllLessons = async (page: number = 1, limit: number = 5): Promise<{
  data: ILesson[];
  total: number;
  page: number;
  limit: number;
}> => {
  const pageNumber = Math.max(1, parseInt(String(page), 10));
  const pageSize = Math.max(1, parseInt(String(limit), 10));
  const skip = (pageNumber - 1) * pageSize;

  const lessons = await Lesson.find()
    .populate('courseId', 'title')
    .skip(skip)
    .limit(pageSize);

  const total = await Lesson.countDocuments();

  return {
    data: lessons,
    total,
    page: pageNumber,
    limit: pageSize,
  };
};

export const getLessonById = async (id: string): Promise<ILesson | null> => {
  return await Lesson.findById(id);
};

export const getLessonsByCourseId = async (courseId: string): Promise<ILesson[]> => {
  return await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) });
};

export const updateLesson = async (id: string, updateData: Partial<ILesson>): Promise<ILesson | null> => {
  return await Lesson.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteLesson = async (id: string): Promise<ILesson | null> => {
  return await Lesson.findByIdAndDelete(id);
};