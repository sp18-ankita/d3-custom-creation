import React from 'react';

export type Option<T> = {
  value: T;
  label: string;
};

export type SelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  label: string;
};

export function Select<T extends string>({ value, options, onChange, label }: SelectProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <label>
      {label}
      &nbsp;
      <select value={value} onChange={handleChange}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
