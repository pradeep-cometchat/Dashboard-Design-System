import React, { forwardRef } from 'react'
import { Input as AntInput } from 'antd'
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input'
import formInfoIcon from '@assets/images/v2-dashboard/form-info.svg'
import './index.scss'

const { TextArea: AntTextArea } = AntInput

/**
 * CometChatTextArea — A multi-line text input matching the Figma design system.
 *
 * Supports all states: Placeholder, Filled, Focused, Disabled, Error (Destructive).
 * Can be used standalone or composed with label/hint via the `label`, `hintText`,
 * and `error` props.
 *
 * @example
 * // Simple standalone
 * <CometChatTextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 5 }} />
 *
 * // With label and hint
 * <CometChatTextArea label="Description" hintText="Max 500 characters" showCount maxLength={500} />
 *
 * // Error state
 * <CometChatTextArea label="JSON Data" error="Please enter valid JSON" />
 */
interface CometChatTextAreaProps extends Omit<AntTextAreaProps, 'status'> {
  /** Label displayed above the textarea */
  label?: React.ReactNode
  /** Whether the field is required (shows asterisk after label) */
  required?: boolean
  /** Help text shown as tooltip next to label */
  helpText?: string
  /** Hint text displayed below the textarea (hidden when error is present) */
  hintText?: string
  /** Error message — triggers destructive/error styling */
  error?: string
}

const CometChatTextArea = forwardRef<any, CometChatTextAreaProps>(({
  label,
  required = false,
  helpText,
  hintText,
  error,
  className = '',
  disabled = false,
  ...textAreaProps
}, ref) => {
  const hasError = !!error
  const stateClass = hasError ? 'cc-textarea-field-destructive' : ''
  const disabledClass = disabled ? 'cc-textarea-field-disabled' : ''

  return (
    <div className={`cc-textarea-field ${stateClass} ${disabledClass} ${className}`}>
      {label && (
        <div className="cc-textarea-field__label">
          <span className="cc-textarea-field__label-text">
            {label}
            {required && <span className="cc-textarea-field__label-required"> *</span>}
          </span>
          {helpText && (
            <span className="cc-textarea-field__label-help" title={helpText}>
              <img src={formInfoIcon} alt="info" />
            </span>
          )}
        </div>
      )}
      <AntTextArea
        ref={ref}
        className="cc-textarea-field__input"
        disabled={disabled}
        status={hasError ? 'error' : undefined}
        {...textAreaProps}
      />
      {hasError && (
        <div className="cc-textarea-field__error">{error}</div>
      )}
      {!hasError && hintText && (
        <div className="cc-textarea-field__hint">{hintText}</div>
      )}
    </div>
  )
})

CometChatTextArea.displayName = 'CometChatTextArea'
export default CometChatTextArea
