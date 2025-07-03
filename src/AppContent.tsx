import React, { useState } from 'react';
import './App.css';

import type { DataPoint } from './enums/ChartType';

import { GenericChartRenderer } from './components/ChartRenderer';
import { Speedometer } from './components/charts/Speedometer';
import { ChartTypeSelector } from './components/ChartTypeSelector';
import { JsonInput } from './components/JsonInput';
import { SpeedometerControls } from './components/SpeedometerControls';
import { useChartContext } from './hooks/useChartContext';
import { WeatherWidget } from './widget/WeatherWidget';

const DEFAULT_DATA: DataPoint[] = [
  { label: 'A', value: 30 },
  { label: 'B', value: 70 },
];

export const AppContent: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>(JSON.stringify(DEFAULT_DATA, null, 2));

  const [chartData, setChartData] = useState<DataPoint[]>(DEFAULT_DATA);

  const {
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
    zones,
    setZones,
    zonesJson,
    setZonesJson,
  } = useChartContext();

  const handleRenderData = () => {
    try {
      const parsed = JSON.parse(dataInput);
      if (Array.isArray(parsed) && parsed.every(item => 'label' in item && 'value' in item)) {
        setChartData(parsed);
      } else {
        alert('Data must be an array of objects with "label" and "value" properties.');
      }
    } catch {
      alert('Invalid JSON data.');
    }
  };

  const handleValidateZones = () => {
    try {
      const parsed = JSON.parse(zonesJson);
      if (
        Array.isArray(parsed) &&
        parsed.every(
          zone =>
            'from' in zone &&
            'to' in zone &&
            'color' in zone &&
            typeof zone.from === 'number' &&
            typeof zone.to === 'number' &&
            typeof zone.color === 'string',
        )
      ) {
        setZones(parsed);
      } else {
        alert(
          'Zones must be an array of objects with "from", "to" (numbers), and "color" (string).',
        );
      }
    } catch {
      alert('Invalid JSON for zones.');
    }
  };

  // Convert string inputs to numbers safely
  const speedValue = value === '' ? NaN : parseFloat(value);
  const speedMin = min === '' ? NaN : parseFloat(min);
  const speedMax = max === '' ? NaN : parseFloat(max);
  const speedMajorTicks = majorTicks === '' ? NaN : parseInt(majorTicks, 10);

  const isSpeedometerReady =
    !isNaN(speedValue) && !isNaN(speedMin) && !isNaN(speedMax) && !isNaN(speedMajorTicks);

  return (
    <div className="app-container" style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <WeatherWidget />
      <h1>D3 Chart Viewer</h1>

      <ChartTypeSelector chartType={chartType} onChange={setChartType} />

      {chartType !== 'speedometer' && (
        <>
          <JsonInput
            label="Data (JSON)"
            value={dataInput}
            onChange={setDataInput}
            onValidate={handleRenderData}
          />
          <button onClick={handleRenderData} style={{ marginTop: 10 }}>
            Render Chart
          </button>
          <div style={{ marginTop: 20 }}>
            <GenericChartRenderer type={chartType} data={chartData} />
          </div>
        </>
      )}

      {chartType === 'speedometer' && (
        <>
          <SpeedometerControls
            value={value}
            onValueChange={setValue}
            min={min}
            onMinChange={setMin}
            max={max}
            onMaxChange={setMax}
            majorTicks={majorTicks}
            onMajorTicksChange={setMajorTicks}
            zonesJson={zonesJson}
            onZonesJsonChange={setZonesJson}
            onZonesValidate={handleValidateZones}
          />
          <div style={{ marginTop: 20 }}>
            {isSpeedometerReady ? (
              <Speedometer
                value={speedValue}
                min={speedMin}
                max={speedMax}
                majorTicks={speedMajorTicks}
                zones={zones}
                width={400}
                height={220}
                startAngle={-180}
                endAngle={180}
              />
            ) : (
              <p style={{ color: 'red' }}>
                Please enter valid numeric values for all speedometer fields.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AppContent;
