import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
	email: string;
	password: string;
	fullName: string;
	resetPasswordToken?: string;
    resetPasswordExpires?: number;
	role: string; // student, teacher, admin
	courses: mongoose.Schema.Types.ObjectId[];
	exams: mongoose.Schema.Types.ObjectId[];
	avatar: string;
	googleId?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const userSchema: Schema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		fullName: { type: String, required: true },
		role: {
			type: String,
			enum: ['student', 'teacher', 'admin'],
			default: 'student',
		},
		courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
		quiz: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}],
		avatar: { type: String },
		resetPasswordToken: { type: String, required: false },
		resetPasswordExpires: { type: Date, required: false },
		googleId: {type: String, required: false, unique: true},//Luu google ID cua nguoi dung
	},
	{ timestamps: true },
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
