// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
  // Protected routes
  const protectedPaths = ['/dashboard', '/settings', '/history'];
  const path = request.nextUrl.pathname;
  
  if (protectedPaths.some(route => path.startsWith(route))) {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/?login=required', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/history/:path*'],
};