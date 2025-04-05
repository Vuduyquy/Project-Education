import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
	userCreated: mongoose.Schema.Types.ObjectId;
	usersJoin: { userId: mongoose.Schema.Types.ObjectId; status: string }[];
	type: string;
	link: string;
	timeStart: Date;
	timeEnd: Date;
	createdAt: Date;
	updatedAt: Date;
}

const scheduleSchema: Schema = new Schema(
	{
		userCreated: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usersJoin: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				status: String,
			},
		],
		type: { type: String, required: true },
		// link: { type: String, default: null },
		course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
		timeStart: { type: Date, required: true },
		timeEnd: { type: Date, required: true },
	},
	{ timestamps: true }
);

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
export default Schedule;
