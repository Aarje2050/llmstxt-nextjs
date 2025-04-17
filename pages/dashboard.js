// pages/dashboard.js - Optimized version
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated after loading completes
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/?login=required');
    }
  }, [loading, isAuthenticated, router]);

  // Show skeleton loader while loading
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | LLMs.txt Generator</title>
        <meta name="description" content="Manage your LLMs.txt Generator account and view your usage statistics." />
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