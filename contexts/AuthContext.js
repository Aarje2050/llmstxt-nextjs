// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        setLoading(true);
        // Get current authenticated user
        const { data } = await axios.get('/api/auth/me');
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error loading user', err);
        // User is not authenticated or there was an error
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromCookies();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/verify', { email, otp });
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        login, 
        register, 
        verifyOtp, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}