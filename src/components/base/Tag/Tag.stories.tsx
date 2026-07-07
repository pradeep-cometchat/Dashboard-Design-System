import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserOutlined } from '@ant-design/icons';
import CometChatTag from './CometChatTag';

const meta = {
  title: 'Base Components/Tag',
  component: CometChatTag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <CometChatTag size="sm">Small</CometChatTag>
      <CometChatTag size="md">Medium</CometChatTag>
      <CometChatTag size="lg">Large</CometChatTag>
    </div>
  ),
};

export const Closable: Story = {
  args: {
    children: 'Removable',
    closable: true,
    onClose: () => {},
  },
};

export const WithAvatar: Story = {
  args: {
    children: 'Alice Johnson',
    avatar: <UserOutlined />,
  },
};

export const WithCount: Story = {
  args: {
    children: 'Messages',
    count: 12,
  },
};

export const WithCheckbox: Story = {
  args: {
    children: 'Selectable',
    checkbox: true,
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    closable: true,
    disabled: true,
  },
};
