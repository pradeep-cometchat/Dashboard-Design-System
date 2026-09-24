// Audit Logs side panel — Feature Narrative "Side panel detail view": a 400px
// panel sliding in from the right with a hero (resource headline, section,
// action + outcome + source badges), actor row (avatar, name, email, role
// badge), 2-column metadata grid (Date, Time, Source IP, Source) and a Changes
// section that varies by action type: Old / New values in a gray card for
// updates, "Created" / "Removed" key-value lists, "Context" for auth events.
import React from "react";
import CometChatDrawer from "components/base/Drawer/CometChatDrawer";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import CometChatButton from "components/base/Button/CometChatButton";
import { c, s, r, font } from "../theme";
import { Icon, dim } from "../pin/ui";
import { lookupAction, REDACTED, type AuditEntry, type Change } from "./data";
import { ActionBadge, OutcomeBadge, RoleBadge, SourceBadge, initials, formatDate, formatTime } from "./cells";

/** Feature Narrative: the panel is 400px wide. */
export const PANEL_WIDTH = 400;

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

/** Secrets are never stored; the backend sends a marker which reads as "Redacted". */
function Value({ children }: { children: string }) {
  if (children === REDACTED) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, color: c.textQuaternary, fontStyle: "italic" }}>
        <Icon name="lock" size={dim.iconXs} />
        Redacted
      </span>
    );
  }
  return <>{children}</>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ ...font.caption, color: c.textQuaternary, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>{children}</h3>;
}

/** Key–value list used for Created / Removed / Context. */
function KeyValueList({ items }: { items: Record<string, string> }) {
  return (
    <dl style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", rowGap: s.md, columnGap: s.lg, margin: 0 }}>
      {Object.entries(items).map(([k, v]) => (
        <React.Fragment key={k}>
          <dt style={{ ...font.body, color: c.textTertiary, margin: 0 }}>{k}</dt>
          <dd style={{ ...font.bodyMd, color: c.textPrimary, margin: 0, overflowWrap: "anywhere" }}>
            <Value>{v}</Value>
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/** Old value / New value side by side in a gray card, one row per changed field. */
function DiffCard({ rows }: { rows: Extract<Change, { kind: "update" }>["rows"] }) {
  return (
    <div style={{ background: c.bgSecondary, border: `1px solid ${c.borderLight}`, borderRadius: r.lg, padding: s.lg, display: "flex", flexDirection: "column", gap: s.lg }}>
      {rows.map((row) => (
        <div key={row.field} style={{ display: "flex", flexDirection: "column", gap: s.xs }}>
          <span style={{ ...font.caption, color: c.textTertiary }}>{row.field}</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: s.md }}>
            <div style={{ display: "flex", flexDirection: "column", gap: s.xxs, minWidth: 0 }}>
              <span style={{ ...font.captionReg, color: c.textQuaternary }}>Old value</span>
              <span style={{ ...font.body, color: c.textSecondary, textDecoration: row.before === REDACTED ? "none" : "line-through", overflowWrap: "anywhere" }}>
                <Value>{row.before}</Value>
              </span>
            </div>
            <Icon name="arrow-forward" size={dim.iconXs} color={c.textQuaternary} />
            <div style={{ display: "flex", flexDirection: "column", gap: s.xxs, minWidth: 0 }}>
              <span style={{ ...font.captionReg, color: c.textQuaternary }}>New value</span>
              <span style={{ ...font.bodyMd, color: c.textPrimary, overflowWrap: "anywhere" }}>
                <Value>{row.after}</Value>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Changes({ change }: { change: Change }) {
  switch (change.kind) {
    case "update":
      return (
        <>
          <SectionTitle>Changes</SectionTitle>
          <DiffCard rows={change.rows} />
        </>
      );
    case "create":
      return (
        <>
          <SectionTitle>Created</SectionTitle>
          <KeyValueList items={change.entity} />
        </>
      );
    case "delete":
      return (
        <>
          <SectionTitle>Removed</SectionTitle>
          <KeyValueList items={change.entity} />
        </>
      );
    case "auth":
      return (
        <>
          <SectionTitle>Context</SectionTitle>
          <KeyValueList items={change.context} />
        </>
      );
  }
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: s.xxs, minWidth: 0 }}>
      <span style={{ ...font.captionReg, color: c.textTertiary }}>{label}</span>
      <span style={{ ...font.bodyMd, color: c.textPrimary, overflowWrap: "anywhere" }}>{children}</span>
    </div>
  );
}

export default function AuditDetailPanel({
  entry,
  onClose,
}: {
  entry: AuditEntry | null;
  onClose: () => void;
}) {
  const open = entry !== null;
  const { action, section } = entry ? lookupAction(entry.actionId) : { action: null, section: null };
  return (
    <CometChatDrawer
      open={open}
      onClose={onClose}
      placement="right"
      size={PANEL_WIDTH}
      closable={false}
      destroyOnHidden
      styles={{ header: { display: "none" } }}
      className="cc-audit-panel"
    >
      {entry && action && section && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
          {/* Hero */}
          <div style={{ padding: `${s["2xl"]} ${s["3xl"]}`, borderBottom: `1px solid ${c.borderLight}`, display: "flex", flexDirection: "column", gap: s.lg }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: s.lg }}>
              <div style={{ display: "flex", flexDirection: "column", gap: s.xxs, minWidth: 0 }}>
                <h2 style={{ ...font.h2, fontSize: "var(--font-size-text-lg)", lineHeight: "var(--line-height-text-lg)", fontWeight: w.semibold as unknown as number, color: c.textPrimary, margin: 0, overflowWrap: "anywhere" }}>
                  {entry.resource}
                </h2>
                <span style={{ ...font.body, color: c.textTertiary }}>{section.label}</span>
              </div>
              <CometChatButton variant="close" size="sm" ariaLabel="Close" onClick={onClose} iconOnly iconLeading={<Icon name="close" size={dim.iconSm} />} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: s.md }}>
              <ActionBadge type={action.type}>{entry.verb}</ActionBadge>
              <OutcomeBadge outcome={entry.outcome} />
              <SourceBadge source={entry.source} />
            </div>
          </div>

          {/* Actor */}
          <div style={{ padding: `${s.xl} ${s["3xl"]}`, borderBottom: `1px solid ${c.borderLight}`, display: "flex", alignItems: "center", gap: s.lg }}>
            <CometChatAvatar size={dim.avatar} style={{ flexShrink: 0 }}>
              {initials(entry.actor.name)}
            </CometChatAvatar>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <span style={{ ...font.bodyMd, color: c.textPrimary }}>{entry.actor.name}</span>
              <span style={{ ...font.body, color: c.textTertiary, overflowWrap: "anywhere" }}>{entry.actor.email}</span>
            </div>
            <RoleBadge role={entry.actor.role} />
          </div>

          {/* Metadata grid */}
          <div style={{ padding: `${s.xl} ${s["3xl"]}`, borderBottom: `1px solid ${c.borderLight}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${s.xl} ${s.lg}` }}>
            <Meta label="Date">{formatDate(entry.timestamp)}</Meta>
            <Meta label="Time">{formatTime(entry.timestamp)}</Meta>
            <Meta label="Source IP">{entry.sourceIp}</Meta>
            <Meta label="Source">{entry.source === "dashboard" ? "Dashboard UI" : "Management API"}</Meta>
          </div>

          {/* Changes */}
          <div style={{ padding: `${s.xl} ${s["3xl"]} ${s["3xl"]}`, display: "flex", flexDirection: "column", gap: s.lg }}>
            <Changes change={entry.change} />
          </div>
        </div>
      )}
    </CometChatDrawer>
  );
}
