import React from 'react'
import { Avatar as AntAvatar, AvatarProps as AntAvatarProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Avatar.
 * Displays a user or group avatar with image, icon, or text fallback.
 *
 * @example
 * <CometChatAvatar src="https://example.com/avatar.png" alt="John" />
 * <CometChatAvatar size={48} icon={<UserOutlined />} />
 * <CometChatAvatar>JD</CometChatAvatar>
 */
interface CometChatAvatarProps extends AntAvatarProps {
  // All Ant Design Avatar props inherited automatically
}

/**
 * CometChat Avatar — user and group profile images.
 */
const CometChatAvatar: React.FC<CometChatAvatarProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <AntAvatar
      className={`cc-avatar ${className}`}
      {...rest}
    >
      {children}
    </AntAvatar>
  )
}

CometChatAvatar.displayName = 'CometChatAvatar'

export default CometChatAvatar
