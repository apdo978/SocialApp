import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from 'node:console';

dotenv.config();

const connectDB = async () => {
    try {
        log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialapp');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
