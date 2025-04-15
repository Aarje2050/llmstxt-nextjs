// pages/api/auth/me.js
import { verifyToken } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from cookies
    const token = req.cookies.auth_token;
    
    // If no token, user is not authenticated
    if (!token) {
      return res.status(200).json({ user: null });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(200).json({ user: null });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ email: decoded.email });
    
    if (!user) {
      return res.status(200).json({ user: null });
    }

    // Return user data (excluding password)
    const { password, ...userData } = user;
    
    return res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(200).json({ user: null });
  }
}