import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, generateId, generateSlug, News } from '@/lib/db';

// GET all news
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const newNews: News = {
      id: generateId(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 150),
      image: body.image || '/uploads/news/default.jpg',
      date: body.date || new Date().toISOString().split('T')[0],
      slug: generateSlug(body.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.news.push(newNews);
    writeDB(db);

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

