import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import CometChatDropdown from './CometChatDropdown'

const meta = {
  title: 'Base Components/Dropdown',
  component: CometChatDropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatDropdown>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Click the trigger to reveal the action menu.
 */
export const Default: Story = {
  args: {
    trigger: ['click'],
    items: [
      { key: '1', label: 'Edit', icon: <EditOutlined /> },
      { key: '2', label: 'Delete', icon: <DeleteOutlined />, danger: true },
    ],
    children: <button>Actions</button>,
  },
}

/**
 * Menu with a divider grouping items.
 */
export const WithDivider: Story = {
  args: {
    trigger: ['click'],
    items: [
      { key: '1', label: 'Rename' },
      { key: '2', label: 'Duplicate' },
      { type: 'divider' },
      { key: '3', label: 'Delete', danger: true },
    ],
    children: <button>Open menu</button>,
  },
}
