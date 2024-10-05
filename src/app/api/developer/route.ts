import { NextRequest, NextResponse } from 'next/server';
import {connectMongo} from '@/lib/mongoose';
import Developer from '@/app/models/Developers';
import { DeveloperDocument } from '@/app/types';

// GET: Fetch all developers
export async function GET() {
  await connectMongo();

  const developers: DeveloperDocument[] = await Developer.find().exec();

  return NextResponse.json(developers);
}

// POST: Create a new developer
export async function POST(request: NextRequest) {
  await connectMongo();

  const { name } = await request.json();

  const newDeveloper = new Developer({ name });
  await newDeveloper.save();

  return NextResponse.json(newDeveloper);
}
