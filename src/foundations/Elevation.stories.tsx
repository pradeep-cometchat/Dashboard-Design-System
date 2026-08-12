import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "./tokens";
import { Page, Section, styles } from "./Foundations";

const meta: Meta = {
  title: "Foundations/Elevation & Effects",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

export const ElevationAndEffects: Story = {
  render: () => (
    <Page eyebrow="Foundations" title="Elevation & Effects" intro="Shadows convey elevation and hierarchy; focus rings communicate keyboard focus state; backdrop blur is used for overlays and glass surfaces.">
      <Section title="Shadows">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 28, padding: "12px 8px" }}>
          {tokens.shadows.map((s) => (
            <div key={s.name} style={{ textAlign: "center" }}>
              <div style={{ height: 88, background: "#fff", borderRadius: 12, boxShadow: s.value }} />
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 14 }}>{s.name.replace("shadow-", "")}</div>
              <div style={{ fontFamily: styles.mono, fontSize: 10.5, color: "#717680" }}>${s.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Focus rings">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 28, padding: "16px 8px" }}>
          {tokens.focusRings.map((f) => (
            <div key={f.name} style={{ textAlign: "center" }}>
              <div style={{ height: 44, background: "#fff", borderRadius: 8, boxShadow: f.value, border: "1px solid #e9eaeb" }} />
              <div style={{ fontFamily: styles.mono, fontSize: 11, color: "#535862", marginTop: 12 }}>${f.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Backdrop blur">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
          {tokens.blur.map((b) => (
            <div key={b.name} style={{ position: "relative", height: 96, borderRadius: 12, overflow: "hidden", background: "linear-gradient(135deg,#6852d6,#f04438 60%,#f79009)" }}>
              <div style={{ position: "absolute", inset: 0, backdropFilter: `blur(${b.value})`, WebkitBackdropFilter: `blur(${b.value})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontFamily: styles.mono, fontSize: 11 }}>{b.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
