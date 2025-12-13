import { NextRequest, NextResponse } from 'next/server';

// Simple auth - in production use proper auth like NextAuth
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ozpolat2024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      // Create a simple token (in production use JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });

      // Set HTTP-only cookie
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid password' 
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}

// Check auth status
export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  
  if (token) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

