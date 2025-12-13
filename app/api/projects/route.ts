import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, generateId, Project } from '@/lib/db';

// GET all projects
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDB();

    const newProject: Project = {
      id: generateId(),
      title: body.title,
      description: body.description,
      category: body.category,
      image: body.image || '/uploads/projects/default.jpg',
      location: body.location,
      year: body.year,
      details: body.details || '',
      gallery: body.gallery || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.projects.push(newProject);
    writeDB(db);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

