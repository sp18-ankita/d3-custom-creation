import React from 'react';
import { JsonInput } from './JsonInput';
import { NumberInput } from './NumberInput';

type SpeedometerControlsProps = {
  value: string;
  onValueChange: (val: string) => void;
  min: string;
  onMinChange: (val: string) => void;
  max: string;
  onMaxChange: (val: string) => void;
  majorTicks: string;
  onMajorTicksChange: (val: string) => void;
  zonesJson: string;
  onZonesJsonChange: (val: string) => void;
  onZonesValidate: () => void;
};

export const SpeedometerControls: React.FC<SpeedometerControlsProps> = ({
  value,
  onValueChange,
  min,
  onMinChange,
  max,
  majorTicks,
  onMajorTicksChange,
  zonesJson,
  onZonesJsonChange,
  onZonesValidate,
}) => {
  const parsedMin = parseFloat(min);
  const parsedMax = parseFloat(max);
  const safeMin = isNaN(parsedMin) ? undefined : parsedMin;
  const safeMax = isNaN(parsedMax) ? undefined : parsedMax;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Speedometer Settings</h3>

      <NumberInput label="Min" value={min} onChange={onMinChange} />
      {/* <NumberInput label="Max" value={max} onChange={onMaxChange} /> */}
      <NumberInput
        label="Value"
        value={value}
        min={safeMin}
        max={safeMax}
        onChange={onValueChange}
      />
      <NumberInput label="Major Ticks" value={majorTicks} min={1} onChange={onMajorTicksChange} />

      <JsonInput
        label="Zones (JSON)"
        value={zonesJson}
        onChange={onZonesJsonChange}
        onValidate={onZonesValidate}
      />
    </div>
  );
};
