import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartTypeSelector } from '../components/ChartTypeSelector';

// Mock Select component
vi.mock('../components/Select', () => {
  return {
    Select: ({
      value,
      options,
      onChange,
      label,
    }: {
      value: string;
      options: { label: string; value: string }[];
      onChange: (val: string) => void;
      label: string;
    }) => (
      <div data-testid="mock-select">
        <label>{label}</label>
        <select data-testid="select-input" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    ),
  };
});

describe('ChartTypeSelector', () => {
  it('renders with current chart type selected', () => {
    render(<ChartTypeSelector chartType="bar" onChange={() => {}} />);
    const select = screen.getByTestId('select-input') as HTMLSelectElement;
    expect(select.value).toBe('bar');
  });

  it('calls onChange when a new chart type is selected', () => {
    const handleChange = vi.fn();
    render(<ChartTypeSelector chartType="bar" onChange={handleChange} />);
    const select = screen.getByTestId('select-input');

    fireEvent.change(select, { target: { value: 'pie' } });
    expect(handleChange).toHaveBeenCalledWith('pie');
  });
});
