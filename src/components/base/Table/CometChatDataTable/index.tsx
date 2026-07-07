import React from 'react'
import { Table } from 'antd'
import type { TableProps, TablePaginationConfig } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { CometChatPagination } from 'components/base/Pagination'
import type { CometChatPaginationProps } from 'components/base/Pagination/CometChatPagination'
import './index.scss'

// ============================================================
// Types
// ============================================================

export type DataTableSize = 'md' | 'sm'
export type DividerStyle = 'line' | 'alternating'

export interface CardHeaderConfig {
  /** Table title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Optional badge element next to the title */
  badge?: React.ReactNode
  /** Optional action buttons (right-aligned) */
  actions?: React.ReactNode
}

export interface CometChatDataTableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<TableProps<T>, 'size' | 'locale'> {
  /** Table density — controls header/body cell heights and padding. Default: 'md' */
  size?: DataTableSize
  /** Row separation style. Default: 'line' */
  dividerStyle?: DividerStyle
  /** Apply card-style container (border, shadow, radius). Default: true */
  appItemList?: boolean
  /** Switch pagination to minimal "Page X of Y" mode (shorthand for paginationProps={{ kind: 'button-group', align: 'right' }}) */
  hidePageNo?: boolean
  /**
   * Pass-through props to the underlying CometChatPagination footer.
   * Use this to override `kind`, `align`, `prevText`, `nextText`, `bordered`, etc.
   * Ignored when `pagination={false}`.
   */
  paginationProps?: Partial<CometChatPaginationProps>
  /** Show pointer cursor on row hover */
  highlightRow?: boolean
  /** Custom empty state text or element (used as Ant locale.emptyText) */
  emptyText?: string | React.ReactNode
  /** Custom empty state component (overrides emptyText, renders in dedicated area) */
  emptyState?: React.ReactNode
  /** Card header configuration */
  cardHeader?: CardHeaderConfig
  /** Filters bar content rendered between header and table */
  filtersBar?: React.ReactNode
  /** Row click callback */
  onRowClick?: (record: T, index: number) => void
  /** Which column index gets heavier font weight (-1 or null to disable). Default: 0 */
  primaryColumnIndex?: number | null
  /** Ant Design locale override */
  locale?: TableProps<T>['locale']
}

// ============================================================
// Card Header Sub-component
// ============================================================

const DataTableCardHeader: React.FC<CardHeaderConfig> = ({ title, description, badge, actions }) => (
  <div className="cc-data-table__header">
    <div className="cc-data-table__header-content">
      <div className="cc-data-table__header-text">
        <div className="cc-data-table__header-title-row">
          <h3 className="cc-data-table__header-title">{title}</h3>
          {badge && <span className="cc-data-table__header-badge">{badge}</span>}
        </div>
        {description && <p className="cc-data-table__header-desc">{description}</p>}
      </div>
      {actions && <div className="cc-data-table__header-actions">{actions}</div>}
    </div>
    <div className="cc-data-table__header-divider" />
  </div>
)

// ============================================================
// Main Component
// ============================================================

/**
 * CometChatDataTable — Design-system-compliant data table.
 *
 * Wraps Ant Design's Table with proper Figma design token styling,
 * optional card header, filters bar, and empty state slots.
 *
 * @example
 * <CometChatDataTable
 *   dataSource={roles}
 *   columns={columns}
 *   loading={areRolesLoading}
 *   pagination={pagination}
 *   onChange={handleTableChange}
 * />
 */
function CometChatDataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  size = 'md',
  dividerStyle = 'line',
  appItemList = true,
  hidePageNo = false,
  paginationProps,
  highlightRow = false,
  emptyText,
  emptyState,
  cardHeader,
  filtersBar,
  onRowClick,
  primaryColumnIndex = 0,
  loading,
  dataSource,
  columns,
  pagination,
  className,
  rowClassName: rowClassNameProp,
  locale,
  ...restTableProps
}: CometChatDataTableProps<T>) {
  // --- Container classes ---
  const hasPrimaryColumn = primaryColumnIndex != null && primaryColumnIndex >= 0
  const containerClasses = classNames('cc-data-table', {
    'cc-data-table-sm': size === 'sm',
    'cc-data-table-alternating': dividerStyle === 'alternating',
    'cc-data-table-highlight': highlightRow,
    'cc-data-table-no-container': !appItemList,
    'cc-data-table-no-pagination': pagination === false,
    'cc-data-table-hide-page-no': hidePageNo,
  }, className)

  // --- Primary column transformation ---
  const transformedColumns = React.useMemo(() => {
    if (!columns) return columns
    return columns.map((col, index) => {
      if (hasPrimaryColumn && index === primaryColumnIndex) {
        return {
          ...col,
          className: classNames('cc-data-table__col-primary', (col as Record<string, unknown>).className as string | undefined),
        }
      }
      return col
    })
  }, [columns, hasPrimaryColumn, primaryColumnIndex])

  // --- Loading config ---
  const loadingConfig = loading
    ? { indicator: <LoadingOutlined style={{ fontSize: 24 }} spin /> }
    : false

  // --- Locale / empty state ---
  let tableLocale = locale
  if (emptyState) {
    tableLocale = { emptyText: <div className="cc-data-table__empty">{emptyState}</div> }
  } else if (emptyText) {
    tableLocale = { emptyText, ...locale }
  }

  // --- Row click handler ---
  const onRow = onRowClick
    ? (record: T, index?: number) => ({
        onClick: () => onRowClick(record, index ?? 0),
      })
    : undefined

  // --- Pagination ---
  // We always render the antd Table without its own pagination, and render
  // CometChatPagination underneath instead. This keeps the footer matching
  // Figma's pagination DS (right-aligned button group, etc.) without ad-hoc
  // SCSS overrides on antd internals.
  // Pull `onChange` out of the props we forward to antd Table: this component
  // fully owns the change contract and synthesizes onChange calls from the
  // custom pagination footer below. Leaving it in restTableProps would also
  // bind it to antd's native sort/filter onChange, double-firing for consumers.
  const { onChange, ...tableProps } = restTableProps
  const paginationFooter = React.useMemo(() => {
    if (pagination === false) return null
    const cfg: TablePaginationConfig =
      typeof pagination === 'object' && pagination !== null ? pagination : {}
    const pageSize = cfg.pageSize ?? 10
    const total = cfg.total ?? (Array.isArray(dataSource) ? dataSource.length : 0)
    const current = cfg.current ?? 1
    if (cfg.hideOnSinglePage && total <= pageSize) return null

    const handleChange = (nextPage: number, nextPageSize: number) => {
      const nextPagination: TablePaginationConfig = {
        ...cfg,
        current: nextPage,
        pageSize: nextPageSize,
      }
      // Forward via antd Table's onChange signature so existing consumers
      // (e.g. RolesList's handleTableChange) keep working unchanged.
      onChange?.(nextPagination, {}, { columnKey: undefined, order: undefined }, {
        currentDataSource: Array.isArray(dataSource) ? (dataSource as T[]) : [],
        action: 'paginate',
      })
    }

    const variantDefaults: Partial<CometChatPaginationProps> = hidePageNo
      ? { variant: 'card', kind: 'button-group', align: 'right' }
      : {}

    return (
      <CometChatPagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={handleChange}
        {...variantDefaults}
        {...paginationProps}
      />
    )
  }, [pagination, dataSource, onChange, hidePageNo, paginationProps])

  // --- Row class name (category rows + consumer override) ---
  const rowClassName = (record: T, index: number, indent: number) => {
    let categoryClass = ''
    if ((record as Record<string, unknown>).isCategory) {
      categoryClass = 'cc-data-table__row-category'
    } else if ((record as Record<string, unknown>).isSubCategory) {
      categoryClass = 'cc-data-table__row-subcategory'
    }

    const consumerClass = typeof rowClassNameProp === 'function'
      ? rowClassNameProp(record, index, indent)
      : rowClassNameProp || ''

    return classNames(categoryClass, consumerClass)
  }

  return (
    <div className={containerClasses}>
      {cardHeader && <DataTableCardHeader {...cardHeader} />}
      {filtersBar && <div className="cc-data-table__filters">{filtersBar}</div>}
      <Table<T>
        dataSource={dataSource}
        columns={transformedColumns}
        loading={loadingConfig}
        pagination={false}
        locale={tableLocale}
        onRow={onRow}
        rowClassName={rowClassName}
        {...tableProps}
      />
      {paginationFooter && (
        <div className="cc-data-table__pagination-footer">{paginationFooter}</div>
      )}
    </div>
  )
}

CometChatDataTable.displayName = 'CometChatDataTable'

export default CometChatDataTable
