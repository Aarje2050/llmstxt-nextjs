// components/Header.js - Optimized version
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import ClientOnly from './ClientOnly';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialView, setInitialView] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleOpenAuth = (view) => {
    setInitialView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            ImmortalSEO
          </Link>
          
          <div className="header-right">
            <ClientOnly>
              {isAuthenticated ? (
                <div className="user-profile">
                  <button 
                    className="user-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span>{user.name.split(' ')[0]}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-menu">
                      <Link href="/dashboard" className="user-menu-item">Dashboard</Link>
                      <Link href="/history" className="user-menu-item">History</Link>
                      <Link href="/settings" className="user-menu-item">Settings</Link>
                      <button 
                        className="user-menu-item logout-button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenAuth('login')}
                  >
                    Log In
                  </button>
                  <button 
                    className="btn btn-sm"
                    onClick={() => handleOpenAuth('register')}
                    style={{ backgroundColor: '#0171ce' }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialView={initialView}
      />
    </header>
  );
}

export default Header;