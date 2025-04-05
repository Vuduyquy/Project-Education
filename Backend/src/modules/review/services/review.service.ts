import mongoose from 'mongoose';
import Review from '../models/review.model';

export const createReview = async (
  courseId: string,
  userId: string,
  rating: number,
  comment: string
) => {
  return await Review.create({
    courseId: new mongoose.Types.ObjectId(courseId),
    userId: new mongoose.Types.ObjectId(userId),
    rating,
    comment
  });
};

export const getReviewsByCourse = async (courseId: string) => {
  return await Review.find({ courseId: new mongoose.Types.ObjectId(courseId) })
    .populate('User', 'fullName')
    .sort({ createdAt: -1 });
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number,
  comment: string
) => {
  return await Review.findOneAndUpdate(
    { _id: reviewId, userId: userId },
    { rating, comment },
    { new: true }
  );
};

export const deleteReview = async (reviewId: string, userId: string) => {
  return await Review.findOneAndDelete({ _id: reviewId, userId: userId });
};
