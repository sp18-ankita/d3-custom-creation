import AppContent from './AppContent';
import { ChartProvider } from './hooks/useChartContext';

export const App: React.FC = () => (
  <ChartProvider>
    <AppContent />
  </ChartProvider>
);

export default App;
