import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChartProvider } from './hooks/useChartContext.ts';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChartProvider>
      <App />
    </ChartProvider>
  </StrictMode>,
);
