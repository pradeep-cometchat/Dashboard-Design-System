import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatSlider from './CometChatSlider';

const meta = {
  title: 'Base Components/Slider',
  component: CometChatSlider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 40,
    style: { width: 300 },
  },
};

export const WithSteps: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 10,
    style: { width: 300 },
  },
};

export const Range: Story = {
  args: {
    range: true,
    defaultValue: [20, 80],
    style: { width: 300 },
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 30,
    disabled: true,
    style: { width: 300 },
  },
};

export const WithTooltip: Story = {
  args: {
    defaultValue: 60,
    tooltip: {
      open: true,
      formatter: (value) => `${value}%`,
    },
    style: { width: 300 },
  },
};
