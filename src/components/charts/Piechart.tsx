import * as d3 from 'd3';
import type { DataPoint, PieData } from '../../enums/ChartType';
import { useD3 } from '../../hooks/useD3';

export const PieChart = ({ data }: { data: DataPoint[] }) => {
  const ref = useD3(svg => {
    const width = 400,
      height = 300,
      radius = Math.min(width, height) / 2;
    const pie = d3.pie<DataPoint>().value(d => d.value)(data);
    const arc = d3.arc<d3.PieArcDatum<PieData>>().innerRadius(0).outerRadius(radius);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);
    g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => d3.schemeCategory10[i % 10]);

    g.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .text(d => d.data.label);
  });

  return <svg ref={ref} width={400} height={300}></svg>;
};
