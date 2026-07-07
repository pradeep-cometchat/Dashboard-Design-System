import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatCollapse from './CometChatCollapse';

const meta = {
  title: 'Base Components/Collapse',
  component: CometChatCollapse,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatCollapse>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { key: '1', label: 'What is CometChat?', children: <p>CometChat is a chat and messaging platform.</p> },
  { key: '2', label: 'How do I get started?', children: <p>Sign up and integrate the SDK into your app.</p> },
  { key: '3', label: 'Is there a free tier?', children: <p>Yes, a free tier is available for developers.</p> },
];

export const Default: Story = {
  args: {
    items,
    defaultActiveKey: ['1'],
    style: { width: 400 },
  },
};

export const Accordion: Story = {
  args: {
    items,
    accordion: true,
    defaultActiveKey: ['1'],
    style: { width: 400 },
  },
};

export const Borderless: Story = {
  args: {
    items,
    bordered: false,
    style: { width: 400 },
  },
};

export const Small: Story = {
  args: {
    items,
    size: 'small',
    style: { width: 400 },
  },
};
