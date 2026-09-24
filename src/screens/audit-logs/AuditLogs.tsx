// Audit Logs screen — Account → Application → Audit Logs, built to the Linear
// Feature Narrative ("Dashboard Audit Logs", P-ENG-362): Stripe-style table,
// Filter button with purple active-count badge toggling filter chips, Export
// (CSV / JSON), 400px side panel, plan-gated
// and empty states. Shares the dashboard shell with Screens/Pin. Table visual
// follows the May 2026 Tables spec (Figma OIMLZzuzLmG7mdPKYJyglX, 1227:110480)
// on the base CometChatDataTable. Foundation tokens + base components only.
import React from "react";
import type { ColumnsType } from "antd/es/table";
import { CometChatDataTable } from "components/base/Table";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatDropdown from "components/base/Dropdown/CometChatDropdown";
import CometChatTooltip from "components/base/Tooltip/CometChatTooltip";
import CometChatEmpty from "components/base/Empty/CometChatEmpty";
import { c, s, r, font, shadow } from "../theme";
import { DashboardFrame, Icon, dim } from "../pin/ui";
// Filter glyph shared with Conversation Explorer (Untitled UI "filter-lines", May 2026 library).
import { FilterLines } from "../conversation-explorer/icons";
import { buildEvents, actionLabel, memberFor, resourceLabel, type AuditEvent } from "./data";
import { CellText, ActionBadge, ActorAvatar, OutcomeBadge, RoleBadge, SourceBadge, formatDate, formatTime, viewerTimeZone } from "./cells";
import { FilterBar, EMPTY_FILTERS, activeFilterCount, applyFilters, type Filters } from "./filters";
import AuditDetailPanel from "./AuditDetailPanel";
import { downloadExport, type ExportFormat } from "./export";
import "./audit-logs.scss";

export type AuditLogsVariant = "empty" | "gated" | "enterprise";

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

const PAGE_SIZE = 10;
const APP_ID = "240998CGSF2026";

/* ---------------- table ---------------- */

type Row = AuditEvent & Record<string, unknown>;

/** Column header with a help tooltip (Feature Narrative: tooltips explaining each column). */
function Head({ label, help }: { label: string; help: string }) {
  return (
    <CometChatTooltip title={help} placement="top">
      <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs }}>
        {label}
        <Icon name="info" size={dim.iconXs} color={c.textQuaternary} />
      </span>
    </CometChatTooltip>
  );
}

function buildColumns(): ColumnsType<Row> {
  return [
    {
      title: <Head label="Actor" help="The team member who performed the action." />,
      key: "actor",
      width: "24.2%",
      render: (_, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: s.md, minWidth: 0 }}>
          {/* 40px (dim.avatar). Photo and name come from the team list — the API only sends the email. */}
          <ActorAvatar email={row.actor.email} size={dim.avatar} />
          {memberFor(row.actor.email) ? (
            <CellText lead={memberFor(row.actor.email)!.name} supporting={row.actor.email} />
          ) : (
            <CellText lead={row.actor.email} supporting="No longer on this team" />
          )}
        </div>
      ),
    },
    {
      // Neutral chip — same gray pill as the "Dashboard" source chip.
      title: <Head label="Role" help="The team member's role on this app when the action happened." />,
      key: "role",
      width: "9.9%",
      render: (_, row) => <RoleBadge role={row.actor.role} />,
    },
    {
      title: <Head label="Action" help="What was done — updated, created, deleted, enabled, disabled, logged in." />,
      key: "action",
      width: "9.6%",
      render: (_, row) => <ActionBadge event={row} />,
    },
    {
      title: <Head label="Resource" help="What was affected: the dashboard section and the item that changed." />,
      key: "resource",
      render: (_, row) => <CellText lead={resourceLabel(row)} supporting={actionLabel(row.action)} />,
    },
    {
      title: <Head label="Source" help="How the action was performed: the Dashboard UI or the Management API." />,
      key: "source",
      width: "10%",
      render: (_, row) => <SourceBadge source={row.source} />,
    },
    {
      title: <Head label={`Timestamp (${viewerTimeZone()})`} help="When the action happened, shown in your local timezone. Stored in UTC." />,
      key: "timestamp",
      width: "18%",
      render: (_, row) => <CellText lead={formatDate(row.timestamp)} supporting={formatTime(row.timestamp)} />,
    },
    {
      title: <Head label="Outcome" help="Whether the action succeeded or failed." />,
      key: "outcome",
      width: "9.5%",
      render: (_, row) => <OutcomeBadge outcome={row.outcome} />,
    },
  ];
}

/**
 * Previous / Next paging (ENG-39587: the API returns no total count). sm buttons take 16px icons.
 * Grouped right, $spacing-xl (16px) apart.
 */
function CursorPagination({ hasPrev, hasNext, onPrev, onNext }: { hasPrev: boolean; hasNext: boolean; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="cc-data-table__pagination-footer" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: s.xl }}>
      <CometChatButton hierarchy="secondary" size="sm" disabled={!hasPrev} onClick={onPrev} iconLeading={<Icon name="arrow-back" size={dim.iconXs} />}>
        Previous
      </CometChatButton>
      <CometChatButton hierarchy="secondary" size="sm" disabled={!hasNext} onClick={onNext} iconTrailing={<Icon name="arrow-forward" size={dim.iconXs} />}>
        Next
      </CometChatButton>
    </div>
  );
}

function AuditTable({
  entries,
  selectedId,
  onSelect,
  noResults,
  hidePagination = false,
  fill = false,
}: {
  entries: AuditEvent[];
  selectedId: string | null;
  onSelect: (entry: AuditEvent) => void;
  noResults: React.ReactNode;
  /** The gated preview shows sample rows only. */
  hidePagination?: boolean;
  /**
   * Stretch the card to the bottom of the page, so its height doesn't change from page to page.
   * With rows: rows keep their height at the top and the Previous / Next footer is pinned to the
   * card's bottom. Without rows: the empty row takes the space and its message centres.
   */
  fill?: boolean;
}) {
  const [page, setPage] = React.useState(0);
  // Filters change the result set; always land back on the first page.
  React.useEffect(() => setPage(0), [entries]);
  const columns = React.useMemo(() => buildColumns(), []);
  const rows: Row[] = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((row) => ({ ...row, key: row.externalId }));
  // A full page can be taller than the viewport; remember its height so a short last page
  // keeps the same card height (and the Previous / Next footer stays put) on small screens too.
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [fullPageHeight, setFullPageHeight] = React.useState(0);
  React.useLayoutEffect(() => {
    if (fill && rows.length === PAGE_SIZE && cardRef.current) {
      const h = cardRef.current.offsetHeight;
      setFullPageHeight((prev) => Math.max(prev, h));
    }
  }, [fill, rows.length, page, entries]);
  return (
    <div
      ref={cardRef}
      className={!fill ? "cc-audit-table" : rows.length > 0 ? "cc-audit-table cc-audit-table--pinned" : "cc-audit-table cc-audit-table--fill"}
      style={{ background: c.bgPrimary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, boxShadow: shadow.xs, overflow: "hidden", minHeight: fill && fullPageHeight ? fullPageHeight : undefined, boxSizing: "border-box" }}
    >
      <CometChatDataTable<Row>
        appItemList={false}
        pagination={false}
        primaryColumnIndex={null}
        // Pointer cursor only when there are rows to open — not on the empty-state row.
        highlightRow={rows.length > 0}
        tableLayout="fixed"
        columns={columns}
        dataSource={rows}
        onRowClick={(row) => onSelect(row)}
        rowClassName={(row) => (row.externalId === selectedId ? "cc-audit-table__row-selected" : "")}
        emptyState={noResults}
      />
      {entries.length > 0 && !hidePagination && (
        <CursorPagination
          hasPrev={page > 0}
          hasNext={(page + 1) * PAGE_SIZE < entries.length}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </div>
  );
}

/* ---------------- header ---------------- */

/** Filter button with the purple active-count badge. */
function FilterButton({ count, open, disabled, onClick }: { count: number; open: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <CometChatButton hierarchy="secondary" disabled={disabled} onClick={onClick} iconLeading={<FilterLines size={dim.iconSm} />} aria-expanded={open}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: s.md }}>
        Filter
        {count > 0 && (
          <span
            style={{
              ...font.caption,
              fontWeight: w.semibold as unknown as number,
              color: c.white,
              background: c.brand,
              borderRadius: r.full,
              minWidth: dim.iconSm,
              height: dim.iconSm,
              padding: `0 ${s.sm}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </span>
        )}
      </span>
    </CometChatButton>
  );
}

/** Export — the header's primary (black) action, right-most. */
function ExportButton({ disabled, onExport }: { disabled: boolean; onExport: (format: ExportFormat) => void }) {
  return (
    <CometChatDropdown
      trigger={["click"]}
      disabled={disabled}
      placement="bottomRight"
      items={[
        { key: "csv", label: "Download CSV" },
        { key: "json", label: "Download JSON" },
      ]}
      onClick={({ key }) => onExport(key as ExportFormat)}
    >
      <CometChatButton hierarchy="black" disabled={disabled} iconLeading={<Icon name="download" size={dim.iconSm} />} iconTrailing={<Icon name="keyboard-arrow-down" size={dim.iconSm} />}>
        Export
      </CometChatButton>
    </CometChatDropdown>
  );
}

function PageHeader({ actions }: { actions: React.ReactNode }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.xl, minHeight: dim.avatar }}>
      <div style={{ display: "flex", flexDirection: "column", gap: s.xxs }}>
        <h1 style={{ ...font.pageTitle, fontWeight: w.semibold as unknown as number, color: c.textPrimary, margin: 0 }}>Audit Logs</h1>
        <p style={{ ...font.body, color: c.textTertiary, margin: 0 }}>Track all actions performed on this app</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: s.lg }}>{actions}</div>
    </header>
  );
}

/* ---------------- enterprise ---------------- */

function EnterpriseView() {
  const entries = React.useMemo(() => buildEvents(), []);
  const [filters, setFilters] = React.useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<AuditEvent | null>(null);

  const filtered = React.useMemo(() => applyFilters(entries, filters), [entries, filters]);
  const count = activeFilterCount(filters);

  return (
    <>
      <PageHeader
        actions={
          <>
            <FilterButton count={count} open={filtersOpen} disabled={false} onClick={() => setFiltersOpen((o) => !o)} />
            <ExportButton disabled={filtered.length === 0} onExport={(format) => downloadExport(filtered, format, APP_ID)} />
          </>
        }
      />
      {(filtersOpen || count > 0) && <FilterBar filters={filters} onChange={setFilters} />}
      <AuditTable
        entries={filtered}
        fill
        selectedId={selected?.externalId ?? null}
        onSelect={setSelected}
        noResults={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s.md, textAlign: "center" }}>
            <span style={{ ...font.h4, color: c.textPrimary }}>No entries match these filters</span>
            <span style={{ ...font.body, color: c.textTertiary }}>Try a wider date range or clear a filter.</span>
            <CometChatButton hierarchy="secondary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </CometChatButton>
          </div>
        }
      />
      <AuditDetailPanel entry={selected} onClose={() => setSelected(null)} />
    </>
  );
}

/* ---------------- gated ---------------- */

/** Who is looking: Plans & Billing is owner-only, so only an owner gets the upgrade button. */
export type ViewerRole = "owner" | "admin";

/** Featured icon: 48px brand-tinted circle with the shield glyph (fills the Empty state's 48px icon slot). */
function ShieldFeaturedIcon() {
  return (
    <span
      aria-hidden
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", borderRadius: r.full, background: "var(--primary-100)", color: c.brand }}
    >
      <Icon name="shield" size={dim.iconMd} />
    </span>
  );
}

/**
 * Gated (the app's `dashboard.audit.logs.enabled` parameter is off): the real table fed sample
 * rows, blurred and inert, under an upgrade card. Copy per the dashboard team's UI spec, without
 * features the backend doesn't have yet (the prototype's "webhook delivery").
 */
function GatedView({ viewerRole }: { viewerRole: ViewerRole }) {
  const sample = React.useMemo(() => buildEvents().slice(0, 8), []);
  const inert = { inert: "" } as React.HTMLAttributes<HTMLDivElement>; // @types/react 18 has no `inert`
  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden {...inert} className="cc-audit-gated__preview">
        <AuditTable entries={sample} selectedId={null} onSelect={() => undefined} noResults={null} hidePagination />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: s["3xl"] }}>
        <div
          role="region"
          aria-label="Upgrade to access Audit Logs"
          className="cc-audit-gated__card"
          style={{ background: c.bgPrimary, border: `1px solid ${c.borderDefault}`, borderRadius: r["2xl"], boxShadow: shadow.lg, padding: s["4xl"] }}
        >
          <CometChatEmpty
            size="sm"
            icon={<ShieldFeaturedIcon />}
            showBackgroundPattern={false}
            title="Audit Logs"
            description="Track every action performed on your Dashboard — who changed what, when, and why. Includes before/after diffs and export."
            actions={
              viewerRole === "owner" ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s.lg }}>
                  <CometChatButton hierarchy="black">Upgrade to Enterprise</CometChatButton>
                  <span style={{ ...font.captionReg, color: c.textQuaternary }}>Available on the Enterprise plan</span>
                </div>
              ) : (
                <span style={{ ...font.body, color: c.textTertiary, textAlign: "center" }}>Ask your app owner to upgrade to Enterprise.</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- empty ---------------- */

/**
 * Empty (enabled, no events yet). Copy per the dashboard team's spec: it lists only what the API
 * records (the Feature Narrative's "login/logout" and "user management" aren't captured), and says
 * history starts when logging was switched on — there's nothing from before launch.
 */
function EmptyView() {
  return (
    <AuditTable
      entries={[]}
      selectedId={null}
      onSelect={() => undefined}
      fill
      noResults={
        <CometChatEmpty
          size="md"
          showBackgroundPattern={false}
          icon={
            // The dashboard's empty-state featured icon ("modern"): white rounded square, border-dark
            // border, skeuomorphic xs shadow, dark line icon — fills the Empty state's 48px icon slot.
            <span
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                borderRadius: r.lg,
                background: c.bgPrimary,
                border: `1px solid ${c.borderDark}`,
                boxShadow: "var(--shadow-xs-skeuomorphic)",
                color: c.textSecondary,
              }}
            >
              <Icon name="description" size={dim.iconMd} />
            </span>
          }
          title="No activity recorded yet"
          description="Audit logs will appear here as configuration changes are made to this app — settings, team, roles, API keys, moderation rules, AI agents, push and extensions. History starts from when audit logging was enabled."
        />
      }
    />
  );
}

/* ---------------- page ---------------- */

export default function AuditLogsScreen({ variant = "empty", viewerRole = "owner" }: { variant?: AuditLogsVariant; viewerRole?: ViewerRole }) {
  return (
    <DashboardFrame active="Audit Logs" expanded="application">
      {/* Full height so the Empty state can centre in the space under the header. */}
      <div data-variant={variant} style={{ display: "flex", flexDirection: "column", gap: s["2xl"], minHeight: "100%" }}>
        {variant === "enterprise" ? (
          <EnterpriseView />
        ) : (
          <PageHeader
            actions={
              <>
                <FilterButton count={0} open={false} disabled onClick={() => undefined} />
                <ExportButton disabled onExport={() => undefined} />
              </>
            }
          />
        )}
        {variant === "gated" && <GatedView viewerRole={viewerRole} />}
        {variant === "empty" && <EmptyView />}
      </div>
    </DashboardFrame>
  );
}
