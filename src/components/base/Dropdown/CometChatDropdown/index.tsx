import React from 'react'
import { Dropdown as AntDropdown } from 'antd'
import type { MenuProps, DropdownProps as AntDropdownProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Dropdown.
 * Displays a dropdown menu triggered by hover or click on a target element.
 *
 * @example
 * <CometChatDropdown
 *   items={[
 *     { key: '1', label: 'Edit' },
 *     { key: '2', label: 'Delete', danger: true },
 *   ]}
 * >
 *   <button>Actions</button>
 * </CometChatDropdown>
 */
interface CometChatDropdownProps extends Omit<AntDropdownProps, 'menu' | 'overlayClassName'> {
  /** Menu items to display (uses antd MenuProps['items'] type) */
  items?: MenuProps['items']
  /** Callback when a menu item is clicked */
  onClick?: MenuProps['onClick']
  /** Additional CSS class for the overlay */
  overlayClassName?: string
}

/**
 * CometChat Dropdown — action menus triggered by click/hover.
 */
const CometChatDropdown: React.FC<CometChatDropdownProps> = ({
  items,
  onClick,
  children,
  overlayClassName = '',
  ...rest
}) => {
  const menu: MenuProps = {
    items,
    onClick,
  }

  return (
    <AntDropdown
      menu={menu}
      overlayClassName={`cc-dropdown ${overlayClassName}`}
      {...rest}
    >
      {children}
    </AntDropdown>
  )
}

CometChatDropdown.displayName = 'CometChatDropdown'

export default CometChatDropdown
