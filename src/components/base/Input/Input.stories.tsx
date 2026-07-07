import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchOutlined } from '@ant-design/icons'
import CometChatInput from './CometChatInput'

const meta = {
  title: 'Base Components/Input',
  component: CometChatInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatInput>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic input with a placeholder and prefix icon.
 */
export const Default: Story = {
  args: {
    placeholder: 'Search',
    prefix: <SearchOutlined />,
  },
}

/**
 * Input with a label, required asterisk, help icon, and hint text.
 */
export const WithLabelAndHint: Story = {
  args: {
    label: 'Email',
    required: true,
    helpText: 'Your work email address',
    hintText: "We'll never share your email",
    placeholder: 'you@example.com',
  },
}

/**
 * Error state showing destructive styling and message.
 */
export const ErrorState: Story = {
  args: {
    label: 'Email',
    error: 'Please enter a valid email',
    value: 'invalid',
  },
}

/**
 * Disabled input.
 */
export const Disabled: Story = {
  args: {
    label: 'Name',
    placeholder: 'John Doe',
    disabled: true,
  },
}
