// pages/api/auth/verify.js
import { generateToken } from '../../../lib/auth';
import { setCookie } from '../../../lib/cookies';
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Verification request received:', req.body);
    const { email, otp } = req.body;

    // Basic validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Find user with OTP
    const user = await db.collection('users').findOne({ 
      email,
      otp
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ message: 'Verification code expired' });
    }

    // Mark user as verified and remove OTP fields
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { verified: true },
        $unset: { otp: "", otpExpiry: "" }
      }
    );

    // Generate token
    const token = generateToken(user);

    // Set cookie
    setCookie(res, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Return user data (excluding password)
    const { password, ...userData } = user;

    return res.status(200).json({
      message: 'Email verification successful',
      user: userData
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}