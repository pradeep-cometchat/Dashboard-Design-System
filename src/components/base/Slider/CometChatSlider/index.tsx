import React from 'react'
import { Slider as AntSlider } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Slider.
 * A draggable slider for selecting a value or range from a continuous set.
 *
 * @example
 * <CometChatSlider min={0} max={100} value={50} onChange={handleChange} />
 * <CometChatSlider range defaultValue={[20, 80]} />
 */
interface CometChatSliderProps {
  /** Current value (controlled) */
  value?: number | number[]
  /** Default value */
  defaultValue?: number | number[]
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Whether it's a range slider */
  range?: boolean
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Whether to show tooltip on hover */
  tooltip?: { open?: boolean; formatter?: (value?: number) => React.ReactNode }
  /** Callback when value changes */
  onChange?: (value: number | number[]) => void
  /** Callback when drag ends */
  onChangeComplete?: (value: number | number[]) => void
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * CometChat Slider — value selection via dragging.
 */
const CometChatSlider: React.FC<CometChatSliderProps> = ({
  className = '',
  ...rest
}) => {
  return (
    <AntSlider
      {...(rest as any)}
      className={`cc-slider ${className}`}
    />
  )
}

CometChatSlider.displayName = 'CometChatSlider'

export default CometChatSlider
