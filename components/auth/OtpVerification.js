// components/auth/OtpVerification.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OtpVerification = ({ email, onSuccess, onResend }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second countdown for resend
  
  const inputRefs = useRef([]);
  const { verifyOtp } = useAuth();
  
  // Setup countdown timer for resend button
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^[0-9]*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-advance to next input if current one is filled
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    // Validate OTP is complete
    if (otpString.length !== 6) {
      setFormError('Please enter all 6 digits');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      await verifyOtp(email, otpString);
      onSuccess();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResend = () => {
    onResend();
    setTimeLeft(30); // Reset countdown
  };

  return (
    <div className="otp-verification">
      <p className="otp-instructions">
        We've sent a verification code to <strong>{email}</strong>. 
        Please enter the 6-digit code below.
      </p>
      
      {formError && <div className="auth-error">{formError}</div>}
      
      <form onSubmit={handleSubmit} onPaste={handlePaste}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isSubmitting}
              className="otp-input"
              required
            />
          ))}
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
      
      <div className="resend-otp">
        <p>Didn't receive the code?</p>
        {timeLeft > 0 ? (
          <div className="resend-timer">
            You can resend in {timeLeft} seconds
          </div>
        ) : (
          <button 
            onClick={handleResend} 
            className="resend-btn"
          >
            Resend verification code
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;