import  { Schema, model, models } from 'mongoose';
import { DeveloperDocument } from '@/app/types';

const developerSchema = new Schema<DeveloperDocument>({
  name: { type: String, required: true }
});

const Developer = models.Developer || model<DeveloperDocument>('Developer', developerSchema);
export default Developer;
