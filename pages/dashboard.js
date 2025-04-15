import React from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { user, loading } = useAuth();

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
                {/* We'll populate this with actual data in the future */}
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