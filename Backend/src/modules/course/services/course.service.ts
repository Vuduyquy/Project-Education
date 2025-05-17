import mongoose from 'mongoose';
import Course, { ICourse } from '../models/course.model';

export async function createCourse(courseData: Partial<ICourse>) {
  return await Course.create(courseData);
}

export async function getAllCourses(page: number = 1, limit: number = 5) {
  // Chuyển đổi page và limit thành số nguyên, đảm bảo giá trị hợp lệ
  const pageNumber = Math.max(1, parseInt(String(page), 10));
  const pageSize = Math.max(1, parseInt(String(limit), 10));

  // Tính số bản ghi cần bỏ qua
  const skip = (pageNumber - 1) * pageSize;

  // Lấy danh sách khóa học với phân trang
  const courses = await Course.find()
  .populate({
    path: 'instructorId',
    select: '_id fullName'
  })
    .populate('lessons', 'title resources')
    .populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'fullName' },
    })
    .populate('users', 'fullName')
    .skip(skip)
    .limit(pageSize);

  // Đếm tổng số khóa học
  const total = await Course.countDocuments();

  return {
    data: courses,
    total,
    page: pageNumber,
    limit: pageSize,
  };
}

export async function getCourseById(id: string) {
  return await Course.findById(id)
    .populate('instructorId', 'fullName')
    .populate('lessons')
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "fullName" }, // Lấy tên người dùng từ userId
    })
    .populate('users', 'fullName');
}

export async function updateCourse(id: string, updateData: Partial<ICourse>) {
  return await Course.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
}



export async function deleteCourse(id: string) {
  return await Course.findByIdAndDelete(id);
}


