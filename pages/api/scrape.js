// This file replaces the external API call to your Flask backend
// You can either proxy the request to your Flask backend or implement the logic here

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
      const { urls, bulkMode } = req.body;
      
      // Option 1: Proxy to your existing Flask backend
      const response = await fetch('https://llmstxt-backend.onrender.com/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls, bulkMode }),
      });
      
      const data = await response.json();
      return res.status(200).json(data);
      
      // Option 2: Implement the logic directly in Node.js
      // This would require porting your Python code to JavaScript
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ error: 'Failed to process request' });
    }
  }