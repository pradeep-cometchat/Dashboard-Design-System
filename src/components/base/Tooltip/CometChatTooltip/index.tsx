import React from 'react'
import { Tooltip as AntTooltip } from 'antd'
import type { TooltipProps as AntTooltipProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Tooltip.
 * Displays a tooltip popup when hovering or focusing on the wrapped element.
 *
 * @example
 * <CometChatTooltip title="Copy to clipboard"><button>Copy</button></CometChatTooltip>
 * <CometChatTooltip title="Delete item" placement="bottom"><DeleteIcon /></CometChatTooltip>
 */
export type CometChatTooltipProps = AntTooltipProps

/**
 * CometChat Tooltip — hover/focus information popups.
 */
const CometChatTooltip: React.FC<CometChatTooltipProps> = ({
  children,
  overlayClassName = '',
  ...rest
}) => {
  return (
    <AntTooltip
      overlayClassName={`cc-tooltip ${overlayClassName}`}
      {...rest}
    >
      {children}
    </AntTooltip>
  )
}

CometChatTooltip.displayName = 'CometChatTooltip'

export default CometChatTooltip
