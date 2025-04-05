import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
	title: string;
	description: string;
	// courseId: mongoose.Schema.Types.ObjectId;
	// questions: { questionText: string; answers: string[]; correctAnswer: string }[];
	questions: mongoose.Schema.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const quizSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		// courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
		// questions: [
		// 	{
		// 		questionText: { type: String, required: true }, // Nội dung câu hỏi
		// 		answers: { type: [String], required: true },  // Mảng các câu trả lời
		// 		correctAnswer: { type: String, required: true }, // Câu trả lời đúng
		// 	}
		// ],
		questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
		duration: { type: Number, require: true },
		level: { type: Number, require: true },
		category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
		highest_point: {type: Number}
	},
	{ timestamps: true }
);

const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export default Quiz;
