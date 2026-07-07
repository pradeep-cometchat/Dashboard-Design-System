import React from 'react'
import { Popover as AntPopover } from 'antd'
import type { PopoverProps as AntPopoverProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Popover.
 * Displays rich content in a floating card triggered by hover/click.
 *
 * @example
 * <CometChatPopover content={<div>Details here</div>} title="Info">
 *   <button>Hover me</button>
 * </CometChatPopover>
 */
interface CometChatPopoverProps extends Omit<AntPopoverProps, 'overlayClassName'> {
  /** Additional CSS class for the overlay */
  overlayClassName?: string
}

/**
 * CometChat Popover — rich content floating cards.
 */
const CometChatPopover: React.FC<CometChatPopoverProps> = ({
  children,
  overlayClassName = '',
  ...rest
}) => {
  return (
    <AntPopover
      overlayClassName={`cc-popover ${overlayClassName}`}
      {...rest}
    >
      {children}
    </AntPopover>
  )
}

CometChatPopover.displayName = 'CometChatPopover'

export default CometChatPopover
