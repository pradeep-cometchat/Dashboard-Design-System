import type { Meta, StoryObj } from '@storybook/react-vite';
import { EditOutlined } from '@ant-design/icons';
import CometChatButton from './CometChatButton';

const meta = {
  title: 'Base Components/Button',
  component: CometChatButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { hierarchy: 'primary', children: 'Primary Button' },
};

export const Secondary: Story = {
  args: { hierarchy: 'secondary', children: 'Secondary Button', size: 'md' },
};

export const WithIcon: Story = {
  args: {
    hierarchy: 'primary',
    children: 'Edit',
    iconLeading: <EditOutlined />,
  },
};

export const Destructive: Story = {
  args: { hierarchy: 'primary', destructive: true, children: 'Delete' },
};

export const Loading: Story = {
  args: { hierarchy: 'primary', loading: true, loadingText: 'Saving...' },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    ariaLabel: 'Edit',
    iconLeading: <EditOutlined />,
  },
};
