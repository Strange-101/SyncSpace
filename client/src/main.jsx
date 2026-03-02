import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import "@excalidraw/excalidraw/index.css";
import App from './App.jsx'

// Initialize dark mode from localStorage before React renders (prevents flash)
if (localStorage.getItem('syncspace_theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)

