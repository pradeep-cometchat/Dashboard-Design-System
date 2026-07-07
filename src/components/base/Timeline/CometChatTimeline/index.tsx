import React from 'react'
import { Timeline as AntTimeline } from 'antd'
import type { TimelineProps as AntTimelineProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Timeline.
 * Displays a vertical timeline of events or steps.
 *
 * @example
 * <CometChatTimeline
 *   items={[
 *     { children: 'Step 1: Create app' },
 *     { children: 'Step 2: Add users', color: 'green' },
 *     { children: 'Step 3: Send message', color: 'gray' },
 *   ]}
 * />
 */
interface CometChatTimelineProps extends Omit<AntTimelineProps, 'className'> {
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat Timeline — vertical event/step sequences.
 */
const CometChatTimeline: React.FC<CometChatTimelineProps> = ({
  className = '',
  ...rest
}) => {
  return (
    <AntTimeline
      className={`cc-timeline ${className}`}
      {...rest}
    />
  )
}

CometChatTimeline.displayName = 'CometChatTimeline'

export default CometChatTimeline
