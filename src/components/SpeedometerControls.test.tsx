import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SpeedometerControls } from '../components/SpeedometerControls';

vi.mock('../components/NumberInput', () => ({
  NumberInput: ({ label, value, onChange }: JsonInputProps) => (
    <label>
      {label}
      <input
        data-testid={`number-${label.toLowerCase().replace(/\s+/g, '-')}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  ),
}));

// Define JsonInputProps type for the mock
type JsonInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
};

vi.mock('../components/JsonInput', () => ({
  JsonInput: ({ label, value, onChange, onValidate }: JsonInputProps) => (
    <div>
      <label>
        {label}
        <textarea data-testid="json-zones" value={value} onChange={e => onChange(e.target.value)} />
      </label>
      <button onClick={onValidate}>Validate JSON</button>
    </div>
  ),
}));

describe('SpeedometerControls', () => {
  const setup = () => {
    const handlers = {
      onValueChange: vi.fn(),
      onMinChange: vi.fn(),
      onMaxChange: vi.fn(),
      onMajorTicksChange: vi.fn(),
      onZonesJsonChange: vi.fn(),
      onZonesValidate: vi.fn(),
    };

    render(
      <SpeedometerControls
        value="30"
        onValueChange={handlers.onValueChange}
        min="0"
        onMinChange={handlers.onMinChange}
        max="100"
        onMaxChange={handlers.onMaxChange}
        majorTicks="5"
        onMajorTicksChange={handlers.onMajorTicksChange}
        zonesJson='[{"from":0,"to":50,"color":"green"}]'
        onZonesJsonChange={handlers.onZonesJsonChange}
        onZonesValidate={handlers.onZonesValidate}
      />,
    );

    return handlers;
  };

  it('renders all labeled inputs', () => {
    setup();

    expect(screen.getByText('Speedometer Settings')).toBeTruthy();
    expect(screen.getByLabelText('Min')).toBeTruthy();
    expect(screen.getByLabelText('Value')).toBeTruthy();
    expect(screen.getByLabelText('Major Ticks')).toBeTruthy();
    expect(screen.getByLabelText('Zones (JSON)')).toBeTruthy();
  });

  it('calls appropriate change handlers on input change', () => {
    const handlers = setup();

    fireEvent.change(screen.getByTestId('number-min'), { target: { value: '5' } });
    fireEvent.change(screen.getByTestId('number-value'), { target: { value: '42' } });
    fireEvent.change(screen.getByTestId('number-major-ticks'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('json-zones'), {
      target: { value: '[{"from":0,"to":60,"color":"blue"}]' },
    });

    expect(handlers.onMinChange).toHaveBeenCalledWith('5');
    expect(handlers.onValueChange).toHaveBeenCalledWith('42');
    expect(handlers.onMajorTicksChange).toHaveBeenCalledWith('6');
    expect(handlers.onZonesJsonChange).toHaveBeenCalledWith('[{"from":0,"to":60,"color":"blue"}]');
  });

  it('calls onZonesValidate when validate button is clicked', () => {
    const handlers = setup();

    fireEvent.click(screen.getByText('Validate JSON'));
    expect(handlers.onZonesValidate).toHaveBeenCalled();
  });
});
