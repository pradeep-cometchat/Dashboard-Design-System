import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatCard from './CometChatCard';

const meta = {
  title: 'Base Components/Card',
  component: CometChatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Statistics',
    style: { width: 300 },
    children: 'Card content goes here.',
  },
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
    style: { width: 300 },
    children: 'Hover over me to see the elevation change.',
  },
};

export const WithExtra: Story = {
  args: {
    title: 'Card Title',
    extra: <a href="#">More</a>,
    style: { width: 300 },
    children: 'A card with an extra action in the header.',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Card',
    loading: true,
    style: { width: 300 },
  },
};
