// charts/LineChart.tsx
import * as d3 from 'd3';
import type { DataPoint } from '../../enums/ChartType';
import { useD3 } from '../../hooks/useD3';

export const LineChart = ({ data }: { data: DataPoint[] }) => {
  const ref = useD3(svg => {
    const width = 400,
      height = 300;
    const x = d3
      .scalePoint()
      .domain(data.map(d => d.label))
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)!])
      .range([height, 0]);

    const line = d3
      .line<DataPoint>()
      .x(d => x(d.label)!)
      .y(d => y(d.value));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#59a14f')
      .attr('stroke-width', 2)
      .attr('d', line);
  });

  return <svg ref={ref} width={400} height={300}></svg>;
};
