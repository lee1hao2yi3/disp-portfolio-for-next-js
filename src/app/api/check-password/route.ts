import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  // Check if the password from the form matches the one in your .env.local file
  if (password === process.env.GALLERY_PASSWORD) {
    const response = NextResponse.json({ success: true });

    // Set a cookie that expires in 1 day
    response.cookies.set('gallery-unlocked', 'true', {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      path: '/',
      maxAge: 86400, // 60 * 60 * 24 seconds
    });

    return response;
  }

  // If the password is wrong, return an error
  return NextResponse.json({ success: false }, { status: 401 });
}