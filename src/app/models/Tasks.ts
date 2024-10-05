import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['tasks', 'inprogress', 'testing', 'done'], default: 'tasks' },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
