// middleware.js (root level, not in a folder)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/history'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL('/', request.url);
    url.searchParams.set('login', 'required');
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Define on which paths the middleware will be executed
export const config = {
  matcher: ['/dashboard', '/settings', '/history', '/dashboard/:path*', '/settings/:path*', '/history/:path*'],
};