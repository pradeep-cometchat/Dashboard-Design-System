import React from 'react'
import { Radio as AntRadio } from 'antd'
import type { RadioGroupProps as AntRadioGroupProps } from 'antd/es/radio'
import './index.scss'

export type RadioSize = 'sm' | 'md';

export interface CometChatRadioProps extends Omit<AntRadioGroupProps, 'size' | 'onChange' | 'className' | 'options'> {
  /** Callback when selection changes */
  onChange?: (value: string | number) => void;
  /** Radio size */
  size?: RadioSize;
  /** Radio options */
  options?: RadioOption[];
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Additional CSS class */
  className?: string;
}

export interface RadioOption {
  /** Option value */
  value: string | number;
  /** Label text */
  label: string;
  /** Supporting text below the label */
  supportingText?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

const CometChatRadio: React.FC<CometChatRadioProps> = ({
  value,
  defaultValue,
  onChange,
  disabled = false,
  size = 'md',
  options = [],
  direction = 'vertical',
  className = '',
  ...rest
}) => {
  const sizeClass = `cc-radio-${size}`
  const directionClass = `cc-radio-${direction}`
  const classes = ['cc-radio', sizeClass, directionClass, className].filter(Boolean).join(' ')

  const handleChange = (e: any) => {
    onChange?.(e.target.value)
  }

  // Only pass value or defaultValue — not both
  const groupProps: any = {
    onChange: handleChange,
    disabled,
    ...rest,
  }
  if (value !== undefined) {
    groupProps.value = value
  } else if (defaultValue !== undefined) {
    groupProps.defaultValue = defaultValue
  }

  return (
    <div className={classes}>
      <AntRadio.Group {...groupProps}>
        {options.map((option) => (
          <AntRadio key={option.value} value={option.value} disabled={option.disabled}>
            <span className="cc-radio__text">
              <span className="cc-radio__label">{option.label}</span>
              {option.supportingText && (
                <span className="cc-radio__supporting-text">{option.supportingText}</span>
              )}
            </span>
          </AntRadio>
        ))}
      </AntRadio.Group>
    </div>
  )
}

export default CometChatRadio
