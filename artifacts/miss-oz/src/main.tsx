import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';
import './styles/postcard-mobile.css';
import './styles/home-mobile.css';
import './styles/forms-mobile.css';
import './styles/interactions-mobile.css';
import './styles/background-flat.css';
import './styles/hero-tidy.css';

// Preview switch for Millie's two homepage text options. ?hero=b shows B.
try {
  const hero = new URLSearchParams(window.location.search).get('hero');
  if (hero === 'a' || hero === 'b') document.documentElement.dataset.hero = hero;
} catch {
  // Option A stays.
}

createRoot(document.getElementById('root')!).render(<App />);
