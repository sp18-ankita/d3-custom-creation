// src/App.tsx
import * as Sentry from '@sentry/react';
import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ChartProvider } from './hooks/useChartContext';

const App: React.FC = () => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <button onClick={resetError}>Try Again</button>
      </div>
    )}
    showDialog
  >
    <ChartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChartProvider>
  </Sentry.ErrorBoundary>
);

export default App;
