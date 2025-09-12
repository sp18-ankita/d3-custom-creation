import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PieChart } from './Piechart';

describe('PieChart', () => {
  const mockData = [
    { label: 'Apple', value: 30 },
    { label: 'Banana', value: 70 },
    { label: 'Cherry', value: 45 },
  ];

  it('renders an SVG with path elements for each data point', () => {
    const { container } = render(<PieChart data={mockData} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(mockData.length);

    paths.forEach(path => {
      expect(path.getAttribute('fill')).toBeTruthy();
      expect(path.getAttribute('d')).toMatch(/^M/);
    });
  });
});
