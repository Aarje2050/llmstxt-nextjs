// pages/index.js - Optimized version
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UrlInput from '../components/UrlInput';
import FilePreview from '../components/FilePreview';
import AuthModal from '../components/auth/AuthModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeUrl, setActiveUrl] = useState(null);
  const [activeMdFile, setActiveMdFile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  // Check for login query parameters from middleware redirects
  useEffect(() => {
    if (router.query.login === 'required') {
      toast.info('Please log in to access this feature');
      setIsAuthModalOpen(true);
    } else if (router.query.login === 'expired') {
      toast.info('Your session has expired. Please log in again');
      setIsAuthModalOpen(true);
    }
    
    // Clean up the URL if it has the login parameter
    if (router.query.login) {
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.query, router]);
  
  const handleScrape = async (urls, bulkMode = false) => {
    setLoading(true);
    try {
      // Show initial toast
      const toastId = toast.info('Extracting website content. This may take a moment...', { autoClose: false });
      
      // Make direct API call to backend
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://llmstxt-backend.onrender.com';
      
      const response = await axios.post(`${BACKEND_URL}/api/scrape`, 
        { urls, bulkMode }, 
        {
          timeout: 120000,  // 2 minute timeout
          withCredentials: true  // Include cookies
        }
      );
      
      // Update toast
      toast.dismiss(toastId);
      toast.success('Content extracted successfully!');
      
      // Process the results
      setResults(response.data);
      
      // Set the first URL as active
      if (Object.keys(response.data).length > 0) {
        const firstUrl = Object.keys(response.data)[0];
        setActiveUrl(firstUrl);
        
        // If there are MD files for this URL, set the first one as active
        const urlData = response.data[firstUrl];
        if (urlData.status === 'success' && urlData.md_files) {
          const mdUrls = Object.keys(urlData.md_files);
          if (mdUrls.length > 0) {
            setActiveMdFile(mdUrls[0]);
          }
        }
      }
      
      // Track usage if authenticated
      if (isAuthenticated) {
        await axios.post(`${BACKEND_URL}/api/usage/track`, {
          type: 'generation',
          urls
        }, {
          withCredentials: true
        });
      }
      
    } catch (error) {
      let errorMessage = 'Failed to extract content.';
      
      if (error.response) {
        errorMessage += ` Server error: ${error.response.status}`;
        if (error.response.data && error.response.data.error) {
          errorMessage += ` - ${error.response.data.error}`;
        }
      } else if (error.request) {
        errorMessage += ' No response from server. Please check if the backend is running.';
      } else {
        errorMessage += ` Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateLlmsTxt = (url, content) => {
    setResults(prev => ({
      ...prev,
      [url]: {
        ...prev[url],
        llms_txt: content
      }
    }));
    toast.success('LLMs.txt content updated');
  };
  
  const handleUpdateMdFile = (url, fileUrl, content) => {
    setResults(prev => ({
      ...prev,
      [url]: {
        ...prev[url],
        md_files: {
          ...prev[url].md_files,
          [fileUrl]: {
            ...prev[url].md_files[fileUrl],
            content: content
          }
        }
      }
    }));
    toast.success('Markdown file content updated');
  };

  return (
    <>
      <Head>
        <title>LLMs.txt Generator | Optimize Your Website for AI Search Engines</title>
        <meta name="description" content="Generate AI-friendly LLMs.txt files to make your website content discoverable by ChatGPT, Claude, and other AI search tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <div className="app">
        <Header />
        
        <main className="main-content">
          <div className="container">
            <UrlInput onScrape={handleScrape} loading={loading} />
            
            {loading && (
              <div className="loader">
                <div className="loader-spinner"></div>
                <p>Extracting content from website. This may take a moment...</p>
              </div>
            )}
            
            {results && activeUrl && !loading && (
              <FilePreview 
                results={results} 
                activeUrl={activeUrl}
                activeMdFile={activeMdFile}
                onUrlChange={setActiveUrl}
                onMdFileChange={setActiveMdFile}
                onUpdateLlmsTxt={handleUpdateLlmsTxt}
                onUpdateMdFile={handleUpdateMdFile}
              />
            )}
          </div>
        </main>
        
        <Footer />
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
}

export default Home;