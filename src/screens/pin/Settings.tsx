// Settings screen — "❖ Dashboard--May 2026" Figma file eoA7wXLLCe1NmlryPuVvn9,
// node 87-557883. Built from foundation tokens + base components:
// CometChatToggle (sm = the design's 36×20 switch), CometChatInput,
// CometChatTextArea, CometChatTag. Check/cross marks and info glyphs come from
// the vendored May 2026 foundation icon set.
import React from "react";
import CometChatToggle from "components/base/Toggle/CometChatToggle";
import CometChatInput from "components/base/Input/CometChatInput";
import CometChatTextArea from "components/base/TextArea/CometChatTextArea";
import CometChatTag from "components/base/Tag/CometChatTag";
import CometChatButton from "components/base/Button/CometChatButton";
import { c, s, r, font, shadow } from "../theme";
import { Icon, DashboardFrame, dim } from "./ui";
import PinEmpty from "./PinEmpty";

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

/* ---------------- building blocks ---------------- */

function InfoIcon() {
  return <Icon name="info" size={dim.iconXs} color={c.textQuaternary} />;
}

/** Two-column settings section: heading + copy on the left, action card right. */
function Section({ title, desc, children, last = false }: { title: string; desc: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section
      style={{
        display: "flex",
        gap: s["5xl"],
        alignItems: "flex-start",
        width: "100%",
        paddingBottom: s["5xl"],
        borderBottom: last ? "none" : `1px solid ${c.borderLight}`,
      }}
    >
      <div style={{ width: 400, flexShrink: 0, display: "flex", flexDirection: "column", gap: s.xs }}>
        <h2 style={{ ...font.h4, fontWeight: w.semibold as unknown as number, color: c.textSecondary, margin: 0 }}>{title}</h2>
        <p style={{ ...font.body, color: c.textTertiary, margin: 0 }}>{desc}</p>
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: c.bgSecondary,
          border: `1px solid ${c.borderDefault}`,
          borderRadius: r["2xl"],
          padding: s["2xl"],
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/** Toggle + label + optional info/badge + supporting text. */
function ToggleRow({ on, label, desc, info = false, badge }: { on: boolean; label: string; desc: string; info?: boolean; badge?: string }) {
  return (
    <div style={{ display: "flex", gap: s.lg, alignItems: "flex-start" }}>
      <CometChatToggle size="sm" checked={on} ariaLabel={label} />
      <div style={{ display: "flex", flexDirection: "column", gap: s.xs, flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: s.md }}>
          <span style={{ ...font.body, fontWeight: w.medium as unknown as number, color: c.textSecondary }}>{label}</span>
          {info && <InfoIcon />}
          {badge && <CometChatTag size="sm">{badge}</CometChatTag>}
        </span>
        <span style={{ ...font.body, color: c.textTertiary }}>{desc}</span>
      </div>
    </div>
  );
}

/** Round pass/fail mark used in the message-type matrix. */
function Mark({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim.iconMd,
        height: dim.iconMd,
        borderRadius: r.full,
        background: ok ? "var(--bg-success-secondary)" : "var(--bg-error-secondary)",
      }}
    >
      <Icon name={ok ? "check" : "x-close"} size={dim.iconXs} color={ok ? "var(--fg-success-primary)" : "var(--fg-error-primary)"} />
    </span>
  );
}

/* ---------------- message-type matrix ---------------- */

type Cell = { kind: "mark"; ok: boolean } | { kind: "toggle"; on: boolean };
const mark = (ok: boolean): Cell => ({ kind: "mark", ok });
const toggle = (on: boolean): Cell => ({ kind: "toggle", on });

const MATRIX: { label: string; conversations: Cell; threads: Cell }[] = [
  { label: "Include Standard Messages", conversations: mark(true), threads: mark(true) },
  { label: "Include Custom Messages", conversations: toggle(true), threads: mark(true) },
  { label: "Include Group Actions", conversations: toggle(true), threads: mark(false) },
  { label: "Include Call Activities", conversations: toggle(false), threads: mark(false) },
  { label: "Include Thread Replies", conversations: toggle(true), threads: mark(true) },
];

function MatrixCell({ cell, label }: { cell: Cell; label: string }) {
  return cell.kind === "mark" ? <Mark ok={cell.ok} /> : <CometChatToggle size="sm" checked={cell.on} ariaLabel={label} />;
}

function MessageTypeTable() {
  const headStyle: React.CSSProperties = {
    ...font.caption,
    fontWeight: w.semibold as unknown as number,
    color: c.textQuaternary,
    background: c.bgSecondary,
    borderBottom: `1px solid ${c.borderDefault}`,
    padding: `${s.lg} ${s["3xl"]}`,
    textAlign: "left",
  };
  const cellStyle: React.CSSProperties = {
    borderBottom: `1px solid ${c.borderDefault}`,
    padding: `${s.xl} ${s["2xl"]}`,
  };
  return (
    <div style={{ background: c.bgPrimary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, boxShadow: shadow.xs, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headStyle}>Message Type</th>
            <th style={{ ...headStyle, width: 160 }}>Conversations</th>
            <th style={{ ...headStyle, width: 160 }}>Threads</th>
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((row) => (
            <tr key={row.label}>
              <td style={cellStyle}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: s.md }}>
                  <span style={{ ...font.body, fontWeight: w.medium as unknown as number, color: c.textPrimary, whiteSpace: "nowrap" }}>{row.label}</span>
                  <InfoIcon />
                </span>
              </td>
              <td style={cellStyle}>
                <MatrixCell cell={row.conversations} label={`${row.label} in conversations`} />
              </td>
              <td style={cellStyle}>
                <MatrixCell cell={row.threads} label={`${row.label} in threads`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- the screen ---------------- */

// Masked demo value — deliberately NOT in real key format so secret scanners
// (and copy-paste accidents) can never mistake it for a live credential.
const OPENAI_KEY_SAMPLE = "sk-••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••4tQF";

export default function SettingsScreen({ pinEnableToggle = true, pinLabelOutside = false }: { pinEnableToggle?: boolean; pinLabelOutside?: boolean }) {
  const [pinDirty, setPinDirty] = React.useState(false);
  const [pinSaveTick, setPinSaveTick] = React.useState(0);
  return (
    <DashboardFrame active="Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: s.xl }}>
        <header style={{ display: "flex", alignItems: "center", minHeight: dim.avatar }}>
          <h1
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-display-xs)",
              lineHeight: "var(--line-height-display-xs)",
              fontWeight: w.semibold as unknown as number,
              color: c.textPrimary,
              margin: 0,
            }}
          >
            Settings
          </h1>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: s["5xl"] }}>
          <Section
            title="General Configuration"
            desc="Customize conversation previews and unread counts by selecting which message types appear as the last message and adjusting how unread messages are counted."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: s["3xl"] }}>
              <ToggleRow on label="Logs" desc="Show or Hide the chat messages on the Live and History tabs of" />
              <ToggleRow on label="Token Based File Access" desc="File access token per message receiver" info />
              <ToggleRow
                on={false}
                label="Enhanced Messaging Status"
                desc="Allow group members to see when messages are delivered to and read by all, and to mark messages as unread"
                info
                badge="Experimental"
              />
            </div>
          </Section>

          <Section
            title="Customise Conversation Previews and Unread Counts"
            desc="Tailor the conversation list by choosing which message types appear as the last message for each conversation & increment the unread message count."
          >
            <MessageTypeTable />
          </Section>

          <Section
            title="Threads"
            desc="Configure how threaded conversations behave when messages are deleted. These settings affect reply counts and real-time updates across all conversations and groups."
          >
            <ToggleRow
              on
              label="Auto-decrement reply count on deletion"
              desc="When a threaded reply is deleted, automatically reduce the parent message's reply count."
            />
          </Section>

          {/* Copy below is a placeholder pending design — the section shape mirrors Threads. */}
          <Section
            title="Pin Conversations"
            desc="Keep up to 5 important conversations at the top of the list for everyone in your app. Only admins can pin, reorder, or remove them."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: s["3xl"] }}>
              {pinEnableToggle && (
                <ToggleRow
                  on
                  label="Enable conversation pinning"
                  desc="Show pinned conversations at the top of the conversation list for all members."
                />
              )}
              <PinEmpty labelOutside={pinLabelOutside} onDirtyChange={setPinDirty} saveTick={pinSaveTick} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <CometChatButton hierarchy="primary" disabled={!pinDirty} onClick={() => setPinSaveTick((t) => t + 1)}>
                  Update
                </CometChatButton>
              </div>
            </div>
          </Section>

          <Section
            title="Configure how your AI Copilot responds in chat"
            desc="Set your OpenAI model, temperature, and custom instructions here. These settings apply across AI-driven features like chat assistance and AI agents."
            last
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: s.xl }}>
              <CometChatInput label="Model" defaultValue="gpt-4o-mini" />
              <CometChatInput label="Open AI Temperature" defaultValue="0.5" />
              <CometChatTextArea label="OpenAI Key" defaultValue={OPENAI_KEY_SAMPLE} rows={4} />
              <CometChatTextArea label="Custom Instruction" helpText="Applied to every AI Copilot reply" placeholder="Enter a description..." rows={4} />
            </div>
          </Section>
        </div>
      </div>
    </DashboardFrame>
  );
}
