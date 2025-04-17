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
      credentials: 'include' // Important: include credentials in the request
    });

    // Get the data from the response
    const data = await response.json();
    
    // Check if there's a Set-Cookie header in the response
    const cookies = response.headers.get('set-cookie');
    
    if (cookies) {
      // Forward the cookie to the client
      res.setHeader('Set-Cookie', cookies);
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
}