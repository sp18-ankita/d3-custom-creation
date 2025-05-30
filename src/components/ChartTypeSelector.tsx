import React from 'react';
import type { ChartType } from '../enums/ChartType';

type ChartTypeSelectorProps = {
  chartType: ChartType;
  onChange: (val: ChartType) => void;
};

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ chartType, onChange }) => (
  <div>
    <label>
      Chart Type:&nbsp;
      <select value={chartType} onChange={e => onChange(e.target.value as ChartType)}>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
        <option value="speedometer">Speedometer</option>
      </select>
    </label>
  </div>
);
