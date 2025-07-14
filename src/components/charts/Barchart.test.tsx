import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from './Barchart';

describe('BarChart', () => {
  const mockData = [
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 30 },
  ];

  it('renders an SVG with bars for each data point', () => {
    const { container } = render(<BarChart data={mockData} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(mockData.length);
  });
});
