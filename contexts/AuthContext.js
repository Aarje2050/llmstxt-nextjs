// contexts/AuthContext.js (complete updated version)
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Base URL for your backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://llmstxt-backend.onrender.com';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Create axios instance with credentials
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
  });

  // Check authentication on EVERY page change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/auth/me');
        
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router.pathname]); // Re-check auth on every route change

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Direct call to backend
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // Update user immediately
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
      // Direct call to backend
      const { data } = await api.post('/api/auth/register', { name, email, password });
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
      // Direct call to backend
      const { data } = await api.post('/api/auth/verify', { email, otp });
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
      // Direct call to backend
      await api.post('/api/auth/logout');
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
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