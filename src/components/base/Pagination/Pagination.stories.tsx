import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatPagination from './CometChatPagination';

const meta = {
  title: 'Base Components/Pagination',
  component: CometChatPagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled: React.FC<React.ComponentProps<typeof CometChatPagination>> = (args) => {
  const [current, setCurrent] = React.useState(args.current ?? 1);
  return (
    <CometChatPagination
      {...args}
      current={current}
      onChange={(page) => setCurrent(page)}
    />
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    current: 1,
    total: 250,
    pageSize: 10,
    variant: 'page',
    kind: 'default',
  },
};

export const Minimal: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    current: 3,
    total: 120,
    pageSize: 10,
    variant: 'page',
    kind: 'minimal',
  },
};

export const ButtonGroup: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    current: 2,
    total: 100,
    pageSize: 10,
    variant: 'card',
    kind: 'button-group',
  },
};

export const CardBordered: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    current: 1,
    total: 80,
    pageSize: 10,
    variant: 'card',
    kind: 'default',
    align: 'center',
    bordered: true,
    shape: 'circle',
  },
};
