import { MONGODB_URI } from '@/configs/env.private';
import mongoose from 'mongoose';

export const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
};
