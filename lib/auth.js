// lib/auth.js
import jwt from 'jsonwebtoken';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-for-development';

// Generate a JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      plan: user.plan || 'free'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}