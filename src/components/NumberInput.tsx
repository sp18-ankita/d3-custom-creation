import React from 'react';

type NumberInputProps = {
  label: string;
  value: string; // use string to match form inputs
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: React.CSSProperties;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  style,
}) => (
  <label style={{ display: 'inline-block', marginRight: 12, ...style }}>
    {label}:{' '}
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)} // keep value as string
      min={min}
      max={max}
      step={step}
      style={{ width: 70 }}
    />
  </label>
);
