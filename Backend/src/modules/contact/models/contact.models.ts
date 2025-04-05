import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
	name: string;
	email: string;
    decription: string;
	createdAt: Date;
	updatedAt: Date;
}

const contactSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
        email: {type: String, required: true},
		description: { type: String, required: true },
	},
	{ timestamps: true }
);

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
