import React from 'react'
import { Pagination as AntPagination } from 'antd'
import type { PaginationProps as AntPaginationProps } from 'antd'
import { CometChatButton } from 'components/base/Button'
import './index.scss'

/**
 * Layout container variant.
 * Source: Figma "Pagination" → Type variant.
 *
 * - `page` → "Page default" / "Page minimal" — sits below tables, with a top border
 * - `card` → "Card default" / "Card minimal" / "Card button group" — inside card footers
 */
export type PaginationVariant = 'page' | 'card'

/**
 * Visual content kind.
 * Source: Figma "Pagination" → Type variant (sub-pattern within page/card).
 *
 * - `default`      → Prev pill + numbered pages + Next pill
 * - `minimal`      → Numbered pages only, no prev/next pills
 * - `button-group` → "Page X of Y" + prev/next pills, no numbered pages
 */
export type PaginationKind = 'default' | 'minimal' | 'button-group'

/**
 * Alignment for the `card` variant. Ignored for `page` (always centered per Figma).
 */
export type PaginationAlign = 'default' | 'left' | 'center' | 'right'

/** Shape of the numbered page cells. Source: Figma `Shape` variant. */
export type PaginationShape = 'square' | 'circle'

/**
 * antd Pagination props that we expose directly.
 */
type AntPassthrough = Pick<
  AntPaginationProps,
  | 'showSizeChanger'
  | 'pageSizeOptions'
  | 'showQuickJumper'
  | 'showLessItems'
  | 'showTotal'
  | 'disabled'
  | 'hideOnSinglePage'
  | 'responsive'
  | 'locale'
>

export interface CometChatPaginationProps extends AntPassthrough {
  /** Current page (1-indexed) */
  current: number
  /** Total number of items */
  total: number
  /** Items per page. Defaults to 10. */
  pageSize?: number
  /** Page change handler */
  onChange?: (page: number, pageSize: number) => void
  /** Container variant. Defaults to `'page'` per Figma. */
  variant?: PaginationVariant
  /** Visual kind. Defaults to `'default'` per Figma. */
  kind?: PaginationKind
  /** Alignment (only for `card` variant). Defaults to `'default'`. */
  align?: PaginationAlign
  /** Page cell shape. Defaults to `'square'` per Figma. */
  shape?: PaginationShape
  /**
   * Wrap the entire pagination row in a single bordered, rounded box where
   * cells touch each other with right-border dividers. Matches Figma
   * "Pagination button group" (1114-69397). Defaults to `false`.
   */
  bordered?: boolean
  /** Custom label for the previous button. Defaults to `'Previous'`. */
  prevText?: React.ReactNode
  /** Custom label for the next button. Defaults to `'Next'`. */
  nextText?: React.ReactNode
  /** Additional CSS class for the root */
  className?: string
}

const ChevronLeftIcon: React.FC = () => (
  <span
    className="cc-pagination__icon cc-pagination__icon-left"
    aria-hidden="true"
  />
)

const ChevronRightIcon: React.FC = () => (
  <span
    className="cc-pagination__icon cc-pagination__icon-right"
    aria-hidden="true"
  />
)

/**
 * antd `itemRender` that:
 *   - hides antd's built-in prev/next (we render them as siblings via CometChatButton)
 *   - replaces the tiny default ellipsis with a 40×40 centered "…" so it
 *     visually sits on the page-cell baseline.
 *   - leaves number cells as antd defaults (re-styled via SCSS).
 */
const itemRender: NonNullable<AntPaginationProps['itemRender']> = (
  _page,
  type,
  originalElement,
) => {
  if (type === 'prev' || type === 'next') return null
  if (type === 'jump-prev' || type === 'jump-next') {
    return (
      <span className="cc-pagination__ellipsis" aria-hidden="true">
        …
      </span>
    )
  }
  return originalElement
}

/**
 * CometChatPagination — Dashboard base pagination component.
 *
 * Wraps antd's `Pagination` so we inherit its keyboard navigation, ellipsis
 * logic, size changer, quick jumper, localization, and ARIA semantics for free.
 *
 * Prev / Next are rendered as `CometChatButton` siblings (outside antd) so
 * they automatically follow the design-system button styles, including
 * disabled and hover states. antd's built-in prev/next are hidden via
 * `itemRender` returning `null`.
 *
 * The `kind="button-group"` variant has no equivalent in antd, so it renders
 * as custom DOM ("Page X of Y" + 2 CometChatButtons).
 *
 * Source of truth: Figma "❖ Dashboard – Design System (May 2026)" → Pagination
 * (nodes 225-7288, 1115:68622, 1114:69397).
 *
 * @example
 * <CometChatPagination current={page} total={250} pageSize={10} onChange={setPage} />
 */
const CometChatPagination: React.FC<CometChatPaginationProps> = ({
  current,
  total,
  pageSize = 10,
  onChange,
  variant = 'page',
  kind = 'default',
  align = 'default',
  shape = 'square',
  bordered = false,
  prevText = 'Previous',
  nextText = 'Next',
  className = '',
  disabled,
  ...antPassthrough
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safeCurrent = Math.min(Math.max(1, current), totalPages)
  const isFirst = safeCurrent <= 1
  const isLast = safeCurrent >= totalPages

  const goTo = (page: number) => {
    if (disabled) return
    if (page < 1 || page > totalPages || page === safeCurrent) return
    onChange?.(page, pageSize)
  }

  const rootClasses = [
    'cc-pagination',
    `cc-pagination-variant-${variant}`,
    `cc-pagination-kind-${kind}`,
    `cc-pagination-align-${align}`,
    `cc-pagination-shape-${shape}`,
    bordered ? 'cc-pagination-bordered' : '',
    disabled ? 'cc-pagination-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const prevButton = (
    <CometChatButton
      hierarchy="secondary"
      size="sm"
      onClick={() => goTo(safeCurrent - 1)}
      disabled={disabled || isFirst}
      iconLeading={<ChevronLeftIcon />}
      ariaLabel="Previous page"
      className="cc-pagination__btn-prev"
    >
      {prevText}
    </CometChatButton>
  )

  const nextButton = (
    <CometChatButton
      hierarchy="secondary"
      size="sm"
      onClick={() => goTo(safeCurrent + 1)}
      disabled={disabled || isLast}
      iconTrailing={<ChevronRightIcon />}
      ariaLabel="Next page"
      className="cc-pagination__btn-next"
    >
      {nextText}
    </CometChatButton>
  )

  // ============================================================
  // Kind: button-group — custom DOM, no antd Pagination underneath.
  // antd's `simple` mode shows an editable input, not a static
  // "Page X of Y" — so this variant is built from scratch.
  // ============================================================
  if (kind === 'button-group') {
    const pageInfo = (
      <span className="cc-pagination__page-info">
        Page {safeCurrent} of {totalPages}
      </span>
    )
    const buttons = (
      <div className="cc-pagination__button-group">
        {prevButton}
        {nextButton}
      </div>
    )

    return (
      <nav className={rootClasses} aria-label="Pagination">
        {align === 'left' ? (
          <>
            {buttons}
            {pageInfo}
          </>
        ) : (
          <>
            {pageInfo}
            {buttons}
          </>
        )}
      </nav>
    )
  }

  // ============================================================
  // Kind: default / minimal — wrap antd Pagination for the numbered
  // cells, render prev/next as CometChatButton siblings.
  // When `bordered`, wrap everything in a single rounded box so
  // alignment of the whole box is driven by `align`.
  // ============================================================
  const innerContent = (
    <>
      {kind === 'default' && prevButton}
      <AntPagination
        current={safeCurrent}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        itemRender={itemRender}
        disabled={disabled}
        {...antPassthrough}
      />
      {kind === 'default' && nextButton}
    </>
  )

  if (bordered) {
    return (
      <nav className={rootClasses} aria-label="Pagination">
        <div className="cc-pagination__bordered-box">{innerContent}</div>
      </nav>
    )
  }

  return (
    <nav className={rootClasses} aria-label="Pagination">
      {innerContent}
    </nav>
  )
}

CometChatPagination.displayName = 'CometChatPagination'

export default CometChatPagination
