import React from 'react'
import { Popconfirm as AntPopconfirm } from 'antd'
import type { PopconfirmProps as AntPopconfirmProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Popconfirm.
 * A confirmation popup before executing destructive actions.
 *
 * @example
 * <CometChatPopconfirm title="Delete this user?" onConfirm={handleDelete}>
 *   <button>Delete</button>
 * </CometChatPopconfirm>
 */
interface CometChatPopconfirmProps extends Omit<AntPopconfirmProps, 'overlayClassName'> {
  /** Element to wrap */
  children: React.ReactNode
}

/**
 * CometChat Popconfirm — destructive action confirmations.
 */
const CometChatPopconfirm: React.FC<CometChatPopconfirmProps> = ({
  children,
  okButtonProps,
  ...rest
}) => {
  return (
    <AntPopconfirm
      overlayClassName="cc-popconfirm"
      okButtonProps={{ danger: true, type: 'primary', ...okButtonProps }}
      {...rest}
    >
      {children}
    </AntPopconfirm>
  )
}

CometChatPopconfirm.displayName = 'CometChatPopconfirm'

export default CometChatPopconfirm
