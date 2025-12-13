import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET single career
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const career = db.careers.find((c) => c.id === id);

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch career' }, { status: 500 });
  }
}

// PUT update career
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDB();

    const index = db.careers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    db.careers[index] = {
      ...db.careers[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    return NextResponse.json(db.careers[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 });
  }
}

// DELETE career
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const index = db.careers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    db.careers.splice(index, 1);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete career' }, { status: 500 });
  }
}

