import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: {
    label: 'Quantity',
    value: '5',
    min: 0,
    max: 100,
    step: 1,
  },
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState(args.value);

    return (
      <NumberInput
        {...args}
        value={value}
        onChange={val => {
          setValue(val);
        }}
      />
    );
  },
};

export const WithStepAndRange: Story = {
  args: {
    label: 'Step 5',
    min: 0,
    max: 50,
    step: 5,
    value: '10',
  },
  render: args => {
    const [value, setValue] = useState(args.value);

    return (
      <NumberInput
        {...args}
        value={value}
        onChange={val => {
          setValue(val);
        }}
      />
    );
  },
};
