import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClockCircleOutlined } from '@ant-design/icons';
import CometChatTimeline from './CometChatTimeline';

const meta = {
  title: 'Base Components/Timeline',
  component: CometChatTimeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTimeline>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { children: 'Step 1: Create app' },
      { children: 'Step 2: Add users', color: 'green' },
      { children: 'Step 3: Send message', color: 'gray' },
    ],
  },
};

export const Colored: Story = {
  args: {
    items: [
      { children: 'Account created', color: 'green' },
      { children: 'Email verified', color: 'green' },
      { children: 'Payment failed', color: 'red' },
      { children: 'Retry pending', color: 'blue' },
    ],
  },
};

export const WithCustomDots: Story = {
  args: {
    items: [
      { children: 'Request received 10:00' },
      {
        children: 'Processing 10:05',
        dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        color: 'red',
      },
      { children: 'Completed 10:12' },
    ],
  },
};
