import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserOutlined } from '@ant-design/icons';
import CometChatAvatar from './CometChatAvatar';

const meta = {
  title: 'Base Components/Avatar',
  component: CometChatAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'John Doe',
    size: 64,
  },
};

export const Icon: Story = {
  args: {
    size: 64,
    icon: <UserOutlined />,
  },
};

export const Text: Story = {
  args: {
    size: 64,
    children: 'JD',
  },
};

export const Square: Story = {
  args: {
    size: 64,
    shape: 'square',
    icon: <UserOutlined />,
  },
};
