// User Audit — the signed-in person's own history (GET /me/audit-logs, ENG-36975):
// changes they made in any of their apps, plus what happened to their account
// (sign-ins). Same table, filter chips, export and 400px panel as the app log;
// the Actor column becomes App, since every row is the viewer. Foundation
// tokens + base components only.
import React from "react";
import type { ColumnsType } from "antd/es/table";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import { c, s } from "../theme";
import { DashboardFrame, Icon, dim } from "../pin/ui";
import { AuditTable, COL_W, ExportButton, FilterButton, Head, NoResults, PageHeader } from "./AuditLogs";
import { CellText, CellPlain, collapseFlow, OutcomeBadge, RoleBadge, SourceBadge, VerbBadge, formatDate, formatTime, initials, viewerTimeZone } from "./cells";
import { ME, appFor, buildMeCatalog, buildMeEvents, isAccountEvent, meResourceLabel, meSectionLabel, type MeEvent } from "./user-data";
import { EMPTY_ME_FILTERS, UserFilterBar, activeMeFilterCount, applyMeFilters, type MeFilters } from "./user-filters";
import UserAuditDetailPanel from "./UserAuditDetailPanel";
import { downloadMeExport } from "./export";
import "./audit-logs.scss";

type Row = MeEvent & Record<string, unknown>;

/** 40px (dim.avatar), like the app log's actor avatar; initials stay 12px. */
const AVATAR_STYLE: React.CSSProperties = { flexShrink: 0, fontSize: "var(--font-size-text-xs)" };

/** Where the event happened: the app (joined from your apps list — the API sends only appId), or your account. */
function WhereCell({ row }: { row: MeEvent }) {
  if (isAccountEvent(row)) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: s.md, minWidth: 0 }}>
        <CometChatAvatar src={ME.avatar} alt={ME.name} size={dim.avatar} style={AVATAR_STYLE}>
          {initials(ME.name)}
        </CometChatAvatar>
        <CellText lead="Your account" supporting={ME.email} />
      </div>
    );
  }
  const app = appFor(row.appId);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.md, minWidth: 0 }}>
      {app ? (
        <CometChatAvatar size={dim.avatar} style={AVATAR_STYLE}>
          {initials(app.name)}
        </CometChatAvatar>
      ) : (
        <CometChatAvatar size={dim.avatar} style={AVATAR_STYLE} icon={<Icon name="grid-view" size={dim.iconSm} />} />
      )}
      {app ? <CellText lead={app.name} supporting={row.appId} /> : <CellText lead={row.appId!} supporting="No longer have access" />}
    </div>
  );
}

const COLUMNS: ColumnsType<Row> = [
  {
    title: <Head label="App" help="The app the change was made in. Account events, like signing in, belong to your account rather than an app." />,
    key: "app",
    width: COL_W.actor,
    render: (_, row) => <WhereCell row={row} />,
  },
  {
    title: <Head label="Role" help="Your role on that app when the action happened. Account events have no app role." />,
    key: "role",
    width: COL_W.chip,
    render: (_, row) => (row.actor.role ? <RoleBadge role={row.actor.role} /> : <span style={{ color: c.textQuaternary }}>—</span>),
  },
  {
    title: <Head label="Action" help="What was done — created, updated, deleted, enabled, disabled, signed in." />,
    key: "action",
    width: COL_W.chip,
    render: (_, row) => <VerbBadge action={row.action} />,
  },
  {
    // Description first (the API's actionLabel), then the flow (item type → the item that changed) underneath.
    title: <Head label="Resource" help="What was done, and to which item." />,
    key: "resource",
    render: (_, row) => <CellText lead={row.actionLabel} supporting={collapseFlow(meResourceLabel(row))} supportingTitle={meResourceLabel(row)} />,
  },
  {
    title: <Head label="Section" help="The Dashboard section the action was made in. Sign-ins belong to Auth." />,
    key: "section",
    width: COL_W.section,
    render: (_, row) => <CellPlain text={meSectionLabel(row.section)} />,
  },
  {
    title: <Head label="Source" help="How the action was performed: the Dashboard UI or the Management API." />,
    key: "source",
    width: COL_W.chip,
    render: (_, row) => <SourceBadge source={row.source} />,
  },
  {
    title: <Head label={`Timestamp (${viewerTimeZone()})`} help="When the action happened, shown in your local timezone. Stored in UTC." />,
    key: "timestamp",
    width: COL_W.timestamp,
    render: (_, row) => <CellText lead={formatDate(row.timestamp)} supporting={formatTime(row.timestamp)} />,
  },
  {
    title: <Head label="Outcome" help="Whether the action succeeded or failed." />,
    key: "outcome",
    width: COL_W.chip,
    render: (_, row) => <OutcomeBadge outcome={row.outcome} />,
  },
];

function UserEnterpriseView() {
  const entries = React.useMemo(() => buildMeEvents(), []);
  const catalog = React.useMemo(() => buildMeCatalog(entries), [entries]);
  const [filters, setFilters] = React.useState<MeFilters>(EMPTY_ME_FILTERS);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<MeEvent | null>(null);

  const filtered = React.useMemo(() => applyMeFilters(entries, filters), [entries, filters]);
  const count = activeMeFilterCount(filters);

  return (
    <>
      <PageHeader
        subtitle="Your sign-ins and the changes you've made across all your apps"
        actions={
          <>
            <FilterButton count={count} open={filtersOpen} disabled={false} onClick={() => setFiltersOpen((o) => !o)} />
            <ExportButton disabled={filtered.length === 0} onExport={(format) => downloadMeExport(filtered, format)} />
          </>
        }
      />
      {(filtersOpen || count > 0) && <UserFilterBar filters={filters} catalog={catalog} onChange={setFilters} />}
      <AuditTable<MeEvent>
        entries={filtered}
        columns={COLUMNS}
        fill
        selectedId={selected?.externalId ?? null}
        onSelect={setSelected}
        noResults={<NoResults onClear={() => setFilters(EMPTY_ME_FILTERS)} />}
      />
      <UserAuditDetailPanel entry={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export default function UserAuditScreen() {
  return (
    <DashboardFrame active="Audit Logs" expanded="application">
      <div style={{ display: "flex", flexDirection: "column", gap: s["2xl"], minHeight: "100%" }}>
        <UserEnterpriseView />
      </div>
    </DashboardFrame>
  );
}
