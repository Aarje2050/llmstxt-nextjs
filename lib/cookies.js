// lib/cookies.js
import { serialize } from 'cookie';

// Set a cookie in the response
export function setCookie(res, name, value, options = {}) {
  // For cross-domain cookies, ensure SameSite is properly set
  if (options.secure && !options.sameSite) {
    options.sameSite = 'None';  // Note the capital N - this is important
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
    sameSite: 'None'  // Note the capital N
  });
  res.setHeader('Set-Cookie', cookie);
}