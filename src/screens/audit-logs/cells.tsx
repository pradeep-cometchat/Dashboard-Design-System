// Shared badge / text / avatar helpers for the Audit Logs table and detail panel.
import React from "react";
import CometChatBadge from "components/base/Badge/CometChatBadge";
import type { BadgeColor } from "components/base/Badge/CometChatBadge";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import { c, font } from "../theme";
import { FLOW_SEP, memberFor, verbOf, type AuditEvent, type Change, type Outcome, type Source } from "./data";
import { meVerb } from "./user-data";

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
} as const;

/**
 * Figma "Table cell" type Text: lead text (medium, primary) + supporting text (tertiary).
 * `supportingTitle` is the hover text when the supporting line is shortened (defaults to the line itself).
 */
export function CellText({ lead, supporting, supportingTitle }: { lead: React.ReactNode; supporting?: React.ReactNode; supportingTitle?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* title: when a narrow column ellipsizes the text, hovering shows it in full. */}
      <span title={typeof lead === "string" ? lead : undefined} style={{ ...font.bodyMd, fontWeight: w.medium as unknown as number, color: c.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {lead}
      </span>
      {supporting && (
        <span title={supportingTitle ?? (typeof supporting === "string" ? supporting : undefined)} style={{ ...font.body, fontWeight: w.regular as unknown as number, color: c.textTertiary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {supporting}
        </span>
      )}
    </div>
  );
}

/** Single-line plain value (body 14/20 regular, text-primary) — ellipsized, full text on hover. */
export function CellPlain({ text }: { text: string }) {
  return (
    <span title={text} style={{ ...font.body, fontWeight: w.regular as unknown as number, color: c.textPrimary, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
      {text}
    </span>
  );
}

/** Table form of a resource flow: a path longer than "<type> → <name>" keeps its first and last steps ("A → … → D"). */
export const collapseFlow = (flow: string) => {
  const steps = flow.split(FLOW_SEP);
  return steps.length > 2 ? [steps[0], "…", steps[steps.length - 1]].join(FLOW_SEP) : flow;
};

/** Initials from a name ("Sarah Chen" → SC) or, when only an email is known, its local part (tom.baker@… → TB). */
export const initials = (nameOrEmail: string) =>
  nameOrEmail
    .split("@")[0]
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

export const roleLabel = (role: string) => role[0].toUpperCase() + role.slice(1);

/**
 * Actor avatar: the member's photo from the team list (the API sends no photo), falling back to
 * initials for someone no longer on the team. `size` in px (antd numeric size); initials stay 12px.
 */
export function ActorAvatar({ email, size }: { email: string; size?: number }) {
  const member = memberFor(email);
  return (
    <CometChatAvatar
      src={member?.avatar}
      alt={member?.name ?? email}
      size={size}
      style={{ flexShrink: 0, fontSize: "var(--font-size-text-xs)" }}
    >
      {initials(member?.name ?? email)}
    </CometChatAvatar>
  );
}

/** Action badge colour keyed on the API's change.type (toggles follow their direction). */
const colorFor = (change: Change): BadgeColor => {
  switch (change.type) {
    case "create":
      return "success";
    case "update":
      return "brand";
    case "delete":
      return "error";
    case "toggle":
      return change.after.enabled ? "success" : "gray";
    case "auth":
      return "gray";
  }
};

export function ActionBadge({ event }: { event: AuditEvent }) {
  // Extension first-enable arrives as `create`; colour it like any other enable.
  const color = event.action.endsWith(".enable") ? "success" : event.action.endsWith(".disable") ? "gray" : colorFor(event.change);
  return (
    <CometChatBadge type="pill" size="sm" color={color}>
      {verbOf(event)}
    </CometChatBadge>
  );
}

/**
 * Action badge for the v4 envelope, which has no change type: the colour follows the verb, matching
 * ActionBadge — created / enabled green, updated brand, deleted / reset red, disabled / signed in gray.
 */
export function VerbBadge({ action }: { action: string }) {
  const verb = meVerb(action);
  const color: BadgeColor =
    verb === "Created" || verb === "Enabled" ? "success" : verb === "Updated" || verb === "Configured" ? "brand" : verb === "Deleted" || verb === "Reset" ? "error" : "gray";
  return (
    <CometChatBadge type="pill" size="sm" color={color}>
      {verb}
    </CometChatBadge>
  );
}

/** Outcome: coloured pill, same treatment as the Action badge — success green, failure red. */
export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const ok = outcome === "success";
  return (
    <CometChatBadge type="pill" size="sm" color={ok ? "success" : "error"}>
      {ok ? "Success" : "Failed"}
    </CometChatBadge>
  );
}

/** Role chip — neutral gray pill (same as the "Dashboard" source chip), in the table and the detail panel. */
export function RoleBadge({ role }: { role: string }) {
  return (
    <CometChatBadge type="pill" size="sm" color="gray">
      {roleLabel(role)}
    </CometChatBadge>
  );
}

export function SourceBadge({ source }: { source: Source }) {
  return (
    <CometChatBadge type="pill" size="sm" color={source === "api" ? "warning" : "gray"}>
      {source === "api" ? "API" : "Dashboard"}
    </CometChatBadge>
  );
}

/* ---------------- time formatting (API: epoch seconds UTC; shown in the viewer's zone) ---------------- */

export const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatDate = (epochSeconds: number) => new Date(epochSeconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatTime = (epochSeconds: number) => new Date(epochSeconds * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
