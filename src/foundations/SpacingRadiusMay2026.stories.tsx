import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { tokens } from "./tokens";
import { Page, Section, TokenTable, styles } from "./Foundations";
import { SOURCE, spacing2026, spacingVariableOnly2026, radius2026, layout2026 } from "./spacing-may2026";
import { rem } from "./typography-may2026";

const meta: Meta = {
  title: "Foundations/Spacing & Radius (May 2026)",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;
const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: ink.tertiary }}>{children}</code>
);

/* ---------- diff engine (computed against current tokens.ts) ---------- */

function computeDiff() {
  const curSpacing = new Map(tokens.spacing.map((s) => [s.name, parseInt(s.value, 10) || 0]));
  const curRadius = new Map(tokens.radius.map((s) => [s.name, s.value === "9999px" ? 9999 : parseInt(s.value, 10) || 0]));

  const claimedS = new Set<string>();
  const claimedR = new Set<string>();
  let unchanged = 0;
  const changed: { name: string; from: number; to: number }[] = [];

  for (const t of [...spacing2026, ...spacingVariableOnly2026]) {
    if (t.maps && curSpacing.has(t.maps)) {
      claimedS.add(t.maps);
      const cur = curSpacing.get(t.maps)!;
      if (cur === t.px) unchanged++;
      else changed.push({ name: t.name, from: cur, to: t.px });
    }
  }
  for (const t of radius2026) {
    if (t.maps && curRadius.has(t.maps)) {
      claimedR.add(t.maps);
      const cur = curRadius.get(t.maps)!;
      if (cur === t.px) unchanged++;
      else changed.push({ name: t.name, from: cur, to: t.px });
    }
  }
  const removed = [
    ...tokens.spacing.filter((s) => !claimedS.has(s.name)).map((s) => ({ group: "spacing", name: `spacing-${s.name}`, value: s.value })),
    ...tokens.radius.filter((s) => !claimedR.has(s.name)).map((s) => ({ group: "radius", name: `radius-${s.name}`, value: s.value })),
  ];
  return { unchanged, changed, removed, added: layout2026 };
}

const diff = computeDiff();

const pageMeta = [
  <>Source: Figma “{SOURCE.file}”</>,
  <>Frames: Spacing · Radius</>,
  <>Pulled via Figma MCP</>,
];

/* ---------- stories ---------- */

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Spacing & Radius (May 2026)"
      intro="The spacing and radius scales from the May 2026 Figma file, documented alongside the current foundations. Values are stable — the change is a smaller documented spacing scale plus two new layout variables."
      meta={pageMeta}
    >
      <Section title="Change summary" desc="Computed live against the current design-tokens.scss-derived tokens.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {[
            { n: diff.unchanged, label: "Unchanged values", color: "#079455" },
            { n: diff.changed.length, label: "Changed values", color: "#dc6803" },
            { n: diff.added.length, label: "New tokens", color: "#6852d6" },
            { n: diff.removed.length, label: "Not in May 2026", color: "#d92d20" },
          ].map((s) => (
            <div key={s.label} style={{ border: `1px solid ${ink.border}`, borderRadius: 12, padding: 16, background: "#fff" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: ink.tertiary, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Headline changes">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.secondary, margin: 0, paddingLeft: 18, maxWidth: 720 }}>
          <li><strong>Every documented value is identical</strong> — no spacing or radius step changes size.</li>
          <li><strong>The documented spacing scale ends at 8xl (80px)</strong> — <Code>spacing-9xl</Code> (96) and <Code>spacing-11xl</Code> (160) have no May-2026 counterpart; <Code>spacing-10xl</Code> (128) survives as a variable but is outside the documented table.</li>
          <li><strong>Radius is untouched</strong> — all 11 steps match, names and values.</li>
          <li><strong>Two new layout variables</strong> — <Code>width-2xl</Code> (1024) and <Code>paragraph-max-width</Code> (720).</li>
        </ul>
      </Section>

      <Section title="In this folder">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.tertiary, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: ink.primary }}>Scales</strong> — the documented spacing and radius tables with px + rem, as on the Figma page.</li>
          <li><strong style={{ color: ink.primary }}>Changes vs Current</strong> — dropped steps and new layout variables.</li>
        </ul>
      </Section>
    </Page>
  ),
};

export const Scales: Story = {
  name: "Scales",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Scales (May 2026)" intro="The documented spacing and radius scales, annotated as on the Figma page: name, rem (16px base), px, and a live sample." meta={pageMeta}>
      <Section title="Spacing" desc="14 documented steps. spacing-10xl (128px) exists as a variable outside this table.">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {spacing2026.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 14px", borderBottom: `1px solid ${ink.borderLight}` }}>
              <div style={{ width: 120, flexShrink: 0, fontSize: 13, fontWeight: 700 }}>{s.name}</div>
              <div style={{ width: 90, flexShrink: 0, fontFamily: styles.mono, fontSize: 12, color: ink.quaternary }}>{rem(s.px)}</div>
              <div style={{ width: 60, flexShrink: 0, fontFamily: styles.mono, fontSize: 12, color: ink.quaternary }}>{s.px}px</div>
              <div style={{ height: 14, width: Math.max(s.px, 1), background: "#7a70e4", borderRadius: 3 }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius" desc="11 documented steps — identical to the current foundations.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
          {radius2026.map((r) => (
            <div key={r.name} style={{ border: `1px solid ${ink.border}`, borderRadius: 12, background: "#fff", padding: 14 }}>
              <div style={{ height: 64, background: "#f0f2fd", border: "1.5px solid #7a70e4", borderTopLeftRadius: Math.min(r.px, 32), borderTopRightRadius: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} />
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>{r.name}</div>
              <div style={{ fontFamily: styles.mono, fontSize: 11, color: ink.quaternary, marginTop: 2 }}>{r.px === 9999 ? "∞ · 9999px" : `${rem(r.px)} · ${r.px}px`}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Layout variables" desc="New in May 2026 — width constraints used by page layouts.">
        <TokenTable
          head={["Token", "Value", "rem"]}
          rows={layout2026.map((l) => [
            <Code>{l.name}</Code>,
            <Code>{l.px}px</Code>,
            <Code>{rem(l.px)}</Code>,
          ])}
        />
      </Section>
    </Page>
  ),
};

export const Changes: Story = {
  name: "Changes vs Current",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Changes vs Current" intro="A complete, computed comparison between the current spacing/radius tokens and the May 2026 scales." meta={pageMeta}>
      <Section title={`Unchanged values (${diff.unchanged})`} desc="Every documented spacing step (plus the spacing-10xl variable) and all 11 radius steps match the current foundations exactly." >
        <div style={{ border: "1px solid #abefc6", background: "#ecfdf3", borderRadius: 12, padding: "12px 16px", maxWidth: 720, fontSize: 13.5, color: "#067647" }}>
          No value migrations needed for spacing or radius.
        </div>
      </Section>

      {diff.changed.length > 0 && (
        <Section title={`Changed values (${diff.changed.length})`}>
          <TokenTable head={["Token", "Current", "May 2026"]} rows={diff.changed.map((c) => [<Code>{c.name}</Code>, <Code>{c.from}px</Code>, <Code>{c.to}px</Code>])} />
        </Section>
      )}

      <Section title={`New tokens (${diff.added.length})`} desc="Layout variables with no current equivalent.">
        <TokenTable
          head={["Token", "Value", "Purpose"]}
          rows={[
            [<Code>width-2xl</Code>, <Code>1024px</Code>, <span style={{ fontSize: 13, color: ink.tertiary }}>Standard content width constraint</span>],
            [<Code>paragraph-max-width</Code>, <Code>720px</Code>, <span style={{ fontSize: 13, color: ink.tertiary }}>Readable line-length cap for body copy</span>],
          ]}
        />
      </Section>

      <Section title={`Current tokens with no May-2026 counterpart (${diff.removed.length})`} desc="Off the end of the documented scale. Confirm with design before deleting — audit usages first.">
        <TokenTable
          head={["Group", "Current token", "Value"]}
          rows={diff.removed.map((r) => [
            <span style={{ fontSize: 12, color: ink.quaternary, textTransform: "capitalize" }}>{r.group}</span>,
            <Code>${r.name}</Code>,
            <Code>{r.value}</Code>,
          ])}
        />
      </Section>
    </Page>
  ),
};
