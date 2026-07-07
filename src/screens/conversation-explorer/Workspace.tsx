import React from "react";
import CometChatEmpty from "components/base/Empty/CometChatEmpty";
import { c, s, r, font } from "./theme";
import { FeaturedIcon, MessageTextCircle02 } from "./icons";

/** Center-panel empty state (no conversation selected). Figma: bg background-02, featured icon, no pattern. */
export function ConversationEmpty() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: s["3xl"], background: c.bgSecondary }}>
      <CometChatEmpty
        size="sm"
        iconType="featured-icon"
        showBackgroundPattern={false}
        icon={<FeaturedIcon><MessageTextCircle02 /></FeaturedIcon>}
        title="Select a conversation"
        description="Choose a conversation from the list to view messages"
      />
    </div>
  );
}

/**
 * The Conversation Explorer workspace: page header + 3-panel card.
 * `left`, `center`, `right` are the panel slots. `overlay` renders above everything.
 * `headerActions` renders on the top-right of the page header (e.g. export buttons).
 */
export function Workspace({ left, center, right, overlay, headerActions }: {
  left: React.ReactNode; center: React.ReactNode; right: React.ReactNode; overlay?: React.ReactNode; headerActions?: React.ReactNode;
}) {
  return (
    <div style={{ background: c.bgPrimary, height: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column", padding: s["3xl"], fontFamily: "var(--font-family-base)" }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: s.lg, marginBottom: s.xl }}>
        <div>
          <div style={font.pageTitle}>Conversation Explorer</div>
          <div style={{ ...font.body, color: c.textTertiary, marginTop: s.xs }}>Browse and review conversations across your app.</div>
        </div>
        {headerActions}
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "340px 1fr 340px", border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden", background: c.bgPrimary }}>
        <div style={{ borderRight: `1px solid ${c.borderLight}`, minWidth: 0, overflow: "hidden" }}>{left}</div>
        <div style={{ borderRight: `1px solid ${c.borderLight}`, minWidth: 0, overflow: "hidden" }}>{center}</div>
        <div style={{ minWidth: 0, overflow: "hidden" }}>{right}</div>
        {overlay}
      </div>
    </div>
  );
}
