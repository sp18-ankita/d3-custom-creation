// src/App.tsx
import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { ChartProvider } from './hooks/useChartContext';

const App: React.FC = () => (
  <ChartProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ChartProvider>
);

export default App;
