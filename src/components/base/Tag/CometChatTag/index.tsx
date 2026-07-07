import React from 'react'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import './index.scss'

export type TagSize = 'sm' | 'md' | 'lg';

export interface CometChatTagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'onChange'> {
  /** Tag text */
  children?: React.ReactNode;
  /** Size variant */
  size?: TagSize;
  /** Show close (X) button */
  closable?: boolean;
  /** Callback when close is clicked */
  onClose?: () => void;
  /** Avatar element rendered before text */
  avatar?: React.ReactNode;
  /** Show inline checkbox */
  checkbox?: boolean;
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Callback when checkbox state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Count badge number displayed after text */
  count?: number;
  /** Whether the tag is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

const CometChatTag: React.FC<CometChatTagProps> = ({
  children,
  size = 'md',
  closable = false,
  onClose,
  avatar,
  checkbox = false,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  count,
  disabled = false,
  className = '',
  ...rest
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  const handleCheckboxClick = () => {
    if (disabled) return
    const next = !isChecked
    if (controlledChecked === undefined) {
      setInternalChecked(next)
    }
    onCheckedChange?.(next)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.()
  }

  const classes = [
    'cc-tag',
    `cc-tag-${size}`,
    disabled ? 'cc-tag-disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={classes} {...rest}>
      {checkbox && (
        <button
          type="button"
          className={`cc-tag__checkbox ${isChecked ? 'cc-tag__checkbox-checked' : ''}`}
          onClick={handleCheckboxClick}
          disabled={disabled}
          aria-label={isChecked ? 'Deselect' : 'Select'}
          aria-pressed={isChecked}
        >
          {isChecked && <CheckOutlined />}
        </button>
      )}
      {avatar && <span className="cc-tag__avatar">{avatar}</span>}
      {children && <span className="cc-tag__text">{children}</span>}
      {count !== undefined && (
        <span className="cc-tag__count">{count}</span>
      )}
      {closable && (
        <button
          type="button"
          className="cc-tag__close"
          onClick={handleClose}
          disabled={disabled}
          aria-label="Remove"
        >
          <CloseOutlined />
        </button>
      )}
    </span>
  )
}

CometChatTag.displayName = 'CometChatTag'

export default CometChatTag
