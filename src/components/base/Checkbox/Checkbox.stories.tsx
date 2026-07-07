import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatCheckbox from './CometChatCheckbox';

const meta = {
  title: 'Base Components/Checkbox',
  component: CometChatCheckbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    defaultChecked: false,
  },
};

export const WithSupportingText: Story = {
  args: {
    label: 'Email notifications',
    supportingText: 'Receive updates about your account activity.',
    defaultChecked: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small checkbox',
    size: 'sm',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <CometChatCheckbox
        label="Controlled checkbox"
        supportingText={checked ? 'Currently checked' : 'Currently unchecked'}
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};
