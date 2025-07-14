import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LineChart } from './Linechart';

describe('LineChart', () => {
  const mockData = [
    { label: 'Jan', value: 10 },
    { label: 'Feb', value: 20 },
    { label: 'Mar', value: 15 },
  ];

  it('renders an SVG with a single path element', () => {
    const { container } = render(<LineChart data={mockData} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const path = container.querySelector('path');
    expect(path).toBeTruthy();

    expect(path?.getAttribute('fill')).toBe('none');
    expect(path?.getAttribute('stroke')).toBe('#59a14f');
    expect(path?.getAttribute('stroke-width')).toBe('2');
    expect(path?.getAttribute('d')).toMatch(/^M/);
  });
});
