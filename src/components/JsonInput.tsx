import React from 'react';

type JsonInputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onValidate: () => void;
  rows?: number;
  cols?: number;
};

export const JsonInput: React.FC<JsonInputProps> = ({
  label,
  value,
  onChange,
  onValidate,
  rows = 6,
  cols = 50,
}) => {
  return (
    <div style={{ marginTop: 10 }}>
      <label>
        {label}:
        <textarea
          rows={rows}
          cols={cols}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ display: 'block', marginTop: 4 }}
        />
      </label>
      <button onClick={onValidate} style={{ marginTop: 5 }}>
        Validate JSON
      </button>
    </div>
  );
};
