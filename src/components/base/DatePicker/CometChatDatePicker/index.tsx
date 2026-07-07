import React from 'react'
import { DatePicker as AntDatePicker } from 'antd'
import type { DatePickerProps as AntDatePickerProps } from 'antd'
// Dayjs type available via AntDatePickerProps
import './index.scss'

const { RangePicker } = AntDatePicker

/**
 * CometChat wrapper for antd DatePicker.
 * A date selection input with calendar popup.
 *
 * @example
 * <CometChatDatePicker onChange={handleDateChange} />
 * <CometChatDatePicker picker="month" />
 * <CometChatDatePicker.RangePicker onChange={handleRangeChange} />
 */
interface CometChatDatePickerProps extends Omit<AntDatePickerProps, 'className'> {
  /** Additional CSS class */
  className?: string
}

/**
 * CometChat DatePicker — date selection inputs.
 */
const CometChatDatePicker: React.FC<CometChatDatePickerProps> & {
  RangePicker: typeof RangePicker
} = ({
  className = '',
  ...rest
}) => {
  return (
    <AntDatePicker
      className={`cc-datepicker ${className}`}
      {...rest}
    />
  )
}

CometChatDatePicker.displayName = 'CometChatDatePicker'
CometChatDatePicker.RangePicker = RangePicker

export default CometChatDatePicker
