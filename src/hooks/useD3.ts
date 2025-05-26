import * as d3 from 'd3';
import { useEffect, useRef, type DependencyList } from 'react';

export const useD3 = (
  renderFn: (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => void,
  deps: DependencyList,
) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    renderFn(svg);
  }, deps);

  return ref;
};
