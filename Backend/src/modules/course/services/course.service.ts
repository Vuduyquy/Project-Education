import mongoose from 'mongoose';
import Course, { ICourse } from '../models/course.model';

export async function createCourse(courseData: Partial<ICourse>) {
  return await Course.create(courseData);
}

export async function getAllCourses() {
  return await Course.find()
    .populate('instructorId')
    .populate('lessons','title resources')
    .populate('reviews')
    .populate('users','fullName');
}

export async function getCourseById(id: string) {
  return await Course.findById(id)
    .populate('instructorId')
    .populate('lessons')
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "fullName" }, // Lấy tên người dùng từ userId
    })
    .populate('users', 'fullName');
}

// export const updateCourse = async (id: string, updateData: Partial<ICourse>): Promise<ICourse | null> => {
//   console.log('updateData:', updateData)
//     const course = await Course.findById(id);
//     if (!course) return null;

//     // Cập nhật các khóa học mới (nếu có)
//     if (updateData.lessons) {
//       const lessonsArray = Array.isArray(updateData.lessons) ? updateData.lessons : [updateData.lessons];
//       course.lessons = Array.from(new Set([...course.lessons, ...lessonsArray]));
//     }
    

//     Object.assign(course, updateData);
//     return await course.save();
// };

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

