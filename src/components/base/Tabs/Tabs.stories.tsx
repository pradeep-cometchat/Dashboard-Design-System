import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatTabs from './CometChatTabs';

const meta = {
  title: 'Base Components/Tabs',
  component: CometChatTabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { key: 'general', label: 'General', children: <div style={{ padding: 12 }}>General settings content</div> },
  { key: 'billing', label: 'Billing', children: <div style={{ padding: 12 }}>Billing settings content</div> },
  { key: 'members', label: 'Members', children: <div style={{ padding: 12 }}>Members settings content</div> },
];

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    type: 'underline',
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};

export const ButtonBorder: Story = {
  args: {
    orientation: 'horizontal',
    type: 'button-border',
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};

export const ButtonMinimal: Story = {
  args: {
    orientation: 'horizontal',
    type: 'button-minimal',
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};

export const FullWidth: Story = {
  args: {
    orientation: 'horizontal',
    type: 'underline',
    fullWidth: true,
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    type: 'button-gray',
    size: 'md',
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};

export const VerticalLine: Story = {
  args: {
    orientation: 'vertical',
    type: 'line',
    defaultActiveKey: 'general',
    items,
    style: { width: 420 },
  },
};
