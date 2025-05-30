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
  startAngle?: number; // degrees
  endAngle?: number; // degrees
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
      const arcPath = d3.arc<d3.DefaultArcObject>().innerRadius(innerRadius).outerRadius(radius)({
        startAngle: angleScale(zone.from),
        endAngle: angleScale(zone.to),
        innerRadius,
        outerRadius: radius,
      });

      svg
        .append('path')
        .attr('d', arcPath!)
        .attr('fill', zone.color)
        .attr('transform', `translate(${centerX},${centerY})`);
    });

    // Calculate ticks
    const validMajorTicks = Number(majorTicks);
    if (isNaN(validMajorTicks) || validMajorTicks <= 0) {
      return;
    }

    const tickValues = d3
      .range(0, validMajorTicks + 1)
      .map(i => min + (i * (max - min)) / validMajorTicks);

    // Draw ticks and labels
    tickValues.forEach(tick => {
      const angle = angleScale(tick);

      const innerTickRadius = innerRadius - 5;
      const outerTickRadius = radius + 2;

      const x1 = centerX + innerTickRadius * Math.cos(angle);
      const y1 = centerY + innerTickRadius * Math.sin(angle);
      const x2 = centerX + outerTickRadius * Math.cos(angle);
      const y2 = centerY + outerTickRadius * Math.sin(angle);

      svg
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

      const labelRadius = radius + 18;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);

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

    // Draw needle
    const needleGroup = svg.append('g');
    const needleLength = radius - 40;

    needleGroup
      .append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', centerX + needleLength)
      .attr('y2', centerY)
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round');

    const angleDeg = (angleScale(value) * 180) / Math.PI;
    const prevTransform = needleGroup.attr('transform');
    const prevAngleMatch = prevTransform?.match(/rotate\(([-\d.]+)/);
    const prevAngle = prevAngleMatch ? parseFloat(prevAngleMatch[1]) : startAngle;

    needleGroup
      .attr('transform', `rotate(${prevAngle},${centerX},${centerY})`)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attrTween('transform', () =>
        d3.interpolateString(
          `rotate(${prevAngle},${centerX},${centerY})`,
          `rotate(${angleDeg},${centerX},${centerY})`,
        ),
      );
  }, [value, min, max, width, height, majorTicks, zones, startAngle, endAngle]);

  return <svg ref={ref} width={width} height={height} />;
};
