// pages/api/auth/register.js
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db';
import { sendOtpEmail } from '../../../lib/email'; // You'll need to create this

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP (6-digit code)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store user with pending verification
    await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      verified: false,
      createdAt: new Date(),
      usageCount: 0,
      plan: 'free'
    });


    // In a production environment, send email with OTP
    // await sendOtpEmail(email, otp, name);
    try {
        await sendOtpEmail(email, otp, name);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Still return success, but note email might not have been sent
        return res.status(200).json({
          message: 'Registration successful, but verification email may be delayed. Please check your spam folder or try again.',
          email
        });
      }
      
      // Return success
      return res.status(200).json({
        message: 'Registration successful! Please check your email for a verification code.',
        email
      });

    // console.log('User registered successfully:', email);
    // console.log('*** OTP FOR TESTING ***:', otp); // For development only

    // Return success
    return res.status(200).json({
      message: 'Registration successful! For testing, your OTP is: ' + otp
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
}
