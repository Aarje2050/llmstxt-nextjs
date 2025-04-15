// lib/cookies.js
import { serialize } from 'cookie';

// Set a cookie in the response
export function setCookie(res, name, value, options = {}) {
  const cookie = serialize(name, value, options);
  res.setHeader('Set-Cookie', cookie);
}

// Remove a cookie
export function removeCookie(res, name) {
  const cookie = serialize(name, '', {
    maxAge: -1,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
}