import React, { createContext, useContext, useState } from 'react';
import type { ChartType, Zone } from '../enums/ChartType';

type ChartContextType = {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  value: string;
  setValue: (v: string) => void;
  min: string;
  setMin: (v: string) => void;
  max: string;
  setMax: (v: string) => void;
  majorTicks: string;
  setMajorTicks: (v: string) => void;

  zonesJson: string;
  setZonesJson: (v: string) => void;
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
};

const DEFAULT_ZONES: Zone[] = [
  { from: 0, to: 30, color: '#4caf50' },
  { from: 30, to: 70, color: '#ffeb3b' },
  { from: 70, to: 100, color: '#f44336' },
];

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const useChartContext = () => {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChartContext must be used within ChartProvider');
  return ctx;
};

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const [value, setValue] = useState('45');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('100');
  const [majorTicks, setMajorTicks] = useState('5');

  const [zonesJson, setZonesJson] = useState<string>(JSON.stringify(DEFAULT_ZONES, null, 2));
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);

  return React.createElement(
    ChartContext.Provider,
    {
      value: {
        chartType,
        setChartType,
        value,
        setValue,
        min,
        setMin,
        max,
        setMax,
        majorTicks,
        setMajorTicks,
        zonesJson,
        setZonesJson,
        zones,
        setZones,
      },
    },
    children,
  );
};
