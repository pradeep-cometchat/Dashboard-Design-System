import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatTextArea from './CometChatTextArea';

const meta = {
  title: 'Base Components/Text Area',
  component: CometChatTextArea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTextArea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter description...',
    autoSize: { minRows: 3, maxRows: 5 },
  },
};

export const WithLabelAndHint: Story = {
  args: {
    label: 'Description',
    required: true,
    hintText: 'Max 500 characters',
    showCount: true,
    maxLength: 500,
    placeholder: 'Tell us about your project...',
    autoSize: { minRows: 3, maxRows: 6 },
  },
};

export const Error: Story = {
  args: {
    label: 'JSON Data',
    error: 'Please enter valid JSON',
    defaultValue: '{ invalid json',
    autoSize: { minRows: 3, maxRows: 5 },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read only',
    disabled: true,
    defaultValue: 'This field cannot be edited.',
    autoSize: { minRows: 3, maxRows: 5 },
  },
};
