import { BarChart } from '../components/charts/Barchart';
import { LineChart } from '../components/charts/Linechart';
import { PieChart } from '../components/charts/Piechart';
import { Speedometer } from '../components/charts/Speedometer';
import type { ChartType } from '../enums/ChartType';

export interface ChartData {
  label: string;
  value: number;
}

export type ChartComponentProps = {
  data: ChartData[];
  // Add more common props here if needed
};

export type SpeedometerProps = {
  value: number;
  min: number;
  max: number;
  startAngle: number;
  endAngle: number;
  width: number;
};

type ChartConfigEntry = {
  component: React.ComponentType<ChartComponentProps | SpeedometerProps>;
  mapProps: (data: ChartData[]) => ChartComponentProps | SpeedometerProps;
};

export const ChartConfig: Record<ChartType, ChartConfigEntry> = {
  bar: {
    component: BarChart,
    mapProps: data => ({ data }),
  },
  line: {
    component: LineChart,
    mapProps: data => ({ data }),
  },
  pie: {
    component: PieChart,
    mapProps: data => ({ data }),
  },
  speedometer: {
    component: Speedometer,
    mapProps: data => ({
      value: data[0]?.value ?? 0,
      min: 0,
      max: 100,
      startAngle: -90,
      endAngle: 90,
      width: 500,
    }),
  },
};
