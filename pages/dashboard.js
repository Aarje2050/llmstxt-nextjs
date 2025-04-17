// pages/dashboard.js
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="loader">
              <div className="loader-spinner"></div>
              <p>Loading your dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't show the dashboard if not authenticated
  if (!isAuthenticated) {
    return null; // This will show nothing briefly before the redirect happens
  }

  return (
    <>
      <Head>
        <title>Dashboard | LLMs.txt Generator</title>
      </Head>
      
      <div className="app">
        <Header />
        
        <main className="main-content">
          <div className="container">
            <div className="dashboard-header">
              <h1>Welcome, {user?.name}</h1>
              <p>Your LLMs.txt Generator Dashboard</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-title">Your Plan</div>
                <div className="stat-value">{user?.plan || 'Free'}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Generations</div>
                <div className="stat-value">{user?.usageCount || 0}</div>
              </div>
            </div>
            
            <div className="dashboard-content">
              <div className="dashboard-section">
                <h2>Recent Activity</h2>
                <p className="empty-state">Your recent activity will appear here.</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}