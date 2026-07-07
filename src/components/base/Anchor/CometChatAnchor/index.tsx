import React from 'react'
import { Anchor as AntAnchor, AnchorProps as AntAnchorProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Anchor.
 * A navigation component for scrolling to page sections.
 *
 * @example
 * <CometChatAnchor
 *   items={[
 *     { key: 'section1', href: '#section1', title: 'Section 1' },
 *     { key: 'section2', href: '#section2', title: 'Section 2' },
 *   ]}
 * />
 */
interface CometChatAnchorProps extends AntAnchorProps {
  // All Ant Design Anchor props inherited automatically
}

/**
 * CometChat Anchor — in-page section navigation.
 */
const CometChatAnchor: React.FC<CometChatAnchorProps> = ({
  className = '',
  ...rest
}) => {
  return (
    <AntAnchor
      className={`cc-anchor ${className}`}
      {...rest}
    />
  )
}

CometChatAnchor.displayName = 'CometChatAnchor'

export default CometChatAnchor
