// Audit Logs detail panel — the dashboard's slide-out pattern: a 400px panel over
// a dimmed page (Feature Narrative width; "Flagged Message Details" layout), a
// header bar (bg-secondary, bottom border, H3 title, close X — Figma "Slide out
// menu header" 136:795528) and sections titled in sentence case with a help icon
// ("Filters ⓘ"). Read-only rows: gray label column, 14px values, top-aligned.
//
// Rendered straight from one API event (GET /audit-logs/{externalId} — the same
// object as a list row). Readable names come from the Dashboard's label maps and
// the team-members join; everything else is shown as the API sends it. The
// change section follows the API's five `change.type` shapes:
//   update + before  → "Changes"          field: old → new   (owned; settings = {parameterId, value})
//   update, before=null → "Submitted values" (proxied — the old value isn't recorded)
//   toggle           → "Changes"          Status: Disabled → Enabled
//   create           → "Created"          entity key–value list
//   delete           → "Removed"          entity key–value list (arrays as a list)
//   auth             → "Context"          (defined in the contract; not emitted in v1)
// Secrets arrive as "[redacted]" and read as "Redacted".
import React from "react";
import CometChatDrawer from "components/base/Drawer/CometChatDrawer";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatTooltip from "components/base/Tooltip/CometChatTooltip";
import { c, s, font } from "../theme";
import { Icon, dim } from "../pin/ui";
import { REDACTED, actionLabel, memberFor, parameterLabel, resourceLabel, sectionLabel, type AuditEvent, type Change } from "./data";
import { ActionBadge, ActorAvatar, OutcomeBadge, RoleBadge, SourceBadge, formatDate, formatTime, viewerTimeZone } from "./cells";

/** Feature Narrative: the panel is 400px wide (matches the dashboard's detail slide-outs). */
export const PANEL_WIDTH = 400;

/** Label column width — fits 14px labels like "Message Retention" in one line. No size token exists. */
const LABEL_W = 120;

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

/** H4 (16/24) — the section title size. */
const h4: React.CSSProperties = { fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-text-md)", lineHeight: "var(--line-height-text-md)" };

type Obj = Record<string, unknown>;

/* ---------------- value formatting ---------------- */

/** Readable field names for change-body keys (camelCase → words; known keys renamed). */
const KEY_LABEL: Record<string, string> = {
  id: "ID",
  microserviceId: "Extension",
  parameterId: "Setting",
  parameterIds: "Settings",
  isAnnual: "Annual billing",
  cancelsAt: "Cancels on",
  teamId: "Team ID",
  keyId: "Key ID",
  p8Key: "Auth key (.p8)",
  webhookUrl: "Webhook URL",
  listName: "List",
  maxParticipants: "Max participants",
};

const keyLabel = (key: string) =>
  KEY_LABEL[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\bid\b/i, "ID")
    .replace(/^./, (ch) => ch.toUpperCase());

const dateTime = (ms: number) => new Date(ms).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

/**
 * One value as text. Rules from the dashboard UI spec: "[redacted]" → Redacted chip; booleans →
 * Enabled/Disabled for on/off fields, otherwise true/false; arrays → one item per line; objects →
 * compact JSON; everything plain text. `*AtMS` / `*At` numbers are epoch ms / s → a date.
 */
function Value({ v, field }: { v: unknown; field?: string }) {
  if (v === REDACTED) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, color: c.textQuaternary, fontStyle: "italic" }}>
        <Icon name="lock" size={dim.iconXs} />
        Redacted
      </span>
    );
  }
  if (v === null || v === undefined || v === "") return <span style={{ color: c.textQuaternary }}>—</span>;
  if (typeof v === "boolean") {
    const onOff = field !== undefined && /(^|\.)enabled$|^enabled$|^production$/i.test(field);
    return <>{onOff ? (v ? "Enabled" : "Disabled") : String(v)}</>;
  }
  if (typeof v === "number" && field !== undefined) {
    if (/AtMS$/.test(field)) return <>{dateTime(v)}</>;
    if (/At$/.test(field)) return <>{dateTime(v * 1000)}</>;
  }
  if (Array.isArray(v)) {
    return (
      <span style={{ display: "flex", flexDirection: "column", gap: s.xxs }}>
        {v.map((item, i) => (
          <span key={i}>{field === "parameterIds" && typeof item === "string" ? parameterLabel(item) : typeof item === "string" ? item : JSON.stringify(item)}</span>
        ))}
      </span>
    );
  }
  if (typeof v === "object") return <>{JSON.stringify(v)}</>;
  return <>{String(v)}</>;
}

/* ---------------- building blocks ---------------- */

/** Section: sentence-case title + help icon (H4 semibold, text-primary), 12px above its content. */
function Section({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: s.lg }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.md }}>
        <h3 style={{ ...h4, fontWeight: w.semibold as unknown as number, color: c.textPrimary, margin: 0 }}>{title}</h3>
        <CometChatTooltip title={help} placement="top">
          <span style={{ display: "inline-flex" }} aria-label={help} role="img">
            <Icon name="info" size={dim.iconXs} color="var(--fg-quaternary)" />
          </span>
        </CometChatTooltip>
      </div>
      {children}
    </section>
  );
}

/**
 * Read-only row, top-aligned: label (body medium 14/20, text-quaternary) in a fixed column, 16px gap,
 * value (body 14/20, text-primary). `labelOffset` nudges the label down to the first text line when
 * the value starts with something taller than a text line (a 24px chip → xxs, a 32px avatar → sm).
 */
function Row({ label, children, labelOffset }: { label: string; children: React.ReactNode; labelOffset?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: s.xl }}>
      <span style={{ ...font.bodyMd, color: c.textQuaternary, width: LABEL_W, flexShrink: 0, paddingTop: labelOffset }}>{label}</span>
      <span style={{ ...font.body, color: c.textPrimary, flex: 1, minWidth: 0, overflowWrap: "anywhere", display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: s.md, rowGap: s.xxs }}>
        {children}
      </span>
    </div>
  );
}

const CHIP_OFFSET = s.xxs; // 24px chip vs 20px label line
const AVATAR_OFFSET = s.sm; // 32px avatar vs 20px label line

/** Rows 20px apart ($spacing-2xl). */
function Rows({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: s["2xl"] }}>{children}</div>;
}

function Note({ children }: { children: React.ReactNode }) {
  return <p style={{ ...font.body, color: c.textTertiary, margin: 0 }}>{children}</p>;
}

/* ---------------- change section ---------------- */

/** Old value (struck, tertiary) → new value (medium). */
function Diff({ before, after, field }: { before: unknown; after: unknown; field?: string }) {
  return (
    <>
      <span style={{ color: c.textTertiary, textDecoration: before === REDACTED ? "none" : "line-through" }}>
        <Value v={before} field={field} />
      </span>
      <Icon name="arrow-forward" size={dim.iconXs} color="var(--fg-quaternary)" />
      <span style={{ fontWeight: w.medium as unknown as number }}>
        <Value v={after} field={field} />
      </span>
    </>
  );
}

function EntityRows({ items }: { items: Obj }) {
  return (
    <Rows>
      {Object.entries(items).map(([k, v]) => (
        <Row key={k} label={keyLabel(k)}>
          <Value v={v} field={k} />
        </Row>
      ))}
    </Rows>
  );
}

const isSetting = (o: Obj | null): o is { parameterId: string; value: unknown } => !!o && typeof o.parameterId === "string" && "value" in o;

function ChangeSection({ change }: { change: Change }) {
  switch (change.type) {
    case "update": {
      // Proxied update: the backend never held the old value, so only what was submitted is recorded.
      if (change.before === null) {
        return (
          <Section title="Submitted values" help="The values sent with this change. The previous values aren't recorded for this kind of setting.">
            <Note>The previous value isn't recorded for this change.</Note>
            <EntityRows items={change.after} />
          </Section>
        );
      }
      // Settings: one row, labelled with the readable setting name.
      if (isSetting(change.before) && isSetting(change.after)) {
        return (
          <Section title="Changes" help="The setting's value before and after this change.">
            <Rows>
              <Row label={parameterLabel(change.after.parameterId)}>
                <Diff before={change.before.value} after={change.after.value} field={change.after.parameterId} />
              </Row>
            </Rows>
          </Section>
        );
      }
      const before: Obj = change.before;
      const after: Obj = change.after;
      const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
      return (
        <Section title="Changes" help="Each field that changed: its old value, then its new value. Secrets are never stored and show as Redacted.">
          <Rows>
            {keys.map((k) => (
              <Row key={k} label={keyLabel(k)}>
                <Diff before={before[k]} after={after[k]} field={k} />
              </Row>
            ))}
          </Rows>
        </Section>
      );
    }
    case "toggle":
      // The API sends only the new state; the old state is its opposite.
      return (
        <Section title="Changes" help="What was switched on or off. The API records the new state; the previous state is its opposite.">
          <Rows>
            <Row label="Status">
              <Diff before={!change.after.enabled} after={change.after.enabled} field="enabled" />
            </Row>
          </Rows>
        </Section>
      );
    case "create":
      return (
        <Section title="Created" help="Details of the item this action created, as recorded by the API. Secrets are never stored and show as Redacted.">
          <EntityRows items={change.entity} />
        </Section>
      );
    case "delete":
      return (
        <Section title="Removed" help="What this action removed, as recorded by the API. For many deletes that is only the item's ID.">
          <EntityRows items={change.entity} />
        </Section>
      );
    case "auth":
      return (
        <Section title="Context" help="Session details captured with this sign-in event.">
          <EntityRows items={change.context} />
        </Section>
      );
  }
}

/* ---------------- panel ---------------- */

export default function AuditDetailPanel({ entry, onClose }: { entry: AuditEvent | null; onClose: () => void }) {
  const member = entry ? memberFor(entry.actor.email) : undefined;
  return (
    <CometChatDrawer
      open={entry !== null}
      onClose={onClose}
      placement="right"
      size={PANEL_WIDTH}
      closable={false}
      destroyOnHidden
      styles={{ header: { display: "none" } }}
      className="cc-audit-panel"
    >
      {entry && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header bar — Figma "Slide out menu header" (136:795528) */}
          <header
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: `${s["2xl"]} ${s["3xl"]}`,
              background: c.bgSecondary,
              borderBottom: `1px solid ${c.borderDefault}`,
              flexShrink: 0,
            }}
          >
            <h2 style={{ ...font.h2, fontSize: "var(--font-size-text-lg)", lineHeight: "var(--line-height-text-lg)", fontWeight: w.semibold as unknown as number, color: c.textPrimary, margin: 0, paddingRight: s["5xl"] }}>
              {actionLabel(entry.action)}
            </h2>
            <span style={{ position: "absolute", top: s.xl, right: s.xl }}>
              <CometChatButton variant="close" className="cc-audit-panel__close" ariaLabel="Close" onClick={onClose} iconOnly iconLeading={<Icon name="close" size={dim.iconMd} />} />
            </span>
          </header>

          {/* Body — sections 32px apart, 24px inset */}
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: s["3xl"], display: "flex", flexDirection: "column", gap: s["4xl"] }}>
            <Section title="Summary" help="What happened, where it happened, and whether it succeeded.">
              <Rows>
                <Row label="Resource">{resourceLabel(entry)}</Row>
                <Row label="Section">{sectionLabel(entry.section)}</Row>
                <Row label="Action" labelOffset={CHIP_OFFSET}>
                  <ActionBadge event={entry} />
                </Row>
                <Row label="Outcome" labelOffset={CHIP_OFFSET}>
                  <OutcomeBadge outcome={entry.outcome} />
                </Row>
              </Rows>
            </Section>

            <Section title="Actor" help="The team member who performed the action, and their role on this app at the time. Name and photo come from the app's team list.">
              <Rows>
                <Row label="Name" labelOffset={AVATAR_OFFSET}>
                  <ActorAvatar email={entry.actor.email} />
                  {member ? member.name : <span style={{ color: c.textTertiary }}>No longer on this team</span>}
                </Row>
                <Row label="Email">{entry.actor.email}</Row>
                <Row label="Role" labelOffset={CHIP_OFFSET}>
                  <RoleBadge role={entry.actor.role} />
                </Row>
              </Rows>
            </Section>

            <Section title="Details" help={`When and from where the action was performed. Times are shown in your timezone (${viewerTimeZone()}); the API stores them in UTC.`}>
              <Rows>
                <Row label="Date">{formatDate(entry.timestamp)}</Row>
                <Row label="Time">
                  {formatTime(entry.timestamp)}
                  <span style={{ color: c.textQuaternary }}>({viewerTimeZone()})</span>
                </Row>
                <Row label="Source" labelOffset={CHIP_OFFSET}>
                  <SourceBadge source={entry.source} />
                </Row>
                <Row label="Source IP">
                  <Value v={entry.sourceIp} />
                </Row>
                <Row label="Event ID">{entry.externalId}</Row>
                <Row label="Correlation ID">
                  <Value v={entry.correlationId} />
                </Row>
              </Rows>
            </Section>

            <ChangeSection change={entry.change} />
          </div>
        </div>
      )}
    </CometChatDrawer>
  );
}
