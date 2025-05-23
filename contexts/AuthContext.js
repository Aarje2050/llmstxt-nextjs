// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Base URL for your Python backend
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://llmstxt-backend.onrender.com';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios with credentials
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
  });

  // Check if user is already authenticated on app load
  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        setLoading(true);
        // Get current authenticated user from backend
        const { data } = await api.get('/api/auth/me');
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
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

// In contexts/AuthContext.js - update the register function
const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/api/auth/register', { name, email, password });
      
      // If we got a response but there was a MongoDB error, show the OTP anyway
      // This is for development/testing when the in-memory DB fallback is active
      console.log("Registration response:", data);
      
      return data;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || 'Registration failed. Database connection issue.');
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
      await api.post('/api/auth/logout');
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