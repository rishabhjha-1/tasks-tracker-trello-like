import { NextRequest, NextResponse } from 'next/server';
import {connectMongo} from '@/lib/mongoose';
import Task from '@/app/models/Tasks';

// GET: Fetch all tasks
export async function GET() {
  await connectMongo();
  
  const tasks = await Task.find().populate('developer');
  
  return NextResponse.json(tasks);
}

// POST: Create a new task
export async function POST(request:NextRequest) {
  await connectMongo();
  
  const { title, developer } = await request.json();
  
  const newTask = new Task({ title, developer });
  await newTask.save();
  
  return NextResponse.json(newTask);
}
