// lib/cookies.js
import { serialize } from 'cookie';

// Set a cookie in the response
export function setCookie(res, name, value, options = {}) {
  // Ensure sameSite is set to 'none' for cross-domain requests
  if (options.secure && !options.sameSite) {
    options.sameSite = 'none';
  }
  
  const cookie = serialize(name, value, options);
  res.setHeader('Set-Cookie', cookie);
}

// Remove a cookie
export function removeCookie(res, name) {
  const cookie = serialize(name, '', {
    maxAge: -1,
    path: '/',
    secure: true,
    sameSite: 'none'
  });
  res.setHeader('Set-Cookie', cookie);
}