// components/skeletons/DashboardSkeleton.js
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function DashboardSkeleton() {
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="dashboard-header">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-subtitle"></div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card skeleton-card">
              <div className="skeleton-text skeleton-small"></div>
              <div className="skeleton-text skeleton-medium"></div>
            </div>
            
            <div className="stat-card skeleton-card">
              <div className="skeleton-text skeleton-small"></div>
              <div className="skeleton-text skeleton-medium"></div>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="dashboard-section">
              <div className="skeleton-text skeleton-subtitle"></div>
              
              <div className="skeleton-list">
                <div className="skeleton-list-item"></div>
                <div className="skeleton-list-item"></div>
                <div className="skeleton-list-item"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}