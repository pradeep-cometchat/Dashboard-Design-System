import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatProgress from './CometChatProgress';

const meta = {
  title: 'Base Components/Progress',
  component: CometChatProgress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percent: 75,
    type: 'line',
  },
};

export const Circle: Story = {
  args: {
    percent: 50,
    type: 'circle',
    size: 80,
  },
};

export const Success: Story = {
  args: {
    percent: 100,
    type: 'line',
    status: 'success',
  },
};

export const CircleWithLabel: Story = {
  args: {
    percent: 65,
    type: 'circle',
    size: 120,
    label: 'Storage',
    bottomLabel: 'Used space',
  },
};
