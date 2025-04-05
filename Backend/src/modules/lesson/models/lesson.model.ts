import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
	title: string;
	content: string;
	courseId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const lessonSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String },
		courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
		resources: [{ type: String }],
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
export default Lesson;
