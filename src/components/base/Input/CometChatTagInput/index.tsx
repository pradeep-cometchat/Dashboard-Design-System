import React, { forwardRef } from 'react'
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { CometChatTooltip } from 'components/base/Tooltip'
import './index.scss'

/**
 * CometChatTagInput — Free-form tag entry built on antd `Select mode="tags"`.
 *
 * Visual + state model mirrors `CometChatInput` (label, hint, error, disabled,
 * focus ring) so this component drops in next to other base inputs without
 * looking off-brand. Replaces the `react-tagsinput`-based `FormInputTag` for
 * design-system aware call sites.
 *
 * Behaviour parity with the legacy `FormInputTag`:
 *  - Add tag on Enter, blur, or paste (handled by antd Select tags mode)
 *  - Comma / newline / tab token separators
 *  - `onlyUnique` dedupe (default true)
 *  - `maxTags` hard cap (default 25)
 *  - Trims whitespace and drops empty tags
 *
 * @example
 * <CometChatTagInput
 *   label="Allowed types"
 *   placeholder="Add a Type"
 *   value={tags}
 *   onChange={setTags}
 *   maxTags={25}
 * />
 */
export interface CometChatTagInputProps
  extends Omit<AntSelectProps<string[]>, 'mode' | 'status' | 'children'> {
  /** Label text above the input */
  label?: React.ReactNode
  /** Whether the field is required (shows asterisk after label) */
  required?: boolean
  /** Help tooltip text (shows ? icon next to label) */
  helpText?: string
  /** Hint text below the input (hidden when error is present) */
  hintText?: string
  /** Error message — triggers destructive styling and replaces hint */
  error?: string
  /** Maximum number of tags allowed. Default: 25 */
  maxTags?: number
  /** Whether duplicate tags should be silently dropped. Default: true */
  onlyUnique?: boolean
  /** Custom token separators. Default: [',', '\n', '\t'] (Enter handled by antd) */
  tokenSeparators?: string[]
}

const DEFAULT_SEPARATORS = [',', '\n', '\t']

const CometChatTagInput = forwardRef<any, CometChatTagInputProps>(
  (
    {
      label,
      required = false,
      helpText,
      hintText,
      error,
      maxTags = 25,
      onlyUnique = true,
      tokenSeparators = DEFAULT_SEPARATORS,
      className = '',
      disabled = false,
      placeholder = 'Add a tag',
      value,
      onChange,
      options,
      ...rest
    },
    ref,
  ) => {
    const hasError = !!error
    const hasSuggestions = Array.isArray(options) && options.length > 0

    /**
     * Sanitises raw tag input from antd: trims whitespace, drops empties,
     * dedupes (when `onlyUnique`), and enforces `maxTags`.
     */
    const handleChange: NonNullable<AntSelectProps<string[]>['onChange']> = (next, option) => {
      const arr = Array.isArray(next) ? next : []
      const cleaned = arr
        .map(tag => (typeof tag === 'string' ? tag.trim() : tag))
        .filter((tag): tag is string => Boolean(tag))
      const deduped = onlyUnique ? Array.from(new Set(cleaned)) : cleaned
      const capped = deduped.slice(0, maxTags)
      onChange?.(capped, option)
    }

    const wrapperClassName = [
      'cc-tag-input',
      hasError ? 'cc-tag-input-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClassName}>
        {label && (
          <div className="cc-tag-input__label-wrapper">
            <span className="cc-tag-input__label">
              {label}
              {required && <span className="cc-tag-input__required"> *</span>}
            </span>
            {helpText && (
              <CometChatTooltip title={helpText}>
                <QuestionCircleOutlined className="cc-tag-input__help-icon" />
              </CometChatTooltip>
            )}
          </div>
        )}
        <AntSelect<string[]>
          ref={ref}
          mode="tags"
          className="cc-tag-input__input"
          popupClassName="cc-tag-input__dropdown"
          tokenSeparators={tokenSeparators}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          status={hasError ? 'error' : undefined}
          options={options}
          // Free-form tag entry has no use for the search/chevron suffix icon
          // (it only adds visual noise). Callers can still override via `rest`.
          suffixIcon={null}
          // When the caller hasn't supplied suggestion options the dropdown is
          // pure noise (just shows "No data"). Hide it visually but leave the
          // input fully interactive for free-form tag entry. Callers can opt
          // into a popup by passing their own `options`.
          dropdownStyle={hasSuggestions ? undefined : { display: 'none' }}
          notFoundContent={null}
          {...rest}
        />
        {(error || hintText) && (
          <span
            className={`cc-tag-input__hint ${hasError ? 'cc-tag-input__hint-error' : ''}`}
          >
            {error || hintText}
          </span>
        )}
      </div>
    )
  },
)

CometChatTagInput.displayName = 'CometChatTagInput'

export default CometChatTagInput
