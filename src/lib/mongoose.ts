import mongoose from 'mongoose';





let isConnected = false; // Track the connection status

export async function connectMongo() {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    
    if (!process.env.MONGODB_URI) {
      throw new Error('Please add the MongoDB URI to your environment variables');
    }

    // No need for options
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}
