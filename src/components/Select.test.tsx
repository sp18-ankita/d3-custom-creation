import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select, type Option } from '../components/Select';

describe('Select', () => {
  const options: Option<'bar' | 'line'>[] = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
  ];

  it('renders label and options', () => {
    render(<Select label="Chart Type" value="bar" options={options} onChange={() => {}} />);

    expect(screen.getByText(/Chart Type/)).toBeTruthy();

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('bar');

    // Options should be visible in DOM
    expect(screen.getByText('Bar Chart')).toBeTruthy();
    expect(screen.getByText('Line Chart')).toBeTruthy();
  });

  it('calls onChange with correct value on user selection', () => {
    const handleChange = vi.fn();

    render(<Select label="Chart" value="bar" options={options} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'line' } });

    expect(handleChange).toHaveBeenCalledWith('line');
  });
});
