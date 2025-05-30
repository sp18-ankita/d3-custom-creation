import React from 'react';
import type { ChartType } from '../enums/ChartType';
import { BarChart } from './charts/Barchart';
import { LineChart } from './charts/Linechart';
import { PieChart } from './charts/Piechart';
import { Speedometer } from './charts/Speedometer';

interface ChartRendererProps {
  type: ChartType;
  data: { label: string; value: number }[];
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data }) => {
  switch (type) {
    case 'bar':
      return <BarChart data={data} />;
    case 'line':
      return <LineChart data={data} />;
    case 'pie':
      return <PieChart data={data} />;
    case 'speedometer':
      return (
        <Speedometer value={70} min={0} max={100} startAngle={-90} endAngle={90} width={500} />
      );
    default:
      return <p>Unsupported chart type</p>;
  }
};
