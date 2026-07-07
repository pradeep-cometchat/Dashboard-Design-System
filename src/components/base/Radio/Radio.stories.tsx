import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatRadio from './CometChatRadio';

const meta = {
  title: 'Base Components/Radio',
  component: CometChatRadio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const Controlled: React.FC<React.ComponentProps<typeof CometChatRadio>> = (args) => {
  const [value, setValue] = React.useState<string | number>(
    args.defaultValue as string | number,
  );
  return <CometChatRadio {...args} value={value} onChange={(v) => setValue(v)} />;
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    options,
    defaultValue: 'light',
    size: 'md',
    direction: 'vertical',
  },
};

export const WithSupportingText: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    defaultValue: 'free',
    size: 'md',
    direction: 'vertical',
    options: [
      { value: 'free', label: 'Free', supportingText: 'Up to 3 projects' },
      { value: 'pro', label: 'Pro', supportingText: 'Unlimited projects and priority support' },
      { value: 'enterprise', label: 'Enterprise', supportingText: 'Custom SLAs and SSO', disabled: true },
    ],
  },
};

export const Horizontal: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    options,
    defaultValue: 'dark',
    size: 'sm',
    direction: 'horizontal',
  },
};

export const Disabled: Story = {
  args: {
    options,
    defaultValue: 'system',
    disabled: true,
  },
};
