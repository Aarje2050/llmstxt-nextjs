// middleware.js (root level, not in a folder)
import { NextResponse } from 'next/server';

// middleware.js (simplified - no longer needed for authentication)
export function middleware(request) {
  // Just return next() - we'll handle auth in each protected page
  return NextResponse.next();
}

// We still need this for the matcher config
export const config = {
  matcher: ['/dashboard', '/settings', '/history', '/dashboard/:path*', '/settings/:path*', '/history/:path*'],
};