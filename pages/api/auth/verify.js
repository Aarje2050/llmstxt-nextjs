// pages/api/auth/verify.js
import { generateToken } from '../../../lib/auth';
import { setCookie } from '../../../lib/cookies';
import { connectToDatabase } from '../../../lib/db';


// pages/api/auth/verify.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
  }
  