import React from 'react';

import ReactDOM from 'react-dom/client';

import { App } from '@/App';
import '@/index.css';

if (import.meta.env.MODE === 'development') {
  (async () => {
    const { worker } = await import('@/mocks/browser');
    worker.start({
      onUnhandledRequest(req) {
        console.warn(
          'Found an unhandled %s request to %s',
          req.method,
          req.url.href,
        );
      },
    });
  })();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
