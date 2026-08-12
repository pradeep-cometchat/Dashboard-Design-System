import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { tokens } from "./tokens";
import { Page, Section, TokenTable, MetaChip, styles } from "./Foundations";
import { SOURCE, families2026, weights2026, scale2026, LETTER_SPACING_2026, rem } from "./typography-may2026";

const meta: Meta = {
  title: "Foundations/Typography (May 2026)",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;
const satoshi = styles.sans; // Satoshi-first stack

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: ink.tertiary }}>{children}</code>
);

/* ---------- diff engine (computed against current tokens.ts) ---------- */

function computeDiff() {
  const current = new Map(tokens.typography.sizes.map((s) => [s.name, s]));
  const claimed = new Set<string>();
  const same: { level: string; maps: string }[] = [];
  const changed: { level: string; maps: string; what: string; from: string; to: string }[] = [];

  for (const l of scale2026) {
    if (!l.maps || !current.has(l.maps)) continue;
    claimed.add(l.maps);
    const cur = current.get(l.maps)!;
    const curSize = parseInt(cur.size, 10);
    const curLine = parseInt(cur.line, 10);
    const curLS = cur.spacing === "normal" ? "0" : cur.spacing;
    let identical = true;
    if (curSize !== l.size || curLine !== l.line) {
      identical = false;
      changed.push({ level: l.name, maps: l.maps, what: "size / line-height", from: `${curSize}px / ${curLine}px`, to: `${l.size}px / ${l.line}px` });
    }
    if (curLS !== LETTER_SPACING_2026) {
      identical = false;
      changed.push({ level: l.name, maps: l.maps, what: "letter-spacing", from: curLS, to: LETTER_SPACING_2026 });
    }
    if (identical) same.push({ level: l.name, maps: l.maps });
  }
  const removed = tokens.typography.sizes.filter((s) => !claimed.has(s.name));
  const newStyles = scale2026.reduce((a, l) => a + l.styles.length, 0);
  return { same, changed, removed, newStyles };
}

const diff = computeDiff();

const pageMeta = [
  <>Source: Figma “{SOURCE.file}”</>,
  <>Node: {SOURCE.nodes[0].id}</>,
  <>Figma placeholder Inter → rendered as Satoshi</>,
];

/* ---------- stories ---------- */

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Typography (May 2026)"
      intro="The type system from the May 2026 Figma file, documented alongside the current foundations. The scale moves from size-based names (display-xl … text-xs) to semantic levels (Title, H1–H4, Body, Caption), each with four composed weight styles."
      meta={pageMeta}
    >
      <Section title="Font family" desc="One important translation applies to everything on these pages:">
        <div style={{ border: "1px solid #d9d6fe", background: "#f4f3ff", borderRadius: 12, padding: "14px 16px", maxWidth: 720 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "#5925dc" }}>
            The Figma file uses <strong>Inter</strong> as a placeholder family. The Dashboard's real typeface is{" "}
            <strong>Satoshi</strong> — all levels here are documented and rendered as Satoshi.
          </div>
        </div>
      </Section>

      <Section title="Change summary" desc="Computed live against the current design-tokens.scss-derived tokens.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {[
            { n: diff.same.length, label: "Levels unchanged", color: "#079455" },
            { n: diff.changed.length, label: "Changed values", color: "#dc6803" },
            { n: diff.newStyles, label: "New composed styles", color: "#6852d6" },
            { n: diff.removed.length, label: "Sizes not in May 2026", color: "#d92d20" },
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
          <li><strong>The Display ladder renumbers</strong> — 32px <Code>display-sm → display-md</Code>, 24px <Code>display-xs → display-sm</Code>, and 20px <Code>text-xl → display-xs</Code> (H2 joins the Display family). H3 → Caption keep <Code>text-lg … text-xs</Code>.</li>
          <li><strong>Title line-height</strong> — 32px now sits on <Code>40</Code> (was <Code>38</Code>).</li>
          <li><strong>Letter-spacing flattens to 0</strong> — Display XL/LG drop the current <Code>-0.02em</Code> tracking.</li>
          <li><strong>Two family roles</strong> — <Code>Display</Code> (Title, H1, H2) and <Code>Body</Code> (H3 → Caption), replacing the current three Satoshi aliases.</li>
          <li><strong>{diff.newStyles} composed styles</strong> — every level from Title to Caption now ships Regular / Medium / Semibold / Bold variants.</li>
          <li><strong>Documented scale is Title → Caption (7 levels)</strong> — <Code>display-xl</Code> and <Code>display-lg</Code> live on as size-only variables (60/72, 48/60), outside the scale.</li>
          <li><strong>Dropped sizes</strong> — {diff.removed.map((r) => r.name).join(" and ")} have no May-2026 counterpart.</li>
        </ul>
      </Section>

      <Section title="In this folder">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.tertiary, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: ink.primary }}>Type Styles</strong> — the full scale with live Satoshi specimens in all four weights.</li>
          <li><strong style={{ color: ink.primary }}>Changes vs Current</strong> — renames, value changes, and dropped sizes.</li>
        </ul>
      </Section>
    </Page>
  ),
};

export const TypeStyles: Story = {
  name: "Type Styles",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Type Styles (May 2026)" intro="Each level with its live Satoshi specimen. Levels marked “Display” use the Display family role; the rest use Body. All levels use letter-spacing 0." meta={pageMeta}>
      <Section title="Families">
        <TokenTable
          head={["Role", "Dashboard font", "Figma placeholder", "Used by"]}
          rows={families2026.map((f) => [
            <span style={{ fontWeight: 700, fontSize: 13 }}>{f.role}</span>,
            <span style={{ fontFamily: satoshi, fontSize: 13 }}>{f.font}</span>,
            <Code>{f.figmaPlaceholder}</Code>,
            <span style={{ fontSize: 13, color: ink.tertiary }}>{f.usedBy}</span>,
          ])}
        />
      </Section>

      <Section title="Weights">
        <TokenTable
          head={["Style", "Weight", "Sample"]}
          rows={weights2026.map((w) => [
            <span style={{ fontWeight: 600, fontSize: 13 }}>{w.name}</span>,
            <Code>{w.value}</Code>,
            <span style={{ fontFamily: satoshi, fontWeight: w.value, fontSize: 16 }}>Send a message</span>,
          ])}
        />
      </Section>

      <Section title="Scale" desc="The seven levels documented on the Figma Typography page, named per the current foundations tokens (Figma level name alongside). Annotations match the Figma page: px and rem.">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {scale2026.filter((l) => l.inScale).map((l) => (
            <div key={l.name} style={{ padding: "18px 14px", borderBottom: `1px solid ${ink.borderLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{l.token}</span>
                  <span style={{ fontSize: 11.5, color: ink.quaternary }}>Figma: {l.name}</span>
                  <span style={{ display: "inline-flex", padding: "1px 8px", borderRadius: 999, background: l.family === "Display" ? "#f4f3ff" : ink.bgSubtle, border: `1px solid ${l.family === "Display" ? "#d9d6fe" : ink.border}`, fontSize: 11, fontWeight: 600, color: l.family === "Display" ? "#5925dc" : ink.tertiary }}>{l.family}</span>
                </span>
                <span style={{ fontSize: 13, color: ink.tertiary }}>
                  Font size: {l.size}px / {rem(l.size)} <span style={{ color: ink.border }}>|</span> Line height: {l.line}px / {rem(l.line)}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {l.styles.map((w) => (
                  <div key={w} style={{ minWidth: 0, overflow: "hidden" }}>
                    <div style={{ fontFamily: satoshi, fontSize: Math.min(l.size, 40), lineHeight: `${Math.min(l.line, 50)}px`, fontWeight: w, letterSpacing: 0, color: ink.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.name}</div>
                    <div style={{ fontFamily: satoshi, fontSize: 13, color: ink.quaternary, marginTop: 4 }}>{weights2026.find((x) => x.value === w)?.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Size-only variables" desc="Defined in the file's variable collection but not part of the documented type scale — no composed weight styles.">
        <TokenTable
          head={["Token", "Figma variable", "Font size", "Line height"]}
          rows={scale2026.filter((l) => !l.inScale).map((l) => [
            <Code>${l.token}</Code>,
            <span style={{ fontSize: 13 }}>{l.name.toLowerCase().replace(" ", "-")}</span>,
            <Code>{l.size}px / {rem(l.size)}</Code>,
            <Code>{l.line}px / {rem(l.line)}</Code>,
          ])}
        />
      </Section>
    </Page>
  ),
};

export const Changes: Story = {
  name: "Changes vs Current",
  render: () => (
    <Page eyebrow="Foundations · Proposed update" title="Changes vs Current" intro="A complete, computed comparison between the current type tokens and the May 2026 system." meta={pageMeta}>
      <Section title={`Renamed levels, same values (${diff.same.length})`} desc="Size and line-height are identical — only the token name moves (the Display ladder renumbers, and 20px joins the Display family).">
        <TokenTable
          head={["Current token", "", "Proposed token", "Figma level", "Family"]}
          rows={diff.same.map((s) => {
            const lvl = scale2026.find((l) => l.name === s.level)!;
            return [
              <Code>${s.maps}</Code>,
              <span style={{ color: ink.quaternary }}>→</span>,
              <span style={{ fontWeight: 700, fontSize: 13 }}>{lvl.token}</span>,
              <span style={{ fontSize: 13, color: ink.tertiary }}>{s.level}</span>,
              <span style={{ fontSize: 12, color: lvl.family === "Display" ? "#5925dc" : ink.tertiary, fontWeight: 600 }}>{lvl.family}</span>,
            ];
          })}
        />
      </Section>

      <Section title={`Changed values (${diff.changed.length})`}>
        <TokenTable
          head={["Level", "Current token", "Property", "Current", "May 2026"]}
          rows={diff.changed.map((c) => [
            <span style={{ fontWeight: 700, fontSize: 13 }}>{c.level}</span>,
            <Code>${c.maps}</Code>,
            <span style={{ fontSize: 13 }}>{c.what}</span>,
            <Code>{c.from}</Code>,
            <Code>{c.to}</Code>,
          ])}
        />
      </Section>

      <Section title={`New in May 2026`} desc="Concepts with no current equivalent.">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.secondary, margin: 0, paddingLeft: 18, maxWidth: 720 }}>
          <li><strong>{diff.newStyles} composed weight styles</strong> — Regular / Medium / Semibold / Bold for every level Title → Caption (the current system defines sizes and weights separately, never composed styles).</li>
          <li><strong>Family roles</strong> — <Code>Display</Code> vs <Code>Body</Code> (both Satoshi), replacing the flat <Code>$font-family-primary / -regular / -base</Code> aliases.</li>
        </ul>
      </Section>

      <Section title={`Current sizes with no May-2026 counterpart (${diff.removed.length})`} desc="These exist in design-tokens.scss today but the new file defines no equivalent level. Confirm with design before deleting.">
        <TokenTable
          head={["Current token", "Size / Line", "Letter-spacing"]}
          rows={diff.removed.map((r) => [
            <Code>${r.name}</Code>,
            <Code>{r.size} / {r.line}</Code>,
            <Code>{r.spacing}</Code>,
          ])}
        />
      </Section>
    </Page>
  ),
};
