// charts/BarChart.tsx
import * as d3 from 'd3';
import { useD3 } from '../../hooks/useD3';

export const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const ref = useD3(
    svg => {
      const width = 400,
        height = 300;
      const x = d3
        .scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.2);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)!])
        .range([height, 0]);

      svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.label)!)
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', '#4e79a7');
    },
    [data],
  );

  return <svg ref={ref} width={400} height={300}></svg>;
};
