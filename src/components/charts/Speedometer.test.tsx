import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Speedometer } from './Speedometer';

describe('Speedometer', () => {
  const zones = [
    { from: 0, to: 30, color: 'green' },
    { from: 30, to: 70, color: 'yellow' },
    { from: 70, to: 100, color: 'red' },
  ];

  it('renders svg and expected number of zone paths', () => {
    const { container } = render(<Speedometer value={50} zones={zones} majorTicks={5} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    const paths = container.querySelectorAll('path');
    // Should match number of zones
    expect(paths.length).toBe(zones.length);
  });

  it('renders correct number of tick lines and labels', () => {
    const majorTicks = 4;
    const expectedTicks = majorTicks + 1;

    const { container } = render(<Speedometer value={50} zones={zones} majorTicks={majorTicks} />);

    const lines = container.querySelectorAll('line');
    const tickLines = [...lines].filter(line => line.getAttribute('stroke') === '#333');
    const needleLines = [...lines].filter(line => line.getAttribute('stroke') === 'black');

    expect(tickLines.length).toBe(expectedTicks);
    expect(needleLines.length).toBe(1);

    const labels = container.querySelectorAll('text');
    expect(labels.length).toBe(expectedTicks);
  });

  it('renders needle and center pivot circle', () => {
    const { container } = render(<Speedometer value={70} />);

    const needle = container.querySelector('line');
    const pivot = container.querySelector('circle');

    expect(needle).toBeTruthy();
    expect(pivot).toBeTruthy();
    expect(pivot?.getAttribute('r')).toBe('6');
  });
});
