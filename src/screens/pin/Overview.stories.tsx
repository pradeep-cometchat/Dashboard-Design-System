import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { c, s, r, font, shadow } from "../theme";

const meta: Meta = {
  title: "Screens/Pin/Overview",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

/* Doc-page chrome. Every value is a foundation token — colors, type, spacing,
   radius and elevation all resolve to CSS custom properties from tokens.css. */

const w = {
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
  bold: "var(--font-weight-bold)",
} as const;

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-family-base)", color: c.textPrimary, maxWidth: 1080, padding: `var(--spacing-4xl) var(--spacing-3xl)`, margin: "0 auto" }}>
      {children}
    </div>
  );
}
function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-display-sm)", lineHeight: "var(--line-height-display-sm)", letterSpacing: "var(--letter-spacing-display-sm)", fontWeight: w.bold, margin: `0 0 ${s.md}` }}>
      {children}
    </h1>
  );
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ ...font.body, fontSize: "var(--font-size-text-md)", lineHeight: "var(--line-height-text-md)", color: c.textTertiary, maxWidth: 760, margin: `0 0 ${s["3xl"]}` }}>{children}</p>;
}
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ ...font.caption, fontWeight: w.semibold, textTransform: "uppercase", color: c.textQuaternary, margin: `${s["4xl"]} 0 ${s.lg}`, paddingBottom: s.md, borderBottom: `1px solid ${c.borderDefault}` }}>
      {children}
    </h2>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, background: c.bgPrimary, padding: s.xl, boxShadow: shadow.xs }}>{children}</div>;
}

export const Overview: Story = {
  render: () => (
    <Page>
      <H1>Pin</H1>
      <Lead>
        Dashboard screens for the Pin feature, assembled from Foundations tokens and Base Components only — no
        hardcoded colors, type, spacing, radius or elevation anywhere in this folder.
      </Lead>

      <H2>Stories</H2>
      <Card>
        <div style={{ ...font.h4, marginBottom: s.sm }}>Settings</div>
        <div style={{ ...font.body, color: c.textTertiary }}>
          The Chats product settings screen — dashboard sidebar with the full navigation tree, General Configuration
          toggles (with an Experimental tag), the message-type matrix for conversation previews and unread counts, and
          the AI Copilot form. Source: Figma “❖ Dashboard--May 2026”, node 87-557883. Toggles, inputs, textareas and
          tags are Base Components; icons are the vendored May 2026 foundation set. The Pin section is the admin flow for pinning up to 5 conversations (users or groups): empty state from node 59-90300, a pinned list with drag-to-reorder and remove, and a picker modal that enforces the 5-pin limit.
        </div>
      </Card>
    </Page>
  ),
};
