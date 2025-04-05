import Discussion, { IDiscussion } from '../models/discussion.model';
import mongoose from 'mongoose';
import { CustomError } from '../../../utils/custom-error';

export function createDiscussion(
  courseId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  question: string
): Promise<IDiscussion> {
  return Discussion.create({
    courseId,
    userId,
    question,
    answers: [],
    isClose: false
  });
}

export function getDiscussionsByCourse(courseId: string): Promise<IDiscussion[]> {
  return Discussion.find({ courseId })
    .populate('userId', 'fullName')
    .populate("answers.userId", "fullName")
    .populate("courseId", 'title')
    .sort({ createdAt: -1 });
}

export function getDiscussionById(id: string): Promise<IDiscussion | null> {
  return Discussion.findById(id)
    .populate('userId', 'name email')
    .populate('answers.userId', 'name email');
}

export function addAnswer(
  discussionId: string,
  userId: mongoose.Types.ObjectId,
  answer: string
): Promise<IDiscussion | null> {
  return Discussion.findByIdAndUpdate(
    discussionId,
    {
      $push: { answers: { userId, answer } }
    },
    { new: true }
  );
}

export function closeDiscussion(discussionId: string): Promise<IDiscussion | null> {
  return Discussion.findByIdAndUpdate(
    discussionId,
    { isClose: true },
    { new: true }
  );
}
