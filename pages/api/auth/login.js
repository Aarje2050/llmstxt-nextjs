// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/auth';
import { setCookie } from '../../../lib/cookies';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Set cookie with updated settings for cross-domain use
    setCookie(res, 'auth_token', token, {
      httpOnly: true,
      secure: true, // Always use secure cookies in production and development
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'none', // Important for cross-domain cookies
    });

    // Return user data (excluding password)
    const { password: _, ...userData } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}