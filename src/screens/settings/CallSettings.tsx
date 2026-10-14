// Call Settings — settings screen. Same layout as Screens/Pin/Settings, reusing
// its ToggleRow and settings card. Foundation tokens + base components only.
import { c, s, font } from "../theme";
import { DashboardFrame, dim } from "../pin/ui";
import { SettingsCard, ToggleRow } from "../pin/Settings";
import TextLink from "../TextLink";

const w = {
  semibold: "var(--font-weight-semibold)",
} as const;

/**
 * Calls V1 → V2 migration guide. Placeholder: the CometChat docs have no "V1 to V2" calls page —
 * the closest is the Calls SDK v4 → v5 guide (per platform). Swap in the real URL.
 */
const MIGRATION_GUIDE_URL = "https://www.cometchat.com/docs/calls/javascript/migration-guide-v5";

export default function CallSettingsScreen() {
  return (
    <DashboardFrame active="Voice & Video">
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

        <div style={{ display: "flex", flexDirection: "column", gap: s.xl }}>
          <SettingsCard>
            <ToggleRow on label="Use Calls V2" desc="When this is on, voice and video calls in this app run on V2 instead of V1." />
          </SettingsCard>

          {/* Migration guide: copy, then the link out. */}
          <SettingsCard>
            <div style={{ display: "flex", flexDirection: "column", gap: s.xs }}>
              <h2 style={{ ...font.h4, fontWeight: w.semibold as unknown as number, color: c.textPrimary, margin: 0 }}>Migrating from V1 to V2</h2>
              <span style={{ ...font.body, color: c.textTertiary }}>
                Read the migration guide to see what changes in V2 and what to update in your app before you switch.
              </span>
              <span style={{ marginTop: s.md }}>
                <TextLink href={MIGRATION_GUIDE_URL}>View migration guide</TextLink>
              </span>
            </div>
          </SettingsCard>
        </div>
      </div>
    </DashboardFrame>
  );
}
