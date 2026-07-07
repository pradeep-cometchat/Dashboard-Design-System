import React from 'react'
import { Progress as AntProgress } from 'antd'
import type { ProgressProps as AntProgressProps } from 'antd'
import './index.scss'

/**
 * CometChat wrapper for antd Progress.
 * Displays a progress bar or circle to indicate completion status.
 * Styled to match Figma "Progress bar" and "Progress circle" components.
 *
 * @example
 * <CometChatProgress percent={75} />
 * <CometChatProgress type="circle" percent={50} size={80} />
 * <CometChatProgress percent={100} status="success" />
 */
interface CometChatProgressProps extends Omit<AntProgressProps, 'className'> {
  /** Label text displayed above the percentage inside circle */
  label?: string;
  /** Label text displayed below the circle (outside) */
  bottomLabel?: string;
  /** Additional CSS class */
  className?: string;
}

// Figma design tokens
const BRAND_PRIMARY = '#6852D6'
const TRAIL_COLOR = '#E9EAEB'

/**
 * CometChat Progress — completion indicators.
 */
const CometChatProgress: React.FC<CometChatProgressProps> = ({
  percent = 0,
  type = 'line',
  status,
  strokeColor,
  trailColor,
  strokeWidth,
  strokeLinecap = 'round',
  label,
  bottomLabel,
  format,
  className = '',
  style,
  ...rest
}) => {
  // Apply Figma defaults when no explicit colors/widths are provided
  const resolvedStrokeColor = strokeColor || (status ? undefined : BRAND_PRIMARY)
  const resolvedTrailColor = trailColor || TRAIL_COLOR
  const resolvedStrokeWidth = strokeWidth || (type === 'line' ? 8 : 10)

  // Build format function for circle/dashboard with label
  const resolvedFormat = format || (label && type !== 'line'
    ? (p?: number) => (
      <span className="cc-progress__inner">
        <span className="cc-progress__label">{label}</span>
        <span className="cc-progress__percent">{p}%</span>
      </span>
    )
    : undefined
  )

  return (
    <div className={`cc-progress-wrapper ${className}`}>
      <AntProgress
        percent={percent}
        type={type}
        status={status}
        strokeColor={resolvedStrokeColor}
        trailColor={resolvedTrailColor}
        strokeWidth={resolvedStrokeWidth}
        strokeLinecap={strokeLinecap}
        format={resolvedFormat}
        className="cc-progress"
        style={style}
        {...rest}
      />
      {bottomLabel && <span className="cc-progress__bottom-label">{bottomLabel}</span>}
    </div>
  )
}

CometChatProgress.displayName = 'CometChatProgress'

export default CometChatProgress
