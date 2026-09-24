// Shared badge / text helpers for the Audit Logs table and detail panel.
import React from "react";
import CometChatBadge from "components/base/Badge/CometChatBadge";
import type { BadgeColor } from "components/base/Badge/CometChatBadge";
import { c, font } from "../theme";
import type { ActionType, Outcome, Source } from "./data";

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
} as const;

/** Figma "Table cell" type Text: lead text (medium, primary) + supporting text (tertiary). */
export function CellText({ lead, supporting }: { lead: React.ReactNode; supporting?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* title: when a narrow column ellipsizes the text, hovering shows it in full. */}
      <span title={typeof lead === "string" ? lead : undefined} style={{ ...font.bodyMd, fontWeight: w.medium as unknown as number, color: c.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {lead}
      </span>
      {supporting && (
        <span title={typeof supporting === "string" ? supporting : undefined} style={{ ...font.body, fontWeight: w.regular as unknown as number, color: c.textTertiary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {supporting}
        </span>
      )}
    </div>
  );
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

export const roleLabel = (role: string) => role[0].toUpperCase() + role.slice(1);

/** Action badge color keyed on the catalog action type. */
const ACTION_COLOR: Record<ActionType, BadgeColor> = {
  Create: "success",
  Update: "brand",
  Config: "brand",
  Delete: "error",
  Auth: "gray",
};

export function ActionBadge({ type, children }: { type: ActionType; children: React.ReactNode }) {
  return (
    <CometChatBadge type="pill" size="sm" color={ACTION_COLOR[type]}>
      {children}
    </CometChatBadge>
  );
}

/** Outcome: coloured pill, same treatment as the Action badge — success green, failure red. */
export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const ok = outcome === "success";
  return (
    <CometChatBadge type="pill" size="sm" color={ok ? "success" : "error"}>
      {ok ? "Success" : "Failure"}
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

/* ---------------- time formatting (stored UTC, displayed in the viewer's zone) ---------------- */

export const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
