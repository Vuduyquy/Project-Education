import mongoose, { Document, Schema } from 'mongoose';

export interface IUsersQuizzes extends Document {
	userId: mongoose.Schema.Types.ObjectId;
	quizId: mongoose.Schema.Types.ObjectId;
	//answers: { questionId: mongoose.Schema.Types.ObjectId; answer: string }[];
	score: number;
	timeTaken: Number,
	feedback: string;
	createdAt: Date;
}

const usersQuizzesSchema: Schema = new Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
		// answers: [
		// 	{
		// 		questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
		// 		answer: String,
		// 	},
		// ],
		score: { type: Number, required: true },
		timeTaken: {type: Number, required: true},
		feedback: { type: String },
	},
	{ timestamps: true }
);

const UsersQuizzes = mongoose.model<IUsersQuizzes>(
	'UsersQuizzes',
	usersQuizzesSchema
);
export default UsersQuizzes;
