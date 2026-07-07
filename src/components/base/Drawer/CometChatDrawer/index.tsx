import React from 'react'
import { Drawer as AntDrawer } from 'antd'
import type { DrawerProps as AntDrawerProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Drawer.
 * A panel that slides in from the edge of the screen for forms and detail views.
 *
 * @example
 * <CometChatDrawer open={isOpen} title="Edit User" onClose={handleClose}>
 *   <form>...</form>
 * </CometChatDrawer>
 */
interface CometChatDrawerProps extends Omit<AntDrawerProps, 'className'> {
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat Drawer — slide-in panels for forms and details.
 */
const CometChatDrawer: React.FC<CometChatDrawerProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <AntDrawer
      className={`cc-drawer ${className}`}
      {...rest}
    >
      {children}
    </AntDrawer>
  )
}

CometChatDrawer.displayName = 'CometChatDrawer'

export default CometChatDrawer
