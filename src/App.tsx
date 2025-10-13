// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ChartProvider } from './hooks/useChartContext';

const App: React.FC = () => (
  <ErrorBoundary>
    <ChartProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ChartProvider>
  </ErrorBoundary>
);

export default App;
