import React from 'react'
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { CometChatTooltip } from 'components/base/Tooltip'
import './index.scss'

export interface CometChatSelectProps extends AntSelectProps {
  /** Label text above the select */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Help tooltip text (shows ? icon next to label) */
  helpText?: string;
  /** Hint text below the select */
  hintText?: string;
  /** Error message (replaces hint, shows destructive state) */
  error?: string;
}

const CometChatSelect: React.FC<CometChatSelectProps> = ({
  label,
  required = false,
  helpText,
  hintText,
  error,
  className = '',
  children,
  ...rest
}) => {
  const hasError = !!error

  return (
    <div className={`cc-select ${hasError ? 'cc-select-error' : ''} ${className}`}>
      {label && (
        <div className="cc-select__label-wrapper">
          <span className="cc-select__label">
            {label}
            {required && <span className="cc-select__required">*</span>}
          </span>
          {helpText && (
            <CometChatTooltip title={helpText}>
              <QuestionCircleOutlined className="cc-select__help-icon" />
            </CometChatTooltip>
          )}
        </div>
      )}
      <AntSelect
        {...rest}
        status={hasError ? 'error' : rest.status}
        className="cc-select__input"
        popupClassName="cc-select__input-dropdown"
      >
        {children}
      </AntSelect>
      {(error || hintText) && (
        <span className={`cc-select__hint ${hasError ? 'cc-select__hint-error' : ''}`}>
          {error || hintText}
        </span>
      )}
    </div>
  )
}

CometChatSelect.displayName = 'CometChatSelect'

export default CometChatSelect
