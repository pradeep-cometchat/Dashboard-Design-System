import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatDivider from './CometChatDivider';

const meta = {
  title: 'Base Components/Divider',
  component: CometChatDivider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 400 }}>
      <p>Content above the divider.</p>
      <CometChatDivider {...args} />
      <p>Content below the divider.</p>
    </div>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <div style={{ width: 400 }}>
      <p>Content above the divider.</p>
      <CometChatDivider {...args}>Section Title</CometChatDivider>
      <p>Content below the divider.</p>
    </div>
  ),
  args: {
    orientation: 'left',
  },
};

export const Dashed: Story = {
  render: (args) => (
    <div style={{ width: 400 }}>
      <p>Content above the divider.</p>
      <CometChatDivider {...args} />
      <p>Content below the divider.</p>
    </div>
  ),
  args: {
    dashed: true,
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div>
      <span>Left</span>
      <CometChatDivider {...args} />
      <span>Middle</span>
      <CometChatDivider {...args} />
      <span>Right</span>
    </div>
  ),
  args: {
    type: 'vertical',
  },
};
