import React from 'react'
import { Tabs as AntTabs } from 'antd'
import type { TabsProps as AntTabsProps } from 'antd'
import './index.scss'

/**
 * Tab orientation. Horizontal = row of tabs, vertical = column.
 * Source: Figma "Horizontal tabs" / "Vertical tabs" component sets.
 */
export type TabsOrientation = 'horizontal' | 'vertical'

/**
 * Visual style of the tabs.
 *
 * Horizontal valid: `underline` | `button-border` | `button-minimal`
 * Vertical valid:   `button-gray` | `line` | `button-border` | `button-minimal`
 *
 * Pick a value compatible with the chosen `orientation`. Mismatched values
 * fall back to the orientation's Figma `defaultValue` style.
 */
export type TabsType =
  | 'underline'
  | 'button-border'
  | 'button-minimal'
  | 'button-gray'
  | 'line'

/**
 * Tab size scale.
 * - Horizontal: only `sm` is valid in Figma.
 * - Vertical: `sm` and `md`.
 */
export type TabsSize = 'sm' | 'md'

export interface CometChatTabsProps
  extends Omit<AntTabsProps, 'className' | 'tabPosition' | 'type' | 'size'> {
  /** Orientation. Defaults to `'horizontal'`. */
  orientation?: TabsOrientation
  /**
   * Visual style. Defaults follow Figma:
   * - horizontal → `'underline'`
   * - vertical → `'button-gray'`
   */
  type?: TabsType
  /** Size scale. Defaults to `'sm'`. Only `'md'` is valid for vertical. */
  size?: TabsSize
  /** Make horizontal tabs stretch to fill the container. Ignored for vertical. */
  fullWidth?: boolean
  /**
   * Show the 1px container rule line under the tabs row.
   * Only applies to horizontal `type="underline"`. Defaults to `true`.
   */
  showBottomRule?: boolean
  /** Additional CSS class for the tabs root */
  className?: string
}

const HORIZONTAL_DEFAULT_TYPE: TabsType = 'underline'
const VERTICAL_DEFAULT_TYPE: TabsType = 'button-gray'

const HORIZONTAL_VALID_TYPES: TabsType[] = ['underline', 'button-border', 'button-minimal']
const VERTICAL_VALID_TYPES: TabsType[] = ['button-gray', 'line', 'button-border', 'button-minimal']

/**
 * Resolve the type for the given orientation. If the caller passed a type
 * that isn't valid for the chosen orientation, fall back to the Figma default.
 */
const resolveType = (orientation: TabsOrientation, type?: TabsType): TabsType => {
  if (orientation === 'horizontal') {
    if (type && HORIZONTAL_VALID_TYPES.includes(type)) return type
    return HORIZONTAL_DEFAULT_TYPE
  }
  if (type && VERTICAL_VALID_TYPES.includes(type)) return type
  return VERTICAL_DEFAULT_TYPE
}

/**
 * CometChatTabs — Dashboard base tabs component.
 *
 * Wraps antd's Tabs with the dashboard design-system states from Figma:
 * orientation (horizontal / vertical), type (5 styles, valid set depends on
 * orientation), size, full-width (horizontal only), and the underline bottom rule.
 *
 * Source of truth: Figma "❖ Dashboard – Design System (May 2026)" → Tabs.
 *
 * @example
 * <CometChatTabs
 *   orientation="horizontal"
 *   type="underline"
 *   defaultActiveKey="general"
 *   items={[
 *     { key: 'general', label: 'General', children: <General /> },
 *     { key: 'billing', label: 'Billing', children: <Billing /> },
 *   ]}
 * />
 */
const CometChatTabs: React.FC<CometChatTabsProps> = ({
  orientation = 'horizontal',
  type,
  size = 'sm',
  fullWidth = false,
  showBottomRule = true,
  className = '',
  ...rest
}) => {
  const resolvedType = resolveType(orientation, type)

  const classes = [
    'cc-tabs',
    `cc-tabs-${orientation}`,
    `cc-tabs-type-${resolvedType}`,
    `cc-tabs-size-${size}`,
    fullWidth && orientation === 'horizontal' ? 'cc-tabs-full-width' : '',
    orientation === 'horizontal' && resolvedType === 'underline' && showBottomRule
      ? 'cc-tabs-show-bottom-rule'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AntTabs
      className={classes}
      tabPosition={orientation === 'vertical' ? 'left' : 'top'}
      {...rest}
    />
  )
}

CometChatTabs.displayName = 'CometChatTabs'

export default CometChatTabs
