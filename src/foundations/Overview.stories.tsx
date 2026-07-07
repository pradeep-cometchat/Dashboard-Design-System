import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "./tokens";
import { Page, Section, styles } from "./Foundations";

const meta: Meta = {
  title: "Foundations/Overview",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const count = {
  primitives: Object.values(tokens.primitives).reduce((a, s) => a + s.length, 0),
  semantic: Object.values(tokens.semantic).reduce((a, s) => a + s.length, 0),
  sizes: tokens.typography.sizes.length,
  spacing: tokens.spacing.length,
  radius: tokens.radius.length,
  shadows: tokens.shadows.length,
};

const cards = [
  { title: "Colors", desc: `${count.primitives} primitives · ${count.semantic} semantic tokens`, sample: ["#6852d6", "#f04438", "#f79009", "#17b26a", "#2970ff"] },
  { title: "Typography", desc: `${count.sizes} sizes · Satoshi family`, sample: [] },
  { title: "Spacing & Radius", desc: `${count.spacing} spacing steps · ${count.radius} radii`, sample: [] },
  { title: "Elevation & Effects", desc: `${count.shadows} shadows · focus rings · blur`, sample: [] },
];

export const Overview: Story = {
  render: () => (
    <Page
      title="Foundations"
      intro="Design tokens for the CometChat Dashboard, generated from Figma “❖ Dashboard – Design System (New)” and sourced from the customer-dashboard repo’s design-tokens.scss. These primitives and semantic tokens are the single source of truth for every component in this library."
    >
      <Section title="Token categories">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {cards.map((c) => (
            <div key={c.title} style={{ border: "1px solid #e9eaeb", borderRadius: 12, padding: 18, background: "#fff" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "#535862", marginTop: 4 }}>{c.desc}</div>
              {c.sample.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                  {c.sample.map((s) => (
                    <span key={s} style={{ width: 28, height: 28, borderRadius: 6, background: s, boxShadow: "inset 0 0 0 1px rgba(10,13,18,0.08)" }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#414651", maxWidth: 720 }}>
          Import the raw SCSS variables from{" "}
          <code style={{ fontFamily: styles.mono, fontSize: 13, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>src/assets/design-tokens.scss</code>{" "}
          in components, or consume the typed values from{" "}
          <code style={{ fontFamily: styles.mono, fontSize: 13, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>src/foundations/tokens.ts</code>.
          The typed module is auto-generated from the SCSS — run{" "}
          <code style={{ fontFamily: styles.mono, fontSize: 13, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4 }}>node scripts/generate-tokens.mjs</code>{" "}
          to regenerate it whenever the tokens change.
        </p>
      </Section>
    </Page>
  ),
};
