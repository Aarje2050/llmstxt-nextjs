import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UrlInput from '../components/UrlInput';
import FilePreview from '../components/FilePreview';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApplicationSchema } from '../utils/StructuredData.js';



export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeUrl, setActiveUrl] = useState(null);


    // Add this function to handle updating LLMs.txt content
    const handleUpdateLlmsTxt = (url, content) => {
        setResults(prev => ({
          ...prev,
          [url]: {
            ...prev[url],
            llms_txt: content
          }
        }));
        // You could add a toast notification here if you want
        // toast.success('LLMs.txt content updated');
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
        // toast.success('Markdown file content updated');
      };
  
  async function handleScrape(urls, bulkMode = false) {
    setLoading(true);
    try {
      // Make API call to your endpoint
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls, bulkMode }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the results
      setResults(data);
      
      // Set the first URL as active
      if (Object.keys(data).length > 0) {
        const firstUrl = Object.keys(data)[0];
        setActiveUrl(firstUrl);
      }
    } catch (error) {
      console.error('Error scraping URLs:', error);
      alert(`Failed to extract content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
  <title>LLMs.txt Generator | Optimize Your Website for AI Search Engines</title>
  <meta name="description" content="Generate AI-friendly LLMs.txt files to make your website content discoverable by ChatGPT, Claude, and other AI search tools." />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(getApplicationSchema())
    }}
  />
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
                //   activeMdFile={activeMdFile}
                  onUrlChange={setActiveUrl}
                //   onMdFileChange={setActiveMdFile}
                  onUpdateLlmsTxt={handleUpdateLlmsTxt}
                //   onUpdateMdFile={handleUpdateMdFile}
                />
              )}
          
          </div>
        </main>
        
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
}