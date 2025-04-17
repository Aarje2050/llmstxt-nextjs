// components/auth/AuthModal.js - Optimized version
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerification from './OtpVerification';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [closing, setClosing] = useState(false);

  // Update view if initialView changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Handle smooth closing animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const handleRegisterSuccess = (userEmail) => {
    setEmail(userEmail);
    setView('verify');
  };

  const handleLoginSuccess = () => {
    handleClose();
  };

  const handleVerificationSuccess = () => {
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`auth-modal-overlay ${closing ? 'closing' : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className={`auth-modal ${closing ? 'closing' : ''}`}>
        <button className="close-button" onClick={handleClose}>×</button>
        
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