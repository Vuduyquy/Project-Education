import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
	userId: mongoose.Schema.Types.ObjectId;
	message: string;
	type: string;
	seen: boolean;
	createdAt: Date;
}

const notificationSchema: Schema = new Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		message: { type: String, required: true },
		type: { type: String, required: true },
		seen: { type: Boolean, default: false },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const Notification = mongoose.model<INotification>(
	'Notification',
	notificationSchema
);
export default Notification;
