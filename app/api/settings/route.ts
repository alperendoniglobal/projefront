import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET settings
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    db.settings = {
      ...db.settings,
      ...body,
    };

    writeDB(db);
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

