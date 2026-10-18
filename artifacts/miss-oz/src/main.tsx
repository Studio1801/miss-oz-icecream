import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';
import './styles/postcard-mobile.css';
import './styles/home-mobile.css';
import './styles/forms-mobile.css';
import './styles/interactions-mobile.css';

createRoot(document.getElementById('root')!).render(<App />);
