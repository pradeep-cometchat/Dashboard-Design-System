import React from 'react'
import { Modal as AntModal } from 'antd'
import type { ModalProps as AntModalProps } from 'antd'
import { CometChatButton } from 'components/base/Button'
import './index.scss'

/** Header layout variants (Figma: _Modal header → Type) */
export type ModalHeaderAlign = 'left' | 'center' | 'horizontal'

/** Footer/actions layout variants (Figma: _Modal actions → Type) */
export type ModalActionsAlign = 'horizontal' | 'vertical' | 'horizontal-right'

/** Tone for the featured icon and primary action (Figma: tone drives icon bg + destructive flag) */
export type ModalTone = 'default' | 'success' | 'warning' | 'destructive'

/** Featured icon style (Figma: Featured icon vs Featured icon outline) */
export type ModalFeaturedIconStyle = 'circle' | 'square'

/** Built-in featured icon glyph (mapped to project SVG assets) */
export type ModalFeaturedIconName = 'check-circle' | 'alert-circle' | 'alert-triangle' | 'trash-01'

/**
 * Modal width preset, mapped 1:1 to Figma variants.
 *
 * | Size  | Width  | Figma variants (e.g.)                                    |
 * |-------|--------|---------------------------------------------------------|
 * | `sm`  | 400px  | Stacked left aligned, Warning, Destructive, Checkboxes  |
 * | `md`  | 480px  | Plan 01, File upload, Payment method, Profile settings  |
 * | `lg`  | 544px  | Horizontal, Warning horizontal, Destructive horizontal  |
 * | `xl`  | 640px  | Plan 02, Form 01, User settings, Centered video carousel|
 * | `2xl` | 688px  | Form 02, Appearance settings                            |
 * | `3xl` | 720px  | Text editor                                              |
 *
 * Pass `width` (number) to override with any custom value when the Figma
 * variant doesn't match these presets exactly (e.g. 408, 512, 548, 560).
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export interface CometChatModalProps
  extends Omit<
    AntModalProps,
    | 'className'
    | 'title'
    | 'closeIcon'
    | 'okText'
    | 'cancelText'
    | 'okButtonProps'
    | 'cancelButtonProps'
    | 'footer'
    | 'width'
  > {
  /** Modal title text shown in the header */
  title?: React.ReactNode
  /** Supporting text shown below the title */
  description?: React.ReactNode
  /** Header layout: stacked-left, stacked-center, or horizontal (icon inline with text) */
  headerAlign?: ModalHeaderAlign
  /** Featured icon node rendered in the header. Defaults to a tone-appropriate icon when `tone` is set. Pass `null` to hide. */
  featuredIcon?: React.ReactNode
  /** Override the built-in featured icon glyph by name (ignored when `featuredIcon` is provided) */
  featuredIconName?: ModalFeaturedIconName
  /** Featured icon container style: rounded circle (default) or rounded square (Figma "Featured icon outline") */
  featuredIconStyle?: ModalFeaturedIconStyle
  /** Tone of the featured icon and primary action button */
  tone?: ModalTone
  /** Show the X close button in the top-right of the header */
  showClose?: boolean
  /** Render a divider below the header */
  headerDivider?: boolean
  /** Render a divider above the footer */
  footerDivider?: boolean
  /** Footer/actions layout */
  actionsAlign?: ModalActionsAlign
  /** Primary action label */
  okText?: React.ReactNode
  /** Cancel action label */
  cancelText?: React.ReactNode
  /** Optional tertiary action label (Figma: "Tertiary button" toggle) */
  tertiaryText?: React.ReactNode
  /** Click handler for the tertiary action */
  onTertiary?: () => void
  /** Loading state for the primary action */
  okLoading?: boolean
  /** Disabled state for the primary action */
  okDisabled?: boolean
  /** Hide the cancel button */
  hideCancel?: boolean
  /** Hide the primary (ok) button */
  hideOk?: boolean
  /** Optional checkbox node rendered next to the actions (Figma: horizontal-right-aligned variant) */
  checkbox?: React.ReactNode
  /** Width preset — sm: 400, md: 480, lg: 544, xl: 640, 2xl: 688, 3xl: 720 */
  size?: ModalSize
  /** Custom width in pixels — overrides `size` for variants that don't match a preset (e.g., 408, 512, 548, 560) */
  width?: number
  /** Hide the entire footer */
  hideFooter?: boolean
  /** Additional CSS class for the modal root */
  className?: string
}

const SIZE_TO_WIDTH: Record<ModalSize, number> = {
  sm: 400,
  md: 480,
  lg: 544,
  xl: 640,
  '2xl': 688,
  '3xl': 720,
}

/**
 * Renders a tone-appropriate featured icon when none is provided.
 * Uses an empty span styled with CSS mask-image so the tone class can
 * color the icon via background-color.
 */
const renderDefaultFeaturedIcon = (
  tone: ModalTone,
  iconName?: ModalFeaturedIconName,
): React.ReactNode => {
  // Explicit name override wins
  if (iconName) {
    return (
      <span
        className={`cc-modal__featured-svg cc-modal__featured-svg-${iconName}`}
        aria-hidden="true"
      />
    )
  }
  switch (tone) {
    case 'success':
      return (
        <span
          className="cc-modal__featured-svg cc-modal__featured-svg-check-circle"
          aria-hidden="true"
        />
      )
    case 'warning':
      return (
        <span
          className="cc-modal__featured-svg cc-modal__featured-svg-alert-circle"
          aria-hidden="true"
        />
      )
    case 'destructive':
      return (
        <span
          className="cc-modal__featured-svg cc-modal__featured-svg-alert-triangle"
          aria-hidden="true"
        />
      )
    default:
      return null
  }
}

/**
 * CometChatModal — Dashboard base modal component.
 *
 * Wraps antd's Modal with the dashboard design-system states:
 * header layout (left / center / horizontal), tone (default / success / warning / destructive),
 * action layout (horizontal / vertical / horizontal-with-checkbox), and optional tertiary action.
 *
 * Source of truth: Figma "❖ Dashboard – Design System (May 2026)" → Modals.
 *
 * @example
 * <CometChatModal
 *   open={isOpen}
 *   tone="destructive"
 *   title="Delete account"
 *   description="Are you sure you want to delete your account? This cannot be undone."
 *   onOk={handleDelete}
 *   onCancel={handleCancel}
 *   okText="Delete"
 *   cancelText="Cancel"
 * />
 */
const CometChatModal: React.FC<CometChatModalProps> = ({
  title,
  description,
  children,
  headerAlign = 'left',
  featuredIcon,
  featuredIconName,
  featuredIconStyle = 'circle',
  tone = 'default',
  showClose = true,
  headerDivider = false,
  footerDivider = false,
  actionsAlign = 'horizontal',
  okText,
  cancelText,
  tertiaryText,
  onTertiary,
  okLoading = false,
  okDisabled = false,
  hideCancel = false,
  hideOk = false,
  checkbox,
  size = 'sm',
  width,
  hideFooter = false,
  className = '',
  open,
  onOk,
  onCancel,
  ...rest
}) => {
  const resolvedFeaturedIcon =
    featuredIcon !== undefined ? featuredIcon : renderDefaultFeaturedIcon(tone, featuredIconName)
  const hasFeaturedIcon = Boolean(resolvedFeaturedIcon)

  const rootClasses = [
    'cc-modal',
    `cc-modal-${size}`,
    `cc-modal-tone-${tone}`,
    `cc-modal-header-${headerAlign}`,
    `cc-modal-actions-${actionsAlign}`,
    `cc-modal-icon-${featuredIconStyle}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // --- Header ---
  const renderHeader = () => {
    if (!title && !description && !hasFeaturedIcon && !showClose) return null

    return (
      <div className="cc-modal__header">
        {hasFeaturedIcon && (
          <div className="cc-modal__featured-icon" aria-hidden="true">
            {resolvedFeaturedIcon}
          </div>
        )}
        <div className="cc-modal__header-content">
          {title && <div className="cc-modal__title">{title}</div>}
          {description && <div className="cc-modal__description">{description}</div>}
        </div>
        {showClose && (
          <button
            type="button"
            className="cc-modal__close"
            aria-label="Close"
            onClick={(e) => onCancel?.(e as React.MouseEvent<HTMLButtonElement>)}
          >
            <span className="cc-modal__close-icon" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }

  // --- Footer ---
  const renderFooter = () => {
    if (hideFooter) return null
    if (hideOk && hideCancel && !tertiaryText && !checkbox) return null

    const isDestructiveOk = tone === 'destructive'

    return (
      <div className="cc-modal__footer">
        {actionsAlign === 'horizontal-right' && checkbox && (
          <div className="cc-modal__footer-checkbox">{checkbox}</div>
        )}
        {tertiaryText && (
          <CometChatButton
            hierarchy="link"
            onClick={onTertiary}
            className="cc-modal__btn-tertiary"
          >
            {tertiaryText}
          </CometChatButton>
        )}
        <div className="cc-modal__footer-actions">
          {!hideCancel && (
            <CometChatButton
              hierarchy="secondary"
              onClick={(e) => onCancel?.(e as React.MouseEvent<HTMLButtonElement>)}
              className="cc-modal__btn-cancel"
            >
              {cancelText ?? 'Cancel'}
            </CometChatButton>
          )}
          {!hideOk && (
            <CometChatButton
              hierarchy={isDestructiveOk ? 'primary' : 'black'}
              destructive={isDestructiveOk}
              loading={okLoading}
              disabled={okDisabled}
              onClick={(e) => onOk?.(e as React.MouseEvent<HTMLButtonElement>)}
              className="cc-modal__btn-ok"
            >
              {okText ?? 'Confirm'}
            </CometChatButton>
          )}
        </div>
      </div>
    )
  }

  return (
    <AntModal
      open={open}
      onCancel={onCancel}
      width={width ?? SIZE_TO_WIDTH[size]}
      className={rootClasses}
      closable={false}
      footer={null}
      title={null}
      centered
      maskClosable
      {...rest}
    >
      {headerDivider ? (
        <>
          {renderHeader()}
          <div className="cc-modal__divider" />
        </>
      ) : (
        renderHeader()
      )}
      {children && <div className="cc-modal__body">{children}</div>}
      {footerDivider && !hideFooter && <div className="cc-modal__divider" />}
      {renderFooter()}
    </AntModal>
  )
}

CometChatModal.displayName = 'CometChatModal'

export default CometChatModal
