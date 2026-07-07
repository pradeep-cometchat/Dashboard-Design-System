import React, { forwardRef } from 'react'
import { Button as AntButton, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import './index.scss'

/** Hierarchy levels */
export type ButtonHierarchy = 'primary' | 'secondary' | 'tertiary' | 'link' | 'black';

/** Standard sizes */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Utility sizes (only valid when variant="utility") */
export type UtilityButtonSize = 'xs' | 'sm';

/** Special variant types */
export type SpecialVariant = 'utility' | 'close';

export interface ButtonProps {
  /** Visual hierarchy level */
  hierarchy?: ButtonHierarchy;
  /** Whether the button represents a destructive action */
  destructive?: boolean;
  /** Button size */
  size?: ButtonSize | UtilityButtonSize;
  /**
   * Icon rendered before the label.
   * - Pass a `ReactNode` (e.g. `<MyIcon />`, `<img />`) for arbitrary content.
   * - Pass a `string` (SVG URL, typically an `import` of an `.svg` file) and
   *   the button will render a recolorable mask-image span that follows the
   *   button's text color via `currentColor`. Sized 16/20/24 per `size`.
   */
  iconLeading?: React.ReactNode | string;
  /** Icon rendered after the label. Same accepted shapes as `iconLeading`. */
  iconTrailing?: React.ReactNode | string;
  /** Render as icon-only */
  iconOnly?: boolean;
  /** Text shown alongside spinner during loading state */
  loadingText?: string;
  /** Whether button is on a dark background (close variant only) */
  darkBackground?: boolean;
  /** Special variant type */
  variant?: SpecialVariant;
  /** Button label content */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** HTML button type attribute */
  htmlType?: 'button' | 'submit' | 'reset';
  /** Additional CSS class names */
  className?: string;
  /** Inline styles for the button */
  style?: React.CSSProperties;
  /** Accessible label (required for iconOnly) */
  ariaLabel?: string;
  /** React Router navigation path — renders as Link */
  to?: string;
  /** External URL — renders as anchor with target="_blank" */
  href?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip placement */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

/** Valid hierarchy values */
const VALID_HIERARCHIES: ButtonHierarchy[] = ['primary', 'secondary', 'tertiary', 'link', 'black'];
const VALID_SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

const CometChatButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    hierarchy: hierarchyProp,
    destructive = false,
    size: sizeProp,
    iconLeading,
    iconTrailing,
    iconOnly = false,
    loadingText,
    darkBackground = false,
    variant,
    children,
    onClick,
    disabled = false,
    loading = false,
    htmlType = 'button',
    className = '',
    style,
    ariaLabel,
    to,
    href,
    tooltip,
    tooltipPlacement = 'top',
  }, ref) => {

    // --- Resolve hierarchy ---
    let hierarchy: ButtonHierarchy = 'primary'
    if (hierarchyProp && VALID_HIERARCHIES.includes(hierarchyProp)) {
      hierarchy = hierarchyProp
    }

    // --- Resolve size ---
    let size: ButtonSize | UtilityButtonSize = 'md'
    if (sizeProp) {
      if (variant === 'utility' && (sizeProp === 'xs' || sizeProp === 'sm')) {
        size = sizeProp
      } else if (VALID_SIZES.includes(sizeProp as ButtonSize)) {
        size = sizeProp as ButtonSize
      }
    }

    // --- Build class names ---
    const classes: string[] = []

    if (variant === 'utility') {
      classes.push('cc-button-utility')
      classes.push(`cc-button-utility-${size}`)
      if (hierarchy === 'tertiary') classes.push('cc-button-utility-tertiary')
    } else if (variant === 'close') {
      classes.push('cc-button-close')
      if (darkBackground) classes.push('cc-button-close-dark')
    } else {
      classes.push(`cc-button-${hierarchy}`)
      classes.push(`cc-button-${size}`)
    }

    if (destructive) classes.push('cc-button-destructive')
    if (iconOnly) classes.push('cc-button-icon-only')
    if (className) classes.push(className)

    // --- Render content ---
    const renderContent = () => {
      if (loading) {
        return (
          <span className="cc-button__loading">
            <span className="cc-button__spinner" aria-hidden="true" />
            {loadingText && <span className="cc-button__loading-text">{loadingText}</span>}
          </span>
        )
      }

      // Resolve string SVG URLs into a recolorable mask-image span so
      // consumers can pass `iconLeading={editIconUrl}` and the icon
      // automatically follows the button's currentColor.
      const renderIcon = (icon: React.ReactNode | string) => {
        if (typeof icon === 'string') {
          return (
            <span
              className="cc-button__icon-mask"
              style={{ '--cc-icon-src': `url(${icon})` } as React.CSSProperties}
              aria-hidden="true"
            />
          )
        }
        return icon
      }

      if (iconOnly) {
        return <span className="cc-button__icon">{renderIcon(iconLeading || iconTrailing)}</span>
      }

      return (
        <span className="cc-button__content">
          {iconLeading && (
            <span className="cc-button__icon cc-button__icon-leading">{renderIcon(iconLeading)}</span>
          )}
          {children && <span className="cc-button__text">{children}</span>}
          {iconTrailing && (
            <span className="cc-button__icon cc-button__icon-trailing">{renderIcon(iconTrailing)}</span>
          )}
        </span>
      )
    }

    // --- Button element ---
    const buttonElement = (
      <AntButton
        type="default"
        htmlType={htmlType}
        onClick={disabled || loading ? undefined : onClick}
        disabled={disabled}
        style={style}
        className={classes.join(' ')}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        ref={ref}
      >
        {renderContent()}
      </AntButton>
    )

    // --- Link / Anchor wrapping ---
    let wrapped = buttonElement
    if (to) {
      wrapped = <Link to={to}>{buttonElement}</Link>
    } else if (href) {
      wrapped = <a href={href} target="_blank" rel="noopener noreferrer">{buttonElement}</a>
    }

    // --- Tooltip ---
    if (tooltip) {
      wrapped = <Tooltip title={tooltip} placement={tooltipPlacement}>{wrapped}</Tooltip>
    }

    return wrapped
  },
)

CometChatButton.displayName = 'CometChatButton'

export default CometChatButton
