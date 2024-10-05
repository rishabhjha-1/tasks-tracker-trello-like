import { NextRequest, NextResponse } from 'next/server';
import {connectMongo} from '@/lib/mongoose';
import Task from '@/app/models/Tasks';
import { TaskDocument } from '@/app/types';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await connectMongo();

  const { id } = params;
  const { status }: { status: string } = await request.json();

  const task: TaskDocument | null = await Task.findByIdAndUpdate(id, { status }, { new: true }).exec();

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}
