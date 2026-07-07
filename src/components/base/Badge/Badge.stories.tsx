import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircleOutlined } from '@ant-design/icons';
import CometChatBadge from './CometChatBadge';

const meta = {
  title: 'Base Components/Badge',
  component: CometChatBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Badge', color: 'gray', size: 'md', type: 'pill' },
};

export const Success: Story = {
  args: {
    children: 'Active',
    color: 'success',
    type: 'badge',
    iconLeading: <CheckCircleOutlined />,
  },
};

export const Error: Story = {
  args: { children: 'Failed', color: 'error', size: 'lg' },
};

export const Closable: Story = {
  args: {
    children: 'Dismiss me',
    color: 'brand',
    closable: true,
    onClose: () => alert('closed'),
  },
};

export const Modern: Story = {
  args: { children: 'Modern', color: 'warning', type: 'modern', size: 'sm' },
};
