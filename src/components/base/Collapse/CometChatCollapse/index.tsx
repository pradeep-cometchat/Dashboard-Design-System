import React from 'react'
import { Collapse as AntCollapse } from 'antd'
import type { CollapseProps as AntCollapseProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Collapse.
 * An accordion component for toggling content sections.
 *
 * @example
 * <CometChatCollapse
 *   items={[
 *     { key: '1', label: 'Section 1', children: <p>Content</p> },
 *     { key: '2', label: 'Section 2', children: <p>Content</p> },
 *   ]}
 * />
 */
// interface CollapseItem {
//   /** Unique key for the panel */
//   key: string | number
//   /** Panel header label */
//   label: React.ReactNode
//   /** Panel content */
//   children: React.ReactNode
//   /** Extra content in the panel header */
//   extra?: React.ReactNode
//   /** Whether the panel is disabled */
//   disabled?: boolean
// }

interface CometChatCollapseProps extends Omit<AntCollapseProps, 'className'> {
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat Collapse — expandable content sections.
 */
const CometChatCollapse: React.FC<CometChatCollapseProps> = ({
  items,
  activeKey,
  defaultActiveKey,
  accordion = false,
  bordered = true,
  onChange,
  size = 'middle',
  className = '',
  style,
  ...rest
}) => {
  return (
    <AntCollapse
      items={items}
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      accordion={accordion}
      bordered={bordered}
      onChange={onChange}
      size={size}
      className={`cc-collapse ${className}`}
      style={style}
      {...rest}
    />
  )
}

CometChatCollapse.displayName = 'CometChatCollapse'

export default CometChatCollapse
