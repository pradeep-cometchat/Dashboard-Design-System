import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatTooltip from './CometChatTooltip';

const meta = {
  title: 'Base Components/Tooltip',
  component: CometChatTooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTooltip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Copy to clipboard',
    children: <button>Hover me</button>,
  },
};

export const BottomPlacement: Story = {
  args: {
    title: 'Delete item',
    placement: 'bottom',
    children: <button>Delete</button>,
  },
};

export const RightPlacement: Story = {
  args: {
    title: 'More information about this action',
    placement: 'right',
    children: <button>Info</button>,
  },
};
