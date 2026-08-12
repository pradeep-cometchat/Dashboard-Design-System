import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "./tokens";
import { Page, Section, styles } from "./Foundations";

const meta: Meta = {
  title: "Foundations/Spacing & Radius",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const label = { width: 84, flexShrink: 0, fontSize: 12, fontWeight: 600 } as const;
const val = { fontFamily: styles.mono, fontSize: 11, color: "#717680", width: 56, flexShrink: 0 } as const;

export const SpacingAndRadius: Story = {
  render: () => (
    <Page eyebrow="Foundations" title="Spacing & Radius" intro="The spacing scale drives padding, gaps, and layout rhythm; the radius scale controls corner rounding across components.">
      <Section title="Spacing">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tokens.spacing.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={label}>{s.name}</div>
              <div style={val}>{s.value}</div>
              <div style={{ height: 16, width: Math.max(parseInt(s.value, 10), 1), background: "#7b70e4", borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Border radius">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16 }}>
          {tokens.radius.map((r) => (
            <div key={r.name} style={{ textAlign: "center" }}>
              <div style={{ height: 72, background: "#ebe9fe", border: "1.5px solid #7b70e4", borderRadius: r.name === "full" ? 9999 : parseInt(r.value, 10) }} />
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{r.name}</div>
              <div style={{ fontFamily: styles.mono, fontSize: 11, color: "#717680" }}>{r.value}</div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
