import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, generateSlug } from '@/lib/db';

// GET single news
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const news = db.news.find((n) => n.id === id || n.slug === id);

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// PUT update news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDB();

    const index = db.news.findIndex((n) => n.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    db.news[index] = {
      ...db.news[index],
      ...body,
      slug: body.title ? generateSlug(body.title) : db.news[index].slug,
      updatedAt: new Date().toISOString(),
    };

    writeDB(db);
    return NextResponse.json(db.news[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const index = db.news.findIndex((n) => n.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    db.news.splice(index, 1);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}

