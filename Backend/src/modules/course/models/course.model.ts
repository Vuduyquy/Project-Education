import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  instructorId: mongoose.Schema.Types.ObjectId;
  lessons: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  resources?: string[];
  reviews?: mongoose.Schema.Types.ObjectId[];
  category: string;
  users?: mongoose.Schema.Types.ObjectId[];
  image?: string;
}

const courseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    resources: [{ type: String }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    category: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;