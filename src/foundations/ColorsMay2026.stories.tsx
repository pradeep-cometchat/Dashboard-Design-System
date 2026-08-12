import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { tokens } from "./tokens";
import { Page, Section, Ramp, TokenTable, MetaChip, styles } from "./Foundations";
import { SOURCE, base2026, ramps2026, semantic2026, type NewToken } from "./colors-may2026";

const meta: Meta = {
  title: "Foundations/Colors (May 2026)",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;

/* ---------- shared bits ---------- */

function Chip({ value }: { value: string }) {
  return <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: 5, background: value, boxShadow: "inset 0 0 0 1px rgba(10,13,18,0.1)", verticalAlign: "middle" }} />;
}
const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: ink.tertiary }}>{children}</code>
);
const eq = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

/* ---------- diff engine (computed against the current tokens.ts) ---------- */

type Delta = { group: string; figmaName: string; current?: { name: string; value: string }; next?: { name: string; value: string } };

function computeDiff() {
  const groups: ("text" | "border" | "foreground" | "background")[] = ["text", "border", "foreground", "background"];
  const changed: Delta[] = [];
  const added: Delta[] = [];
  const removed: Delta[] = [];
  let unchanged = 0;

  for (const g of groups) {
    const current = new Map(tokens.semantic[g].map((t) => [t.name, t.value]));
    const claimed = new Set<string>();
    for (const nt of semantic2026[g]) {
      if (nt.maps && current.has(nt.maps)) {
        claimed.add(nt.maps);
        const cur = current.get(nt.maps)!;
        if (eq(cur, nt.value)) unchanged++;
        else changed.push({ group: g, figmaName: nt.name, current: { name: nt.maps, value: cur }, next: { name: nt.name, value: nt.value } });
      } else {
        added.push({ group: g, figmaName: nt.name, next: { name: nt.name, value: nt.value } });
      }
    }
    for (const t of tokens.semantic[g]) {
      if (!claimed.has(t.name)) removed.push({ group: g, figmaName: "—", current: { name: t.name, value: t.value } });
    }
  }

  // base colors
  const baseCurrent = new Map(tokens.base.map((t) => [t.name, t.value]));
  const baseClaimed = new Set<string>();
  for (const b of base2026) {
    if (b.maps && baseCurrent.has(b.maps)) {
      baseClaimed.add(b.maps);
      const cur = baseCurrent.get(b.maps)!;
      if (eq(cur, b.value)) unchanged++;
      else changed.push({ group: "base", figmaName: b.name, current: { name: b.maps, value: cur }, next: { name: b.name, value: b.value } });
    } else added.push({ group: "base", figmaName: b.name, next: { name: b.name, value: b.value } });
  }
  for (const t of tokens.base) {
    if (!baseClaimed.has(t.name)) removed.push({ group: "base", figmaName: "—", current: { name: t.name, value: t.value } });
  }

  // ramps
  const rampChanges = ramps2026.map((r) => {
    const cur = (tokens.primitives as Record<string, readonly { step: string; value: string }[]>)[r.maps] ?? [];
    const curMap = new Map(cur.map((s) => [s.step, s.value]));
    const diffs = r.steps.filter((s) => !eq(curMap.get(s.step), s.value)).map((s) => ({ step: s.step, from: curMap.get(s.step), to: s.value }));
    return { family: r.family, maps: r.maps, total: r.steps.length, diffs };
  });
  const rampChangedSteps = rampChanges.reduce((a, r) => a + r.diffs.length, 0);
  const rampUnchangedSteps = rampChanges.reduce((a, r) => a + (r.total - r.diffs.length), 0);

  return { changed, added, removed, unchanged, rampChanges, rampChangedSteps, rampUnchangedSteps };
}

const diff = computeDiff();

const pageMeta = [
  <>Source: Figma “{SOURCE.file}”</>,
  <>Nodes: {SOURCE.nodes.map((n) => n.id).join(" · ")}</>,
  <>Pulled via Figma MCP</>,
];

/* ---------- stories ---------- */

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Colors (May 2026)"
      intro="The color palette from the new “Dashboard – Design System (May 2026)” Figma file, documented alongside the current foundations for review. Nothing in the current token set has been changed — this folder is the staging ground for the migration."
      meta={pageMeta}
    >
      <Section title="Change summary" desc="Computed live against the current design-tokens.scss-derived tokens.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {[
            { n: diff.unchanged + diff.rampUnchangedSteps, label: "Unchanged values", color: "#079455" },
            { n: diff.changed.length + diff.rampChangedSteps, label: "Changed values", color: "#dc6803" },
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
          <li><strong>New Brand ramp</strong> — 11 of 12 steps re-tuned around the same anchor <Code>#6852d6</Code> (600). Hovers move from the old vivid purple (<Code>#5925dc</Code>) to a muted <Code>#5b45bd</Code>.</li>
          <li><strong>Info is a new blue</strong> — the entire 25→950 ramp changes (500: <Code>#2970ff → #2e90fa</Code>).</li>
          <li><strong>Base black is now pure</strong> — <Code>#0a0d12 → #000000</Code>; a separate <Code>BG Black Solid</Code> pair covers the old near-black surface.</li>
          <li><strong>Neutral, Error, Warning, Success ramps are identical</strong> — no migration needed there.</li>
          <li><strong>4 current tokens have no May-2026 counterpart</strong> — see “Changes vs Current” for the exact list.</li>
        </ul>
      </Section>

      <Section title="Needs design review">
        <div style={{ border: "1px solid #fedf89", background: "#fffaeb", borderRadius: 12, padding: "14px 16px", maxWidth: 720 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "#b54708" }}>
            <strong>BG Disabled Subtle = <Code>#13161b</Code></strong> — a near-black value for a light-mode disabled surface
            (currently <Code>#fafafa</Code>). This looks like a dark-mode value slip in the Figma variables; confirm before migrating.
          </div>
        </div>
      </Section>

      <Section title="In this folder">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.tertiary, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: ink.primary }}>Primitive Ramps</strong> — the seven May-2026 ramps, flagged where they differ.</li>
          <li><strong style={{ color: ink.primary }}>Semantic Colors</strong> — all 80 semantic tokens with their current-token mapping.</li>
          <li><strong style={{ color: ink.primary }}>Changes vs Current</strong> — the full changed / added / removed breakdown.</li>
        </ul>
      </Section>
    </Page>
  ),
};

export const Primitives: Story = {
  name: "Primitive Ramps",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Primitive Ramps (May 2026)" intro="The seven tonal ramps from the May 2026 file. Families marked “changed” differ from the current foundations; the rest are identical." meta={pageMeta}>
      <Section title="Ramps">
        {ramps2026.map((r) => {
          const rc = diff.rampChanges.find((x) => x.family === r.family)!;
          return (
            <div key={r.family} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: -12 }}>
                <span style={{ width: 140 }} />
                {rc.diffs.length > 0
                  ? <MetaChip><span style={{ color: "#b54708" }}>{rc.diffs.length}/{rc.total} steps changed</span></MetaChip>
                  : <MetaChip><span style={{ color: "#067647" }}>identical to current</span></MetaChip>}
              </div>
              <Ramp label={r.family} steps={r.steps} />
            </div>
          );
        })}
      </Section>
    </Page>
  ),
};

function semanticRows(items: NewToken[]) {
  return items.map((t) => [
    <Chip value={t.value} />,
    <span style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</span>,
    t.maps ? <Code>${t.maps}</Code> : <span style={{ fontSize: 12, fontWeight: 600, color: "#5925dc" }}>new token</span>,
    <Code>{t.value}</Code>,
  ]);
}

export const Semantic: Story = {
  name: "Semantic Colors",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Semantic Colors (May 2026)" intro="Every semantic color from the May 2026 file, with the current token it corresponds to. “New token” marks roles that don’t exist in the current foundations." meta={pageMeta}>
      <Section title="Base">
        <TokenTable head={["", "Figma variable", "Maps to (current)", "Value"]} rows={semanticRows(base2026)} />
      </Section>
      <Section title="Text">
        <TokenTable head={["", "Figma variable", "Maps to (current)", "Value"]} rows={semanticRows(semantic2026.text)} />
      </Section>
      <Section title="Border">
        <TokenTable head={["", "Figma variable", "Maps to (current)", "Value"]} rows={semanticRows(semantic2026.border)} />
      </Section>
      <Section title="Foreground (Icons)">
        <TokenTable head={["", "Figma variable", "Maps to (current)", "Value"]} rows={semanticRows(semantic2026.foreground)} />
      </Section>
      <Section title="Background">
        <TokenTable head={["", "Figma variable", "Maps to (current)", "Value"]} rows={semanticRows(semantic2026.background)} />
      </Section>
    </Page>
  ),
};

export const Changes: Story = {
  name: "Changes vs Current",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Changes vs Current" intro="A complete, computed comparison between the current foundations and the May 2026 palette — what changed, what’s new, and what has no counterpart." meta={pageMeta}>
      <Section title={`Changed semantic values (${diff.changed.length})`} desc="Same role, different value.">
        <TokenTable
          head={["Group", "Token", "Current", "", "May 2026", ""]}
          rows={diff.changed.map((d) => [
            <span style={{ fontSize: 12, color: ink.quaternary, textTransform: "capitalize" }}>{d.group}</span>,
            <span style={{ fontWeight: 600, fontSize: 13 }}>{d.figmaName}</span>,
            <Code>{d.current!.value}</Code>, <Chip value={d.current!.value} />,
            <Code>{d.next!.value}</Code>, <Chip value={d.next!.value} />,
          ])}
        />
      </Section>

      <Section title={`Changed ramp steps (${diff.rampChangedSteps})`} desc="Primitive steps whose value moved. Neutral, Error, Warning and Success are untouched.">
        {diff.rampChanges.filter((r) => r.diffs.length > 0).map((r) => (
          <div key={r.family} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{r.family} <span style={{ fontWeight: 400, color: ink.quaternary }}>({r.diffs.length}/{r.total} steps)</span></div>
            <TokenTable
              head={["Step", "Current", "", "May 2026", ""]}
              rows={r.diffs.map((s) => [
                <span style={{ fontWeight: 600, fontSize: 13 }}>{s.step}</span>,
                <Code>{s.from ?? "—"}</Code>, s.from ? <Chip value={s.from} /> : <span />,
                <Code>{s.to}</Code>, <Chip value={s.to} />,
              ])}
            />
          </div>
        ))}
      </Section>

      <Section title={`New tokens (${diff.added.length})`} desc="Roles in the May 2026 file with no current equivalent.">
        <TokenTable
          head={["Group", "Figma variable", "Value", ""]}
          rows={diff.added.map((d) => [
            <span style={{ fontSize: 12, color: ink.quaternary, textTransform: "capitalize" }}>{d.group}</span>,
            <span style={{ fontWeight: 600, fontSize: 13 }}>{d.figmaName}</span>,
            <Code>{d.next!.value}</Code>, <Chip value={d.next!.value} />,
          ])}
        />
      </Section>

      <Section title={`Current tokens with no May-2026 counterpart (${diff.removed.length})`} desc="These exist in design-tokens.scss today but have no matching variable in the new file — either dropped intentionally or renamed beyond recognition. Confirm with design before deleting.">
        <TokenTable
          head={["Group", "Current token", "Value", ""]}
          rows={diff.removed.map((d) => [
            <span style={{ fontSize: 12, color: ink.quaternary, textTransform: "capitalize" }}>{d.group}</span>,
            <Code>${d.current!.name}</Code>,
            <Code>{d.current!.value}</Code>, <Chip value={d.current!.value} />,
          ])}
        />
      </Section>
    </Page>
  ),
};
