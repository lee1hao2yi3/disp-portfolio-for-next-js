import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasCookie = request.cookies.has('gallery-unlocked');
  const { pathname } = request.nextUrl;

  // If the user tries to access the gallery and doesn't have the cookie,
  // show them the password entry page instead.
  if (pathname.startsWith('/gallery') && !hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/enter-password';
    return NextResponse.rewrite(url);
  }

  // Otherwise, let them proceed
  return NextResponse.next();
}

// This specifies which paths the middleware should run on.
export const config = {
  matcher: '/gallery/:path*',
};