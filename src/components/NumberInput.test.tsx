import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from './NumberInput/NumberInput';

describe('NumberInput', () => {
  it('renders the label and input with initial value', () => {
    render(<NumberInput label="Value" value="5" onChange={() => {}} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('5');
    expect(screen.getByText(/Value:/)).toBeTruthy();
  });

  it('calls onChange with new string value', () => {
    const handleChange = vi.fn();
    render(<NumberInput label="Count" value="1" onChange={handleChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });

    expect(handleChange).toHaveBeenCalledWith('42');
  });

  it('applies min, max, and step props correctly', () => {
    render(
      <NumberInput label="Amount" value="10" onChange={() => {}} min={0} max={100} step={5} />,
    );

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
    expect(input.getAttribute('step')).toBe('5');
  });
});
