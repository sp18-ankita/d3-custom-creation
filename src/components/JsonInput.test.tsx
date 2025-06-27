import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JsonInput } from '../components/JsonInput';

describe('JsonInput', () => {
  it('renders label and textarea with default value', () => {
    render(
      <JsonInput
        label="JSON Data"
        value='{"key":"value"}'
        onChange={() => {}}
        onValidate={() => {}}
      />,
    );

    expect(screen.getByText(/JSON Data:/)).toBeTruthy();

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('{"key":"value"}');
  });

  it('calls onChange when textarea value changes', () => {
    const handleChange = vi.fn();
    render(<JsonInput label="Input" value="" onChange={handleChange} onValidate={() => {}} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '{"new":"value"}' } });

    expect(handleChange).toHaveBeenCalledWith('{"new":"value"}');
  });

  it('calls onValidate when button is clicked', () => {
    const handleValidate = vi.fn();
    render(<JsonInput label="Data" value="{}" onChange={() => {}} onValidate={handleValidate} />);

    const button = screen.getByRole('button', { name: /validate json/i });
    fireEvent.click(button);

    expect(handleValidate).toHaveBeenCalled();
  });
});
