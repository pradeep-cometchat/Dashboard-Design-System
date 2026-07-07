import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatToggle from './CometChatToggle';

const meta = {
  title: 'Base Components/Toggle',
  component: CometChatToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: (args) => {
    const [checked, setChecked] = React.useState(args.checked ?? false);
    return (
      <CometChatToggle
        {...args}
        checked={checked}
        onChange={(value) => setChecked(value)}
      />
    );
  },
} satisfies Meta<typeof CometChatToggle>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: true,
    size: 'md',
    ariaLabel: 'Enable feature',
  },
};

export const WithLabel: Story = {
  args: {
    checked: true,
    size: 'md',
    label: 'Email notifications',
    supportingText: 'Receive updates about your account activity',
  },
};

export const Small: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Compact toggle',
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Locked setting',
    tooltip: 'This setting is managed by your admin',
  },
};
