import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useD3 } from './useD3';

const TestD3Component = () => {
  const ref = useD3(svg => {
    svg.append('circle').attr('r', 40).attr('cx', 50).attr('cy', 50).attr('fill', 'blue');
  });

  return <svg ref={ref} data-testid="d3-svg" width={100} height={100} />;
};

describe('useD3 hook', () => {
  it('renders SVG content using D3', () => {
    render(<TestD3Component />);

    const svg = screen.getByTestId('d3-svg');

    const circle = svg.querySelector('circle');
    expect(circle).not.toBeNull();
    expect(circle?.getAttribute('r')).toBe('40');
    expect(circle?.getAttribute('fill')).toBe('blue');
  });

  it('clears previous SVG elements before re-rendering', () => {
    const renderFn = vi.fn(svg => {
      svg.append('text').text('Hello');
    });

    const TestComponent = () => {
      const ref = useD3(renderFn);
      return <svg ref={ref} data-testid="d3-svg" />;
    };

    const { rerender } = render(<TestComponent />);
    const svg = screen.getByTestId('d3-svg');

    expect(svg.querySelectorAll('text')).toHaveLength(1);
    rerender(<TestComponent />);
    expect(svg.querySelectorAll('text')).toHaveLength(1); // Still 1, means old one was cleared
    expect(renderFn).toHaveBeenCalledTimes(2);
  });
});
