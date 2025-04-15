// components/auth/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      await login(email, password);
      onSuccess();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {formError && <div className="auth-error">{formError}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="Your email address"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          placeholder="Your password"
          required
        />
      </div>
      
      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;