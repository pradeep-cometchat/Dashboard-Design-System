import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import CometChatModal from './CometChatModal'

const meta = {
  title: 'Base Components/Modal',
  component: CometChatModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatModal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default modal opened via a trigger button.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open modal</button>
        <CometChatModal
          open={open}
          title="Update available"
          description="A new software version is available for download."
          okText="Update"
          cancelText="Cancel"
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}

/**
 * Destructive tone modal with a warning featured icon.
 */
export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Delete account</button>
        <CometChatModal
          open={open}
          tone="destructive"
          title="Delete account"
          description="Are you sure you want to delete your account? This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}

/**
 * Success tone modal with body content and a divider under the header.
 */
export const SuccessWithBody: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open success modal</button>
        <CometChatModal
          open={open}
          tone="success"
          size="md"
          headerDivider
          footerDivider
          title="Payment successful"
          description="Your payment has been processed."
          okText="Done"
          hideCancel
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <p>A receipt has been sent to your email address.</p>
        </CometChatModal>
      </>
    )
  },
}
