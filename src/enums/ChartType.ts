export type ChartType = 'bar' | 'line' | 'pie' | 'speedometer';

export type DataPoint = {
  label: string;
  value: number;
};

export type PieData = {
  label: string;
  value: number;
};

export type Zone = {
  from: number;
  to: number;
  color: string;
};

export const ChartTypeValues = ['Bar', 'Line', 'Pie', 'Speedometer'] as const;
