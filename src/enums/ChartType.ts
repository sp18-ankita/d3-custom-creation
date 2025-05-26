export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'speedometer';

export type DataPoint = {
  label: string;
  value: number;
};

export type PieData = {
  label: string;
  value: number;
};
