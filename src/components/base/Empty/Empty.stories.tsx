import type { Meta, StoryObj } from '@storybook/react-vite'
import CometChatEmpty from './CometChatEmpty'

const meta = {
  title: 'Base Components/Empty',
  component: CometChatEmpty,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatEmpty>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default featured-icon empty state with title and description.
 */
export const Default: Story = {
  args: {
    size: 'md',
    iconType: 'featured-icon',
    title: 'No projects found',
    description: 'Your search did not match any projects. Please try again.',
  },
}

/**
 * Illustration variant with primary and secondary actions.
 */
export const WithIllustrationAndActions: Story = {
  args: {
    size: 'lg',
    iconType: 'illustration',
    illustration: 'cloud',
    title: 'No projects found',
    description: 'Your search did not match any projects. Please try again.',
    primaryAction: <button>New project</button>,
    secondaryAction: <button>Clear search</button>,
  },
}
