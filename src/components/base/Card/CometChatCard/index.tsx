import React from 'react'
import { Card as AntCard, CardProps as AntCardProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Card.
 * A bordered container for grouping related content.
 *
 * @example
 * <CometChatCard title="Statistics">Content here</CometChatCard>
 * <CometChatCard hoverable onClick={handleClick}>Clickable card</CometChatCard>
 */
interface CometChatCardProps extends AntCardProps {
  // All Ant Design Card props inherited automatically
}

/**
 * CometChat Card — bordered content containers.
 */
const CometChatCard: React.FC<CometChatCardProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <AntCard
      className={`cc-card ${className}`}
      {...rest}
    >
      {children}
    </AntCard>
  )
}

CometChatCard.displayName = 'CometChatCard'

export default CometChatCard
