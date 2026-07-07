import React, { forwardRef } from 'react'
import { Input as AntInput, InputProps as AntInputProps } from 'antd'
import formInfoIcon from '@assets/images/v2-dashboard/form-info.svg'
import './index.scss'

/**
 * CometChatInput — A standalone input component matching the Figma design system.
 *
 * Supports all states: Placeholder, Filled, Focused, Disabled, Error (Destructive).
 * Can be used standalone or composed with label/hint via the `label`, `hintText`,
 * and `error` props.
 *
 * @example
 * // Simple standalone
 * <CometChatInput placeholder="Search" prefix={<SearchOutlined />} />
 *
 * // With label and hint
 * <CometChatInput label="Email" hintText="We'll never share your email" placeholder="you@example.com" />
 *
 * // Error state
 * <CometChatInput label="Email" error="Please enter a valid email" value="invalid" />
 *
 * // With required asterisk and help icon
 * <CometChatInput label="Name" required helpText="Your display name" placeholder="John Doe" />
 */
interface CometChatInputProps extends Omit<AntInputProps, 'status'> {
  /** Input label displayed above the field */
  label?: React.ReactNode
  /** Whether the field is required (shows asterisk after label) */
  required?: boolean
  /** Help text shown as tooltip next to label */
  helpText?: string
  /** Hint text displayed below the input (hidden when error is present) */
  hintText?: string
  /** Error message — triggers destructive/error styling */
  error?: string
}

const CometChatInput = forwardRef<any, CometChatInputProps>(({
  label,
  required = false,
  helpText,
  hintText,
  error,
  className = '',
  disabled = false,
  ...inputProps
}, ref) => {
  const hasError = !!error
  const stateClass = hasError ? 'cc-input-field-destructive' : ''
  const disabledClass = disabled ? 'cc-input-field-disabled' : ''

  return (
    <div className={`cc-input-field ${stateClass} ${disabledClass} ${className}`}>
      {label && (
        <div className="cc-input-field__label">
          <span className="cc-input-field__label-text">
            {label}
            {required && <span className="cc-input-field__label-required"> *</span>}
          </span>
          {helpText && (
            <span className="cc-input-field__label-help" title={helpText}>
              <img src={formInfoIcon} alt="info" />
            </span>
          )}
        </div>
      )}
      <AntInput
        ref={ref}
        className="cc-input-field__input"
        disabled={disabled}
        status={hasError ? 'error' : undefined}
        {...inputProps}
      />
      {hasError && (
        <div className="cc-input-field__error">{error}</div>
      )}
      {!hasError && hintText && (
        <div className="cc-input-field__hint">{hintText}</div>
      )}
    </div>
  )
})

CometChatInput.displayName = 'CometChatInput'
export default CometChatInput
