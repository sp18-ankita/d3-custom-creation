import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppRoutes from './AppRoutes';
import { ChartProvider } from './hooks/useChartContext'; // <-- import provider

describe('AppRoutes Routing', () => {
  const renderWithRoute = (initialRoute: string) => {
    const history = createMemoryHistory({ initialEntries: [initialRoute] });

    render(
      <ChartProvider>
        <Router location={history.location} navigator={history}>
          <AppRoutes />
        </Router>
      </ChartProvider>,
    );
  };

  it('renders AppContent on root route "/"', () => {
    renderWithRoute('/');
    expect(screen.getByText(/D3 Chart Viewer/i)).toBeInTheDocument();
  });

  it('renders About page on "/about"', () => {
    renderWithRoute('/about');
    expect(screen.getByText(/About D3 Chart Viewer/i)).toBeInTheDocument();
  });

  it('renders 404 on unknown route', () => {
    renderWithRoute('/does-not-exist');
    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
  });

  it('does not show 404 on valid route "/"', () => {
    renderWithRoute('/');
    expect(screen.queryByText(/404 - Page Not Found/i)).not.toBeInTheDocument();
  });
});
