import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import type { Zone } from '../../enums/ChartType';

type SpeedometerProps = {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  majorTicks?: number;
  zones?: Zone[];
  startAngle?: number;
  endAngle?: number;
};

export const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  min = 0,
  max = 100,
  width = 320,
  height = 180,
  majorTicks = 5,
  zones = [
    { from: 0, to: 30, color: '#4caf50' },
    { from: 30, to: 70, color: '#ffeb3b' },
    { from: 70, to: 100, color: '#f44336' },
  ],
  startAngle = -135,
  endAngle = 135,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    console.log('min:', min, 'max:', max, 'value:', value);

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height * 2) / 2 - 10;
    const centerX = width / 2;
    const centerY = height;

    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const angleScale = d3
      .scaleLinear()
      .domain([min, max])
      .range([toRadians(startAngle), toRadians(endAngle)]);

    const innerRadius = radius - 20;

    // Draw colored zones
    zones.forEach(zone => {
      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .startAngle(angleScale(zone.from))
        .endAngle(angleScale(zone.to));

      svg
        .append('path')
        .datum(null) // Explicitly set datum to null to match the expected type
        .attr('d', arc as unknown as string) // Cast arc to string to satisfy the type requirement
        .attr('fill', zone.color)
        .attr('transform', `translate(${centerX},${centerY})`);
    });

    // Draw ticks
    // const tickValues = d3.ticks(min, max, majorTicks);

    const interval = (max - min) / majorTicks;
    const tickValues = Array.from({ length: majorTicks + 1 }, (_, i) => min + i * interval);

    tickValues.forEach(tick => {
      const angle = angleScale(tick);
      const x1 = centerX + (innerRadius - 5) * Math.cos(angle);
      const y1 = centerY + (innerRadius - 5) * Math.sin(angle);
      const x2 = centerX + (radius + 5) * Math.cos(angle);
      const y2 = centerY + (radius + 5) * Math.sin(angle);

      svg
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

      const labelX = centerX + (radius + 18) * Math.cos(angle);
      const labelY = centerY + (radius + 18) * Math.sin(angle);

      svg
        .append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(Math.round(tick));
    });

    // Draw center pivot
    svg.append('circle').attr('cx', centerX).attr('cy', centerY).attr('r', 6).attr('fill', '#000');

    // Remove previous needle group
    svg.selectAll('.needle-group').remove();

    // Create needle group at center for rotation
    const needleGroup = svg
      .append('g')
      .attr('class', 'needle-group')
      .attr('transform', `rotate(${startAngle}, ${centerX}, ${centerY})`);

    // Needle length
    const needleLength = radius - 40;

    // Draw the needle initially pointing right (0°)
    needleGroup
      .append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', centerX + needleLength)
      .attr('y2', centerY)
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');

    // Center circle (pivot point)
    svg.append('circle').attr('cx', centerX).attr('cy', centerY).attr('r', 6).attr('fill', '#000');

    // Animate rotation
    const angleDeg = (angleScale(value) * 180) / Math.PI;

    needleGroup
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attrTween('transform', () => {
        const previousTransform = needleGroup.attr('transform');
        const prevAngleMatch = previousTransform?.match(/rotate\(([-\d.]+)/);
        const prevAngle = prevAngleMatch ? parseFloat(prevAngleMatch[1]) : startAngle;

        return d3.interpolateString(
          `rotate(${prevAngle}, ${centerX}, ${centerY})`,
          `rotate(${angleDeg}, ${centerX}, ${centerY})`,
        );
      });
  }, [value, min, max, width, height, majorTicks, zones, startAngle, endAngle]);

  return <svg ref={ref} width={width} height={height} />;
};
