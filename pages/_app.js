import { AuthProvider } from '../contexts/AuthContext';
import '../styles/auth.css';
import '../styles/TokenAnalytics.css';
import '../styles/main.css';
import '../components/TokenCounter.css';

// Other global styles...


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;