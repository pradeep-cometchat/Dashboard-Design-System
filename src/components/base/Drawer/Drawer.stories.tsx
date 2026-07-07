import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import CometChatDrawer from './CometChatDrawer'

const meta = {
  title: 'Base Components/Drawer',
  component: CometChatDrawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatDrawer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Trigger button opens the drawer; it slides in from the right by default.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open drawer</button>
        <CometChatDrawer
          open={open}
          title="Edit user"
          onClose={() => setOpen(false)}
        >
          <p>Drawer content goes here.</p>
          <p>Use this panel for forms and detail views.</p>
        </CometChatDrawer>
      </>
    )
  },
}

/**
 * Drawer sliding in from the left edge.
 */
export const LeftPlacement: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open left drawer</button>
        <CometChatDrawer
          open={open}
          placement="left"
          title="Filters"
          onClose={() => setOpen(false)}
        >
          <p>Left-placed drawer content.</p>
        </CometChatDrawer>
      </>
    )
  },
}
