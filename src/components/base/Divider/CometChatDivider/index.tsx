import React from 'react'
import { Divider as AntDivider } from 'antd'
import type { DividerProps as AntDividerProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Divider.
 * Renders a horizontal or vertical separator line with optional text content.
 *
 * @example
 * <CometChatDivider />
 * <CometChatDivider orientation="left">Section Title</CometChatDivider>
 * <CometChatDivider type="vertical" />
 */
interface CometChatDividerProps extends Omit<AntDividerProps, 'className'> {
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat Divider — consistent separator across the dashboard.
 */
const CometChatDivider: React.FC<CometChatDividerProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <AntDivider
      className={`cc-divider ${className}`}
      {...rest}
    >
      {children}
    </AntDivider>
  )
}

CometChatDivider.displayName = 'CometChatDivider'

export default CometChatDivider
