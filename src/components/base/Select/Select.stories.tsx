import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatSelect from './CometChatSelect';

const meta = {
  title: 'Base Components/Select',
  component: CometChatSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Guest', value: 'guest' },
];

export const Default: Story = {
  args: {
    label: 'Role',
    placeholder: 'Select a role',
    options,
    style: { width: 260 },
  },
};

export const Required: Story = {
  args: {
    label: 'Role',
    required: true,
    placeholder: 'Select a role',
    options,
    style: { width: 260 },
  },
};

export const WithHelpAndHint: Story = {
  args: {
    label: 'Role',
    helpText: 'Choose the access level for this member.',
    hintText: 'You can change this later.',
    placeholder: 'Select a role',
    options,
    style: { width: 260 },
  },
};

export const WithError: Story = {
  args: {
    label: 'Role',
    required: true,
    error: 'This field is required',
    placeholder: 'Select a role',
    options,
    style: { width: 260 },
  },
};

export const MultipleSelect: Story = {
  args: {
    label: 'Roles',
    mode: 'multiple',
    placeholder: 'Select roles',
    defaultValue: ['admin', 'editor'],
    options,
    style: { width: 260 },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Role',
    disabled: true,
    defaultValue: 'admin',
    options,
    style: { width: 260 },
  },
};
