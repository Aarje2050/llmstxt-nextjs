// pages/debug-auth.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function DebugAuth() {
  const { user, loading, isAuthenticated } = useAuth();
  const [backendResponse, setBackendResponse] = useState(null);
  const [cookies, setCookies] = useState({});
  const [testError, setTestError] = useState(null);

  useEffect(() => {
    // Get cookies
    const cookieStr = document.cookie;
    const cookieObj = cookieStr.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key) acc[key] = value;
      return acc;
    }, {});
    setCookies(cookieObj);

    // Test direct backend connection
    const testBackend = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://llmstxt-backend.onrender.com';
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true
        });
        setBackendResponse(response.data);
      } catch (err) {
        setTestError(err.message);
      }
    };

    testBackend();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication Debug</h1>
      
      <h2>Authentication Context</h2>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <p><strong>Is Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong></p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <h2>Browser Cookies</h2>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        <pre>{JSON.stringify(cookies, null, 2)}</pre>
      </div>

      <h2>Direct Backend Test</h2>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {testError ? (
          <p style={{ color: 'red' }}><strong>Error:</strong> {testError}</p>
        ) : (
          <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
        )}
      </div>

      <h2>Manual Tests</h2>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <button 
          onClick={async () => {
            try {
              const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://llmstxt-backend.onrender.com';
              const response = await axios.get(`${API_URL}/api/health`, {
                withCredentials: true
              });
              alert(`Health check: ${JSON.stringify(response.data)}`);
            } catch (err) {
              alert(`Error: ${err.message}`);
            }
          }}
          style={{ padding: '10px 15px', marginRight: '10px' }}
        >
          Test Backend Health
        </button>
      </div>
    </div>
  );
}