import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { GlobalTimeProvider } from './context/GlobalTimeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <GlobalTimeProvider>
        <App />
      </GlobalTimeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
