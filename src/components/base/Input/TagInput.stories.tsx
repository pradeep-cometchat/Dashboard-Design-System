import type { Meta, StoryObj } from '@storybook/react-vite'
import CometChatTagInput from './CometChatTagInput'

const meta = {
  title: 'Base Components/Tag Input',
  component: CometChatTagInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatTagInput>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Free-form tag entry. Type and press Enter (or comma) to add tags.
 */
export const Default: Story = {
  args: {
    label: 'Allowed types',
    placeholder: 'Add a Type',
    style: { width: 320 },
  },
}

/**
 * Pre-filled tags with hint text.
 */
export const WithValueAndHint: Story = {
  args: {
    label: 'Tags',
    hintText: 'Up to 25 tags allowed',
    value: ['image/png', 'image/jpeg'],
    maxTags: 25,
    style: { width: 320 },
  },
}

/**
 * Error state with destructive styling.
 */
export const ErrorState: Story = {
  args: {
    label: 'Allowed types',
    error: 'At least one type is required',
    placeholder: 'Add a Type',
    style: { width: 320 },
  },
}
