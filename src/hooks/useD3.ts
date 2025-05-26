import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export const useD3 = (
  renderFn: (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => void,
  deps: unknown[],
) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    renderFn(svg);
  }, [renderFn, ...deps]);

  return ref;
};
