import React from 'react'
import { Space, SpaceProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for grouped buttons.
 * Renders a set of buttons in a horizontal row with consistent spacing.
 *
 * @example
 * <CometChatButtonGroup>
 *   <CometChatButton variant="secondary">Cancel</CometChatButton>
 *   <CometChatButton variant="primary">Save</CometChatButton>
 * </CometChatButtonGroup>
 */
interface CometChatButtonGroupProps extends Omit<SpaceProps, 'size' | 'direction'> {
  /** Gap between buttons in pixels */
  gap?: number
  /** Alignment of the group */
  align?: 'start' | 'center' | 'end'
  /** Direction of the button group */
  direction?: 'horizontal' | 'vertical'
  /** Whether buttons should take full width */
  block?: boolean
}

/**
 * CometChat ButtonGroup — groups related actions together.
 */
const CometChatButtonGroup: React.FC<CometChatButtonGroupProps> = ({
  children,
  gap = 12,
  align = 'start',
  direction = 'horizontal',
  block = false,
  className = '',
  style,
  ...rest
}) => {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }

  return (
    <Space
      size={gap}
      direction={direction}
      className={`cc-button-group ${className}`}
      style={{
        display: block ? 'flex' : 'inline-flex',
        justifyContent: justifyMap[align],
        width: block ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Space>
  )
}

CometChatButtonGroup.displayName = 'CometChatButtonGroup'

export default CometChatButtonGroup
