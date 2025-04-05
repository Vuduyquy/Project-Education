import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
	courseId: mongoose.Schema.Types.ObjectId;
	userId: mongoose.Schema.Types.ObjectId;
	rating: number; // 1-5
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
	{
		courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
		comment: { type: String },
	},
	{ timestamps: true }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
