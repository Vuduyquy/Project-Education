import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

const categorySchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
	},
	{ timestamps: true }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
