import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import './index.scss'

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor = 'brand' | 'gray' | 'error' | 'warning' | 'success' | 'info';
export type BadgeType = 'pill' | 'badge' | 'modern';

export interface CometChatBadgeProps {
  /** Badge text */
  children?: React.ReactNode;
  /** Size variant */
  size?: BadgeSize;
  /** Color variant */
  color?: BadgeColor;
  /** Shape type: pill (fully rounded), badge (slightly rounded), modern (white bg + border) */
  type?: BadgeType;
  /** Icon rendered before the text */
  iconLeading?: React.ReactNode;
  /** Icon rendered after the text */
  iconTrailing?: React.ReactNode;
  /** Show close (X) button */
  closable?: boolean;
  /** Callback when close is clicked */
  onClose?: () => void;
  /** Avatar element rendered before text */
  avatar?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

const CometChatBadge: React.FC<CometChatBadgeProps> = ({
  children,
  size = 'md',
  color = 'gray',
  type = 'pill',
  iconLeading,
  iconTrailing,
  closable = false,
  onClose,
  avatar,
  className = '',
  ...rest
}) => {
  const classes = [
    'cc-badge',
    `cc-badge-${size}`,
    `cc-badge-${color}`,
    `cc-badge-${type}`,
    className,
  ].filter(Boolean).join(' ')

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }

  return (
    <span className={classes} {...rest}>
      {avatar && <span className="cc-badge__avatar">{avatar}</span>}
      {iconLeading && <span className="cc-badge__icon">{iconLeading}</span>}
      {children && <span className="cc-badge__text">{children}</span>}
      {iconTrailing && <span className="cc-badge__icon">{iconTrailing}</span>}
      {closable && (
        <button type="button" className="cc-badge__close" onClick={handleClose} aria-label="Remove">
          <CloseOutlined />
        </button>
      )}
    </span>
  )
}

CometChatBadge.displayName = 'CometChatBadge'

export default CometChatBadge
