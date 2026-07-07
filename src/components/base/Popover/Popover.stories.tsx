import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatPopover from './CometChatPopover';

const meta = {
  title: 'Base Components/Popover',
  component: CometChatPopover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Info',
    content: <div>Rich content displayed inside the floating card.</div>,
    children: <button type="button">Hover me</button>,
  },
};

export const ClickTrigger: Story = {
  args: {
    title: 'Account',
    trigger: 'click',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>Signed in as Jane Doe</span>
        <span>jane@example.com</span>
      </div>
    ),
    children: <button type="button">Click me</button>,
  },
};

export const RightPlacement: Story = {
  args: {
    title: 'Details',
    placement: 'right',
    content: <div>This popover opens to the right of the trigger.</div>,
    children: <button type="button">Show details</button>,
  },
};
