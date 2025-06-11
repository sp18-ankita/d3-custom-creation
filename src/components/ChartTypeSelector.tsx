import React, { useCallback } from 'react';
import type { ChartType } from '../enums/ChartType';
import { Select, type Option } from './Select';

const chartTypeOptions: Option<ChartType>[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
  { value: 'speedometer', label: 'Speedometer' },
];

type ChartTypeSelectorProps = {
  chartType: ChartType;
  onChange: (val: ChartType) => void;
};

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ chartType, onChange }) => {
  const handleChange = useCallback(
    (val: ChartType) => {
      onChange(val);
    },
    [onChange],
  );

  return (
    <div>
      <Select
        value={chartType}
        options={chartTypeOptions}
        onChange={handleChange}
        label="Chart Type:"
      />
    </div>
  );
};
