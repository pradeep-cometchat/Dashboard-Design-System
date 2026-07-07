import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CometChatPopconfirm from './CometChatPopconfirm';

const meta = {
  title: 'Base Components/Popconfirm',
  component: CometChatPopconfirm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatPopconfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Delete this user?',
    description: 'This action cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel',
    children: <button type="button">Delete</button>,
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Are you sure?',
    description: 'The item will be removed permanently.',
    icon: <QuestionCircleOutlined style={{ color: 'red' }} />,
    okText: 'Yes',
    cancelText: 'No',
    children: <button type="button">Remove item</button>,
  },
};

export const OnClickTrigger: Story = {
  args: {
    title: 'Delete conversation?',
    icon: <DeleteOutlined style={{ color: 'red' }} />,
    trigger: 'click',
    okText: 'Delete',
    cancelText: 'Keep',
    children: <button type="button">Click to delete</button>,
  },
};
