import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./api/mocks/browser');
      return worker.start({ onUnhandledRequest: 'bypass' });
    } catch {
      console.info('[MSW] Uruchom: npx msw init public/ --save');
    }
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
