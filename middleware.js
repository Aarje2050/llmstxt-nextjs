// pages/_middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.auth_token;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/history'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', 'required');
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}