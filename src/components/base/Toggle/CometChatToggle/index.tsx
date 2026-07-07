import React from 'react'
import { Switch, SwitchProps as AntSwitchProps, Tooltip } from 'antd'
import './index.scss'

export type ToggleSize = 'sm' | 'md';

export interface CometChatToggleProps extends Omit<AntSwitchProps, 'size' | 'className'> {
  /** Toggle size */
  size?: ToggleSize;
  /** Label text displayed next to the toggle */
  label?: string;
  /** Supporting text displayed below the label */
  supportingText?: string;
  /** Tooltip message on hover */
  tooltip?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Additional CSS class */
  className?: string;
}

const CometChatToggle: React.FC<CometChatToggleProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  supportingText,
  tooltip,
  ariaLabel,
  className = '',
  ...rest
}) => {
  const sizeClass = `cc-toggle-${size}`
  const classes = ['cc-toggle', sizeClass, className].filter(Boolean).join(' ')

  const toggle = (
    <Switch
      className={classes}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      size={size === 'sm' ? 'small' : 'default'}
      aria-label={ariaLabel}
      {...rest}
    />
  )

  const hasText = label || supportingText

  const content = hasText ? (
    <div className={`cc-toggle__wrapper cc-toggle__wrapper-${size}`}>
      {toggle}
      <div className="cc-toggle__text">
        {label && <span className="cc-toggle__label">{label}</span>}
        {supportingText && <span className="cc-toggle__supporting-text">{supportingText}</span>}
      </div>
    </div>
  ) : (
    toggle
  )

  if (tooltip) {
    return <Tooltip title={tooltip}>{content}</Tooltip>
  }

  return content
}

export default CometChatToggle
