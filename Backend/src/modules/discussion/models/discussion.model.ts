import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
	courseId: mongoose.Schema.Types.ObjectId;
	userId: mongoose.Schema.Types.ObjectId;
	question: string;
	answers: { userId: mongoose.Schema.Types.ObjectId; answer: string }[];
	createdAt: Date;
	updatedAt: Date;
}

const discussionSchema: Schema = new Schema(
	{
		courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		question: { type: String, required: true },
		answers: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				answer: String,
			},
		],
		isClose: { type: Boolean, require: true },
	},
	{ timestamps: true }
);

const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema);
export default Discussion;
