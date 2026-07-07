import React from 'react'
import './index.scss'

/**
 * Size scale for the empty state.
 * Source: Figma "Empty state" component set → Size variant.
 */
export type EmptyStateSize = 'sm' | 'md' | 'lg'

/**
 * Visual treatment for the icon area.
 * Source: Figma "Empty state" component set → Icon variant.
 */
export type EmptyStateIconType =
  | 'featured-icon'
  | 'illustration'
  | 'file-type-icon'
  | 'folder-icon'

/**
 * Built-in illustration glyph (only applies when `iconType="illustration"`).
 * Source: Figma "Illustration" component set → Style variant.
 */
export type EmptyStateIllustration = 'cloud' | 'box' | 'documents' | 'credit-card'

export interface CometChatEmptyProps {
  /** Size scale. Defaults to `'sm'` per Figma. */
  size?: EmptyStateSize
  /** Visual treatment for the icon area. Defaults to `'featured-icon'` per Figma. */
  iconType?: EmptyStateIconType
  /** Built-in illustration to render when `iconType="illustration"`. Ignored if `icon` is provided. */
  illustration?: EmptyStateIllustration
  /** Custom icon node — overrides the built-in illustration / featured icon for the chosen `iconType`. */
  icon?: React.ReactNode
  /** Title text */
  title?: React.ReactNode
  /** Supporting description text */
  description?: React.ReactNode
  /** Primary action (right-most button). Receives a `<CometChatButton>` or any node. */
  primaryAction?: React.ReactNode
  /** Secondary action (left-most button). */
  secondaryAction?: React.ReactNode
  /** Custom actions slot — overrides `primaryAction` / `secondaryAction` when provided. */
  actions?: React.ReactNode
  /** Show the radial background pattern decorative behind the icon. Defaults to `true` per Figma. */
  showBackgroundPattern?: boolean
  /** Additional CSS class for the root */
  className?: string
}

/**
 * Renders the built-in illustration as a CSS-mask span so the SVG color
 * could follow `currentColor` if needed (Untitled UI illustrations are
 * multi-colored, so they render full-color via background-image, not mask).
 */
const renderIllustration = (style: EmptyStateIllustration) => (
  <span
    className={`cc-empty__illustration cc-empty__illustration-${style}`}
    aria-hidden="true"
  />
)

/**
 * CometChatEmpty — Dashboard base empty state component.
 *
 * Renders a centered icon + title + description + optional actions block,
 * sized and styled per the Figma "Empty state" component set.
 *
 * Source of truth: Figma "❖ Dashboard – Design System (May 2026)" → Empty states.
 *
 * @example
 * <CometChatEmpty
 *   size="md"
 *   iconType="illustration"
 *   illustration="cloud"
 *   title="No projects found"
 *   description="Your search did not match any projects. Please try again."
 *   primaryAction={<CometChatButton>New project</CometChatButton>}
 *   secondaryAction={<CometChatButton hierarchy="secondary">Clear search</CometChatButton>}
 * />
 */
const CometChatEmpty: React.FC<CometChatEmptyProps> = ({
  size = 'sm',
  iconType = 'featured-icon',
  illustration,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  actions,
  showBackgroundPattern = true,
  className = '',
}) => {
  let resolvedIcon: React.ReactNode = null
  if (icon !== undefined) {
    resolvedIcon = icon
  } else if (iconType === 'illustration' && illustration) {
    resolvedIcon = renderIllustration(illustration)
  }

  const hasActions = Boolean(actions || primaryAction || secondaryAction)

  const rootClasses = [
    'cc-empty',
    `cc-empty-size-${size}`,
    `cc-empty-icon-${iconType}`,
    showBackgroundPattern ? 'cc-empty-with-pattern' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClasses}>
      {showBackgroundPattern && (
        <div className="cc-empty__background-pattern" aria-hidden="true" />
      )}
      <div className="cc-empty__content">
        {resolvedIcon && <div className="cc-empty__icon">{resolvedIcon}</div>}
        {(title || description) && (
          <div className="cc-empty__text">
            {title && <div className="cc-empty__title">{title}</div>}
            {description && <div className="cc-empty__description">{description}</div>}
          </div>
        )}
      </div>
      {hasActions && (
        <div className="cc-empty__actions">
          {actions ?? (
            <>
              {secondaryAction}
              {primaryAction}
            </>
          )}
        </div>
      )}
    </div>
  )
}

CometChatEmpty.displayName = 'CometChatEmpty'

export default CometChatEmpty
