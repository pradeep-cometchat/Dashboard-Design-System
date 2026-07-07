import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { c, s, r, font, shadow } from "./theme";

const meta: Meta = {
  title: "Screens/Conversation Explorer/Overview",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const sans = "var(--font-family-base)";

function Page({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: sans, color: c.textPrimary, maxWidth: 1080, padding: "32px 28px", margin: "0 auto" }}>{children}</div>;
}
function H1({ children }: { children: React.ReactNode }) {
  return <h1 style={{ fontFamily: sans, fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{children}</h1>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ ...font.body, fontSize: 15, lineHeight: 1.6, color: c.textTertiary, maxWidth: 760, margin: "0 0 28px" }}>{children}</p>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textQuaternary, margin: "32px 0 14px", paddingBottom: 8, borderBottom: `1px solid ${c.borderDefault}` }}>{children}</h2>;
}
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, background: c.bgPrimary, padding: 18, boxShadow: shadow.xs }}>{children}</div>;
}
function Grid({ children, min = 240 }: { children: React.ReactNode; min?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 14 }}>{children}</div>;
}
function Chip({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "amber" | "red" | "brand" }) {
  const map = {
    gray: { bg: c.bgSecondary, bd: c.borderDefault, fg: c.textSecondary },
    amber: { bg: c.flaggedBadgeBg, bd: "var(--amber-200)", fg: c.flaggedBadgeText },
    red: { bg: c.blockedBadgeBg, bd: c.blockedBorder, fg: c.blockedBadgeText },
    brand: { bg: c.bgBrand, bd: "var(--primary-200)", fg: "var(--primary-700)" },
  }[tone];
  return <span style={{ display: "inline-flex", alignItems: "center", ...font.caption, color: map.fg, background: map.bg, border: `1px solid ${map.bd}`, borderRadius: r.sm, padding: `2px 8px` }}>{children}</span>;
}

const panels = [
  { title: "Left · Conversation list", body: "All 1:1 and group conversations, sorted by recent activity. Avatars (dual for 1:1, type-dot for groups), last-message preview, purple unread badge, group-type + member-count badges, search and filter." },
  { title: "Center · Chat bubbles", body: "The selected conversation rendered as chat bubbles — sender avatar, name (colored by presence), role badge, timestamps, edited indicator, media, reactions, and moderation states. Day dividers and lazy scroll." },
  { title: "Right · Details & metadata", body: "Collapsible overview cards for the selected message: full API fields, member list, media preview, tabbed reactions, tabbed read receipts, and a moderation panel with a deep link to Moderation Logs. Export as JSON/CSV." },
];

const states = [
  ["1:1 Chat", "Empty State", "No conversation selected — featured-icon empty states in both center and right panels."],
  ["1:1 Chat", "Conversation Selected", "A 1:1 conversation open; right panel prompts to select a message."],
  ["1:1 Chat", "Message Selected", "A message selected — the right panel is fully populated with metadata."],
  ["1:1 Chat", "Image Preview", "Image lightbox over a dimmed, blurred workspace."],
  ["1:1 Chat", "Video Preview", "Video lightbox with scrubber + thumbnail strip; CSV/JSON export."],
  ["Group Chat", "Selected", "A group conversation with role badges and edited indicators."],
  ["Group Chat", "Message Selected", "Group message selected with full right-panel details."],
  ["Group Chat", "Flagged Message Selected", "A flagged image with violation badge, reactions, and moderation details."],
  ["Group Chat", "Media Preview", "Media lightbox for a group message."],
];

export const Overview: Story = {
  render: () => (
    <Page>
      <H1>Conversation Explorer</H1>
      <Lead>
        A read-only Dashboard workspace for reviewing and moderating conversations. It replaces the flat “Chat Logs” table with
        a three-panel, chat-style interface — browse conversations, read them naturally as bubbles, inspect message metadata,
        and act on flagged or blocked content, all from one screen.
      </Lead>

      <H2>Three-panel layout</H2>
      <Grid min={300}>
        {panels.map((p) => (
          <Card key={p.title}>
            <div style={{ ...font.h4, marginBottom: 6 }}>{p.title}</div>
            <div style={{ ...font.body, lineHeight: 1.55, color: c.textTertiary }}>{p.body}</div>
          </Card>
        ))}
      </Grid>

      <H2>Moderation states</H2>
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Chip tone="amber">🚩 Flagged</Chip><span style={{ ...font.body, color: c.textTertiary }}>amber tint + left/border accent, violation label</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Chip tone="red">⛔ Blocked</Chip><span style={{ ...font.body, color: c.textTertiary }}>red tint + masked for users; admin-visible</span></span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Chip tone="gray">Approved</Chip><span style={{ ...font.body, color: c.textTertiary }}>default styling</span></span>
        </div>
      </Card>

      <H2>Screen states</H2>
      <div style={{ border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: sans }}>
          <thead>
            <tr>
              {["Flow", "Story", "Description"].map((h) => (
                <th key={h} style={{ textAlign: "left", ...font.caption, color: c.textQuaternary, textTransform: "uppercase", letterSpacing: "0.05em", padding: "10px 14px", background: c.bgSecondary, borderBottom: `1px solid ${c.borderDefault}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map(([flow, story, desc], i) => (
              <tr key={i}>
                <td style={{ ...font.caption, color: c.textSecondary, padding: "10px 14px", borderBottom: `1px solid ${c.borderLight}`, whiteSpace: "nowrap" }}>{flow}</td>
                <td style={{ ...font.bodyMd, color: c.textPrimary, padding: "10px 14px", borderBottom: `1px solid ${c.borderLight}`, whiteSpace: "nowrap" }}>{story}</td>
                <td style={{ ...font.body, color: c.textTertiary, padding: "10px 14px", borderBottom: `1px solid ${c.borderLight}` }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Built from the design system</H2>
      <Grid min={240}>
        <Card>
          <div style={{ ...font.h4, marginBottom: 8 }}>Foundation tokens</div>
          <div style={{ ...font.body, color: c.textTertiary, lineHeight: 1.6 }}>
            All colour, spacing, radius, typography, shadow and moderation values come from <code style={{ fontFamily: "var(--font-family-base)", background: c.bgSecondary, padding: "1px 5px", borderRadius: 4 }}>design-tokens.scss</code> via CSS custom properties — no hardcoded values.
          </div>
        </Card>
        <Card>
          <div style={{ ...font.h4, marginBottom: 8 }}>Base components</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Avatar", "Badge", "Input", "Button", "Empty", "Slider", "Tabs"].map((n) => <Chip key={n} tone="brand">{n}</Chip>)}
          </div>
          <div style={{ ...font.captionReg, color: c.textQuaternary, marginTop: 10 }}>Screens compose the CometChat base components; presence dots, dual avatars, poll and moderation styling are token-driven compositions on top.</div>
        </Card>
      </Grid>

      <H2>Boundaries</H2>
      <Card>
        <ul style={{ ...font.body, color: c.textTertiary, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
          <li>Historical review — <strong style={{ color: c.textSecondary }}>not</strong> a live monitoring tool.</li>
          <li>Admins can view, edit, delete and moderate — but <strong style={{ color: c.textSecondary }}>cannot send</strong> messages.</li>
          <li>Blocked content is admin-visible, clearly labelled “Blocked — visible to admins only”.</li>
          <li>Access is RBAC-gated to Owner, Admin and Moderator roles.</li>
        </ul>
      </Card>
    </Page>
  ),
};
