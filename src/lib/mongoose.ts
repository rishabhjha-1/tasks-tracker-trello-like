import mongoose, { Connection } from 'mongoose';
const MONGODB_URI = "mongodb+srv://Rishabh:Letzkhelo%401@cluster0.thpy6wf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/task-tracker";




let isConnected = false; // Track the connection status

export async function connectMongo() {
  if (isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    
    if (!MONGODB_URI) {
      throw new Error('Please add the MongoDB URI to your environment variables');
    }

    // No need for options
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}
