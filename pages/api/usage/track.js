// pages/api/usage/track.js
import { verifyToken } from '../../../lib/auth';
import { connectToDatabase, toObjectId } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the token from cookies
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Find the user
    const user = await db.collection('users').findOne({ email: decoded.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get details from the request
    const { type, urls } = req.body;
    
    // Check usage limits for free tier
    if (user.plan === 'free') {
      // Count the current day's usage
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dailyUsageCount = await db.collection('usage').countDocuments({
        userId: user._id,
        createdAt: { $gte: today }
      });
      
      // Free tier limit: 5 generations per day
      const FREE_DAILY_LIMIT = 5;
      
      if (dailyUsageCount >= FREE_DAILY_LIMIT) {
        return res.status(403).json({ 
          message: 'Daily usage limit reached for free tier',
          limit: FREE_DAILY_LIMIT,
          usage: dailyUsageCount
        });
      }
    }
    
    // Record the usage
    await db.collection('usage').insertOne({
      userId: user._id,
      type,
      urls,
      createdAt: new Date()
    });
    
    // Update user's usage count
    await db.collection('users').updateOne(
      { _id: user._id },
      { $inc: { usageCount: 1 } }
    );
    
    return res.status(200).json({ message: 'Usage tracked successfully' });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}