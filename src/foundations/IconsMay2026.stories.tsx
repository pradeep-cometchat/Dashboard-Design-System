import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Page, Section, TokenTable, styles } from "./Foundations";
import { SOURCE, icons, namingInconsistencies } from "./icons-2026";

const meta: Meta = {
  title: "Foundations/Icons (May 2026)",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;
const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: ink.tertiary }}>{children}</code>
);

/** All exported SVGs, inlined as raw strings by Vite — outlined (Fill=No) and filled (Fill=Yes). */
const outlinedModules = import.meta.glob("./icons-2026/svg/*.svg", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;
const filledModules = import.meta.glob("./icons-2026/svg-filled/*.svg", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const nameOf = (path: string) => path.split("/").pop()!.replace(/\.svg$/, "");
const filledByName = new Map(Object.entries(filledModules).map(([p, svg]) => [nameOf(p), svg]));

const svgIcons = Object.entries(outlinedModules)
  .map(([path, svg]) => ({ name: nameOf(path), svg, filled: filledByName.get(nameOf(path)) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const filledCount = svgIcons.filter((i) => i.filled).length;

/** Inline SVG glyph — recolorable because exported fills/strokes use currentColor. */
function Glyph({ svg, size = 24, color = ink.secondary }: { svg: string; size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, display: "inline-flex", color, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: svg.replace("<svg ", `<svg style="width:100%;height:100%" `) }}
    />
  );
}

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Icons (May 2026)"
      intro="The Dashboard icon library from the May 2026 Figma file — Material Symbols plus custom CometChat glyphs (AI, chat-bot, collaboration). Every icon is a component set with outlined (Fill=No, default) and filled (Fill=Yes) variants on a 24×24 grid, exported here as recolorable SVGs."
      meta={[
        <>Source: Figma “{SOURCE.file}”</>,
        <>Frame: Material Symbols · node {SOURCE.nodes[0].id}</>,
        <>{svgIcons.length} SVGs · currentColor</>,
      ]}
    >
      <Section title="At a glance">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {[
            { n: svgIcons.length, label: "Unique icons (SVG)", color: "#079455" },
            { n: filledCount, label: "With filled variant", color: "#6852d6" },
            { n: icons.dupes.length, label: "Duplicated frames", color: "#dc6803" },
            { n: namingInconsistencies.length, label: "Naming inconsistencies", color: "#d92d20" },
          ].map((s) => (
            <div key={s.label} style={{ border: `1px solid ${ink.border}`, borderRadius: 12, padding: 16, background: "#fff" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: ink.tertiary, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Recolorable by design" desc="Exports use currentColor, so an icon inherits whatever text color its context sets — one asset, every state.">
        <div style={{ display: "flex", gap: 18, alignItems: "center", border: `1px solid ${ink.border}`, borderRadius: 12, background: "#fff", padding: 16, flexWrap: "wrap" }}>
          {[
            { c: "#414651", label: "fg-secondary" },
            { c: "#6852d6", label: "brand" },
            { c: "#d92d20", label: "error" },
            { c: "#079455", label: "success" },
            { c: "#a4a7ae", label: "disabled" },
          ].map(({ c, label }) => {
            const chat = svgIcons.find((i) => i.name === "chat");
            return chat ? (
              <span key={label} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Glyph svg={chat.svg} size={28} color={c} />
                <span style={{ fontFamily: styles.mono, fontSize: 10.5, color: ink.quaternary }}>{label}</span>
              </span>
            ) : null;
          })}
        </div>
      </Section>

      <Section title="Notes">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.secondary, margin: 0, paddingLeft: 18, maxWidth: 720 }}>
          <li><strong>Grid & style</strong> — 24×24, drawn for <Code>FG Secondary</Code>; based on Google's Material Symbols with CometChat additions (<Code>ai-*</Code>, <Code>chat-bot</Code>, <Code>collaborative-*</Code>, <Code>video-incoming/outgoing</Code>…).</li>
          <li><strong>Fill variants</strong> — every set ships <Code>Fill=No</Code> (outlined, default) and <Code>Fill=Yes</Code>; this library shows outlined.</li>
          <li><strong>No icon foundation exists today</strong> — screens currently mix Ant Design icons with hand-inlined Figma SVGs. This library would replace both as the single icon source.</li>
        </ul>
      </Section>

      <Section title="Needs design cleanup" desc="Flag these in the Figma file before adopting the library.">
        <TokenTable
          head={["Issue", "Items"]}
          rows={[
            [
              <span style={{ fontSize: 13, fontWeight: 600 }}>Duplicated frames</span>,
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{icons.dupes.map((d, i) => <Code key={i}>{d}</Code>)}</span>,
            ],
            [
              <span style={{ fontSize: 13, fontWeight: 600 }}>Non-kebab-case names</span>,
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{namingInconsistencies.map((d) => <Code key={d}>{d}</Code>)}</span>,
            ],
            [
              <span style={{ fontSize: 13, fontWeight: 600 }}>Missing Fill=Yes variant</span>,
              <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{svgIcons.filter((i) => !i.filled).map((d) => <Code key={d.name}>{d.name}</Code>)}</span>,
            ],
            [
              <span style={{ fontSize: 13, fontWeight: 600 }}>Off-palette color</span>,
              <span style={{ fontSize: 13, color: ink.tertiary }}><Code>campaigns</Code> is drawn in <Code>#181d27</Code> instead of <Code>#414651</Code> (not recolorable until fixed).</span>,
            ],
            [
              <span style={{ fontSize: 13, fontWeight: 600 }}>Extra variant</span>,
              <span style={{ fontSize: 13, color: ink.tertiary }}><Code>calendar-add-on</Code> has 3 variants where every other set has 2.</span>,
            ],
          ]}
        />
      </Section>

      <Section title="In this folder">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.tertiary, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: ink.primary }}>Icon Library</strong> — all {svgIcons.length} glyphs as inline SVG, searchable.</li>
        </ul>
      </Section>
    </Page>
  ),
};

function Gallery() {
  const [q, setQ] = React.useState("");
  const filtered = svgIcons.filter((i) => i.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${svgIcons.length} icons…`}
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 14px", fontSize: 14, fontFamily: styles.sans, color: ink.primary, border: `1px solid ${ink.border}`, borderRadius: 8, outline: "none", background: "#fff" }}
        />
      </div>
      {filtered.length === 0 ? (
        <div style={{ fontSize: 14, color: ink.tertiary, padding: "24px 0" }}>No icons match “{q}”.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(126px, 1fr))", gap: 10 }}>
          {filtered.map((i) => (
            <div key={i.name} title={i.name} style={{ border: `1px solid ${ink.border}`, borderRadius: 10, background: "#fff", padding: "14px 8px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 20 /* spacing-2xl */, alignItems: "center" }}>
                <Glyph svg={i.svg} size={24} />
                {i.filled
                  ? <Glyph svg={i.filled} size={24} />
                  : <span style={{ width: 24, height: 24, borderRadius: 6, border: `1px dashed ${ink.border}` }} title="No Fill=Yes variant" />}
              </div>
              <div style={{ fontFamily: styles.mono, fontSize: 10, color: ink.tertiary, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export const Library: Story = {
  name: "Icon Library",
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Icon Library (May 2026)"
      intro="Every unique icon in the library as inline SVG (24×24, currentColor) — outlined (Fill=No) on the left, filled (Fill=Yes) on the right, as in the Figma file. Search by name."
      meta={[<>Source: Figma “{SOURCE.file}”</>, <>{svgIcons.length} unique icons · outlined + filled · SVG</>]}
    >
      <Section title="All icons">
        <Gallery />
      </Section>
    </Page>
  ),
};
