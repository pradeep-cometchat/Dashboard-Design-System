import React from 'react'
import { Checkbox as AntCheckbox } from 'antd'
import type { CheckboxProps as AntCheckboxProps } from 'antd'
import './index.scss'

export type CheckboxSize = 'sm' | 'md';

export interface CometChatCheckboxProps extends Omit<AntCheckboxProps, 'size' | 'onChange' | 'className'> {
  /** Callback when checkbox state changes */
  onChange?: (checked: boolean) => void;
  /** Checkbox size */
  size?: CheckboxSize;
  /** Label text */
  label?: string;
  /** Supporting text below the label */
  supportingText?: string;
  /** Additional CSS class */
  className?: string;
  /** Accessible name */
  ariaLabel?: string;
}

const CometChatCheckbox: React.FC<CometChatCheckboxProps> = ({
  checked,
  defaultChecked,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  supportingText,
  className = '',
  ariaLabel,
  ...rest
}) => {
  const sizeClass = `cc-checkbox-${size}`
  const classes = ['cc-checkbox', sizeClass, className].filter(Boolean).join(' ')

  const handleChange = (e: any) => {
    onChange?.(e.target.checked)
  }

  // Only pass checked/defaultChecked — not both. Ant treats any `checked` prop as controlled mode.
  const checkboxProps: any = {
    indeterminate,
    onChange: handleChange,
    disabled,
    'aria-label': ariaLabel || label,
    ...rest,
  }

  if (checked !== undefined) {
    checkboxProps.checked = checked
  } else if (defaultChecked !== undefined) {
    checkboxProps.defaultChecked = defaultChecked
  }

  return (
    <div className={classes}>
      <AntCheckbox {...checkboxProps}>
        {(label || supportingText) && (
          <span className="cc-checkbox__text">
            {label && <span className="cc-checkbox__label">{label}</span>}
            {supportingText && <span className="cc-checkbox__supporting-text">{supportingText}</span>}
          </span>
        )}
      </AntCheckbox>
    </div>
  )
}

export default CometChatCheckbox
