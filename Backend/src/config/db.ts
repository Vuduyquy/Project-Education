import mongoose, { Error } from 'mongoose';
import config from './config';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.MONGODB_URI);
		console.log('MongoDB connected: ', conn.connection.host);
	} catch (err: unknown ) {
		console.log('error: ', (err as Error).message);
        process.exit(1);
	}
};


export default connectDB