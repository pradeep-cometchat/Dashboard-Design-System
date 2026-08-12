import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { tokens } from "./tokens";
import { Page, Section, CodeBlock, InlineCode, styles } from "./Foundations";
import { base2026, ramps2026, semantic2026 } from "./colors-may2026";
import { scale2026 } from "./typography-may2026";
import { spacing2026, radius2026 } from "./spacing-may2026";

const meta: Meta = {
  title: "Foundations/Overview",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;

/** Colors, Typography and Spacing & Radius are documented from the May 2026 file; Elevation still tracks the shipping tokens. */
const count = {
  primitives: base2026.length + ramps2026.reduce((a, r) => a + r.steps.length, 0),
  semantic: Object.values(semantic2026).reduce((a, s) => a + s.length, 0),
  levels: scale2026.length,
  spacing: spacing2026.length,
  radius: radius2026.length,
  shadows: tokens.shadows.length,
};
const total = count.primitives + count.semantic + count.levels + count.spacing + count.radius + count.shadows;

/* ---------- category preview cards ---------- */

function CardShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${ink.border}`, borderRadius: 14, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 96, background: ink.bgSubtle, borderBottom: `1px solid ${ink.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 16px" }}>
        {children}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 13, color: ink.tertiary, marginTop: 3 }}>{desc}</div>
      </div>
    </div>
  );
}

function ColorsPreview() {
  const dots = ["#6852d6", "#f04438", "#f79009", "#17b26a", "#2970ff", "#181d27"];
  return (
    <>
      {dots.map((d) => (
        <span key={d} style={{ width: 26, height: 26, borderRadius: 8, background: d, boxShadow: "inset 0 0 0 1px rgba(10,13,18,0.08)" }} />
      ))}
    </>
  );
}

function TypePreview() {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", color: ink.primary }}>Ag</span>
      <span style={{ fontSize: 24, fontWeight: 500, color: ink.tertiary }}>Ag</span>
      <span style={{ fontSize: 14, color: ink.quaternary }}>Ag</span>
    </div>
  );
}

function SpacingPreview() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
      {[8, 14, 22, 34, 50].map((w) => (
        <span key={w} style={{ width: w, height: 8, borderRadius: 4, background: "#7b70e4" }} />
      ))}
      <span style={{ width: 28, height: 28, marginLeft: 10, borderRadius: 10, border: `2px solid #7b70e4`, background: "#ebe9fe" }} />
    </div>
  );
}

function ShadowPreview() {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)" }} />
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", boxShadow: "0px 2px 4px -2px rgba(10,13,18,0.06), 0px 4px 6px -1px rgba(10,13,18,0.1)" }} />
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", boxShadow: "0px 12px 16px -4px rgba(10,13,18,0.08), 0px 4px 6px -2px rgba(10,13,18,0.03)" }} />
    </div>
  );
}

/* ---------- pipeline ---------- */

function PipelineStep({ step, title, path, desc }: { step: number; title: string; path: string; desc: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0, border: `1px solid ${ink.border}`, borderRadius: 12, background: "#fff", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: "#f4f3ff", border: "1px solid #d9d6fe", color: "#5925dc", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{step}</span>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ fontFamily: styles.mono, fontSize: 11.5, color: ink.brand, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{path}</div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: ink.tertiary }}>{desc}</div>
    </div>
  );
}

function Arrow() {
  return <span style={{ alignSelf: "center", color: ink.quaternary, fontSize: 18, flexShrink: 0 }}>→</span>;
}

/* ---------- principles ---------- */

const principles = [
  { title: "Single source of truth", desc: "Every value traces back to design-tokens.scss, which mirrors the Figma variables. Change it once — it propagates everywhere." },
  { title: "Semantic over primitive", desc: "Components reference role tokens (text-primary, bg-brand-solid), never raw ramp steps, so intent survives palette changes." },
  { title: "Nothing hardcoded", desc: "Screens and components consume tokens via CSS custom properties or the typed module — no inline hex, px, or font values." },
];

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="CometChat · Design System"
      title="Foundations"
      intro="The design tokens that everything else is built from. Primitives define the raw scales; semantic tokens map them to roles; components and screens only ever consume the semantic layer."
      meta={[
        <>Source: Figma “❖ Dashboard – Design System (May 2026)”</>,
        <>{total} tokens</>,
        <>Auto-generated — do not edit by hand</>,
      ]}
    >
      <Section title="Token categories" desc="Four families of tokens cover the entire visual language. Colors, Typography and Spacing & Radius document the May 2026 proposal; Elevation & Effects reflects the tokens shipping today.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
          <CardShell title="Colors (May 2026)" desc={`${count.primitives} primitives · ${count.semantic} semantic`}>
            <ColorsPreview />
          </CardShell>
          <CardShell title="Typography (May 2026)" desc={`${count.levels} levels · Satoshi family`}>
            <TypePreview />
          </CardShell>
          <CardShell title="Spacing & Radius (May 2026)" desc={`${count.spacing} spacing steps · ${count.radius} radii`}>
            <SpacingPreview />
          </CardShell>
          <CardShell title="Elevation & Effects" desc={`${count.shadows} shadows · focus rings · blur`}>
            <ShadowPreview />
          </CardShell>
        </div>
      </Section>

      <Section title="How tokens flow" desc="Tokens are authored once in SCSS and generated into the formats the codebase consumes.">
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          <PipelineStep step={1} title="Author" path="src/assets/design-tokens.scss" desc="SCSS variables exported from the Figma design system — the canonical values." />
          <Arrow />
          <PipelineStep step={2} title="Generate" path="scripts/generate-tokens.mjs" desc="Parses the SCSS, resolves references, and emits the typed + CSS layers." />
          <Arrow />
          <PipelineStep step={3} title="Consume" path="tokens.ts · tokens.css" desc="Typed values for TS/JS and CSS custom properties (var(--text-primary)) for styling." />
        </div>
      </Section>

      <Section title="Usage">
        <div style={{ display: "grid", gap: 14 }}>
          <CodeBlock
            label="Component styles — CSS custom properties (from tokens.css)"
            lines={[
              ".cc-button-primary {",
              "  background: var(--bg-brand-solid);",
              "  color: var(--text-white);",
              "  border-radius: var(--radius-md);",
              "  padding: var(--spacing-md) var(--spacing-lg);",
              "}",
            ]}
          />
          <CodeBlock
            label="Component SCSS — raw variables (from design-tokens.scss)"
            lines={[
              "@import '../../../../assets/design-tokens.scss';",
              "",
              ".cc-empty__title {",
              "  color: $text-primary;",
              "  font-weight: $font-weight-semibold;",
              "}",
            ]}
          />
          <CodeBlock
            label="Regenerate after editing design-tokens.scss"
            lines={["node scripts/generate-tokens.mjs"]}
          />
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: ink.tertiary, margin: "14px 0 0", maxWidth: 680 }}>
          Typed access is also available — <InlineCode>import {"{ tokens }"} from "src/foundations/tokens"</InlineCode> — for
          anything that needs token values in TypeScript (docs, charts, generated views).
        </p>
      </Section>

      <Section title="Principles">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {principles.map((p) => (
            <div key={p.title} style={{ border: `1px solid ${ink.border}`, borderRadius: 12, background: "#fff", padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: ink.tertiary }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
