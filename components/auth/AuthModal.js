// components/auth/AuthModal.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerification from './OtpVerification';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');

  // Update view if initialView changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  if (!isOpen) return null;

  const handleRegisterSuccess = (userEmail) => {
    setEmail(userEmail);
    setView('verify');
  };

  const handleLoginSuccess = () => {
    onClose();
  };

  const handleVerificationSuccess = () => {
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          {view === 'login' && (
            <>
              <h2>Welcome back</h2>
              <p>Sign in to your account</p>
            </>
          )}
          {view === 'register' && (
            <>
              <h2>Create an account</h2>
              <p>Join LLMs.txt Generator today</p>
            </>
          )}
          {view === 'verify' && (
            <>
              <h2>Verify your email</h2>
              <p>Enter the code we sent to your email</p>
            </>
          )}
        </div>
        
        <div className="auth-modal-content">
          {view === 'login' && (
            <>
              <LoginForm onSuccess={handleLoginSuccess} />
              <p className="auth-switch-text">
                Don't have an account?
                <button 
                  className="auth-switch-btn" 
                  onClick={() => setView('register')}
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          
          {view === 'register' && (
            <>
              <RegisterForm onSuccess={handleRegisterSuccess} />
              <p className="auth-switch-text">
                Already have an account?
                <button 
                  className="auth-switch-btn" 
                  onClick={() => setView('login')}
                >
                  Sign in
                </button>
              </p>
            </>
          )}
          
          {view === 'verify' && (
            <OtpVerification 
              email={email} 
              onSuccess={handleVerificationSuccess} 
              onResend={() => console.log('Resending OTP to', email)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;