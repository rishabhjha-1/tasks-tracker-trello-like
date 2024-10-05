import { Document, ObjectId } from 'mongoose';

export interface TaskDocument extends Document {
  title: string;
  status: 'tasks' | 'inprogress' | 'testing' | 'done';
  developer: ObjectId;
}

export interface DeveloperDocument extends Document {
  name: string;
}
