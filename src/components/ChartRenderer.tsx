import React from 'react';
import { ChartConfig, type ChartData } from '../config/ChartConfig';
import type { ChartType } from '../enums/ChartType';

export interface GenericChartRendererProps {
  type: ChartType;
  data: ChartData[];
  customProps?: Record<string, unknown>; // Replaced 'any' with 'unknown'
}

export const GenericChartRenderer: React.FC<GenericChartRendererProps> = ({
  type,
  data,
  customProps = {},
}) => {
  const config = ChartConfig[type];

  if (!config) {
    return <p>Unsupported chart type: {type}</p>;
  }

  const ChartComponent = config.component;
  const props = { ...config.mapProps(data), ...customProps };

  return <ChartComponent {...props} />;
};
