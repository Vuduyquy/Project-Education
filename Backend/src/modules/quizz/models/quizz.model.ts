import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
	title: string;
	description: string;
	questions: mongoose.Schema.Types.ObjectId;
	duration: number;
	level: number;
	category: mongoose.Schema.Types.ObjectId;
	highest_point: number;
	createdAt: Date;
	updatedAt: Date;
}

const quizSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
		duration: { type: Number, require: true },
		level: { type: Number, require: true },
		category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
		highest_point: {type: Number},
	},
	{ timestamps: true }
);

const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export default Quiz;
