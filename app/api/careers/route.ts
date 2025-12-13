import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, generateId, Career } from '@/lib/db';

// GET all careers
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.careers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}

// POST create new career
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const newCareer: Career = {
      id: generateId(),
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      description: body.description,
      requirements: body.requirements || [],
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.careers.push(newCareer);
    writeDB(db);

    return NextResponse.json(newCareer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 });
  }
}

