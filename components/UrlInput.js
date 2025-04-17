// components/UrlInput.js - Optimized version
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

function UrlInput({ onScrape, loading }) {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');
  const [urlMode, setUrlMode] = useState('single'); // 'single' or 'bulk'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Remove any error message
    setError('');
    
    // Process URLs based on mode
    let urls = [];
    const bulkMode = urlMode === 'bulk'; // Flag to send to backend
    
    if (urlMode === 'single') {
      const url = urlInput.trim();
      
      if (!url) {
        setError('Please enter a URL');
        return;
      }
      
      // Add scheme if missing
      let processedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        processedUrl = 'https://' + url;
      }
      
      // Basic validation
      try {
        new URL(processedUrl);
        urls = [processedUrl];
      } catch (_) {
        setError('Please enter a valid URL (e.g., example.com or https://example.com)');
        return;
      }
    } else {
      // Bulk mode - reserved for future implementation
      urls = urlInput
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== '')
        .map(url => !url.startsWith('http://') && !url.startsWith('https://') ? 'https://' + url : url);
      
      if (urls.length === 0) {
        setError('Please enter at least one URL');
        return;
      }
      
      try {
        urls.forEach(url => new URL(url));
      } catch (_) {
        setError('One or more URLs are invalid. Please check and try again.');
        return;
      }
    }
    
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      // Open the auth modal instead of proceeding
      setIsAuthModalOpen(true);
      return;
    }
    
    // If authenticated, proceed with scraping
    onScrape(urls, bulkMode);
  };
  
  const toggleUrlMode = (mode) => {
    // Only allow switching to single mode for now
    if (mode === 'single') {
      setUrlMode(mode);
    }
  };

  return (
    <div className="url-input-container">
      <h2>Generate Optimized LLMs.txt & Markdown Files for AI Search Engines</h2>
      <p>Input a Website URL to Automatically Generate AI-Ready LLMs.txt and Markdown (.md) Files with Relevant Site Content for Enhanced SEO Performance.</p>
      
      <div className="toggle-container">
        <div 
          className={`toggle-option ${urlMode === 'single' ? 'active' : ''}`}
          onClick={() => toggleUrlMode('single')}
        >
          Single URL
        </div>
        <div 
          className="toggle-option disabled"
          title="Bulk URL processing coming soon"
        >
          Bulk URLs
          <span className="coming-soon-badge">COMING SOON</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="url-input">
            {urlMode === 'single' ? 'Website URL:' : 'Website URLs (one per line):'}
          </label>
          {urlMode === 'single' ? (
            <input
              type="text"
              id="url-input"
              placeholder="example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={loading}
              required
            />
          ) : (
            <textarea 
              id="url-input"
              rows="5"
              placeholder="example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={true}
              required
            />
          )}
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className={`btn ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
          style={{ backgroundColor: loading ? '#75a7e5' : '#0171ce' }}
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Processing...
            </>
          ) : (
            'Generate Files'
          )}
        </button>
      </form>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

export default UrlInput;