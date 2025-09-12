import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartWrapper } from './chatWrapper';

describe('ChartWrapper', () => {
  it('renders an SVG with default width and height', () => {
    render(
      <ChartWrapper>
        <circle data-testid="child" cx="50" cy="50" r="40" />
      </ChartWrapper>,
    );

    const svg = screen.getByTestId('chart-wrapper');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('400');
    expect(svg?.getAttribute('height')).toBe('300');
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('renders an SVG with custom width and height', () => {
    render(
      <ChartWrapper width={800} height={600}>
        <rect data-testid="child" x="0" y="0" width="100" height="50" />
      </ChartWrapper>,
    );

    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('800');
    expect(svg?.getAttribute('height')).toBe('600');
    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
