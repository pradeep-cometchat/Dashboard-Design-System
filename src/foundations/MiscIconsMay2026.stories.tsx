import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Page, Section, TokenTable, styles } from "./Foundations";
import { SOURCE, families, notVendored, type FamilyKey } from "./misc-icons-2026";
import manifest from "./icons-2026/misc/manifest.json";

const meta: Meta = {
  title: "Foundations/Misc Icons (May 2026)",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const { ink } = styles;
const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: ink.tertiary }}>{children}</code>
);

/** Full-colour marks — imported as URLs so 2.2 MB of assets stay out of the JS bundle. */
const urls = import.meta.glob("./icons-2026/misc/*/*.svg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

type Icon = { family: FamilyKey; label: string; file: string; url: string };

const icons: Icon[] = families.flatMap((f) =>
  ((manifest as Record<string, { label: string; file: string }[]>)[f.key] ?? [])
    .map((e) => ({ family: f.key, label: e.label, file: e.file, url: urls[`./icons-2026/misc/${f.key}/${e.file}.svg`] }))
    .filter((i) => !!i.url)
);

const countOf = (k: FamilyKey) => icons.filter((i) => i.family === k).length;

/** Preview box — fixed height, aspect ratio preserved (families differ: 16² → 48²). */
function Preview({ icon, box = 44 }: { icon: Icon; box?: number }) {
  return (
    <span style={{ height: box, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={icon.url} alt={icon.label} loading="lazy" style={{ maxWidth: box, maxHeight: box, display: "block" }} />
    </span>
  );
}

/* ---------------- Overview ---------------- */

export const Overview: Story = {
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Misc Icons (May 2026)"
      intro="The non-Material icon families from the May 2026 Figma file — social platforms, payment methods, file types, tech logos, emoji and folders. These are full-colour brand marks, so unlike the Material Symbols set they are never recoloured and ship as static assets."
      meta={[
        <>Source: Figma “{SOURCE.file}”</>,
        <>Page: {SOURCE.page.label} · {SOURCE.page.id}</>,
        <>{icons.length} icons vendored</>,
      ]}
    >
      <Section title="Families" desc="Each family exports one representative variant from a much larger Figma component set.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {families.map((f) => {
            const sample = icons.filter((i) => i.family === f.key).slice(0, 5);
            return (
              <div key={f.key} style={{ border: `1px solid ${ink.border}`, borderRadius: 14, background: "#fff", overflow: "hidden" }}>
                <div style={{ height: 84, background: ink.bgSubtle, borderBottom: `1px solid ${ink.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 14px" }}>
                  {sample.map((s) => <img key={s.file} src={s.url} alt="" style={{ maxWidth: 30, maxHeight: 30 }} />)}
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{f.label}</span>
                    <span style={{ fontSize: 12, color: ink.quaternary }}>{f.size}{f.raster ? " · raster" : ""}</span>
                  </div>
                  <div style={{ fontSize: 13, color: ink.tertiary, marginTop: 4, lineHeight: 1.55 }}>{f.desc}</div>
                  <div style={{ fontSize: 12, color: ink.quaternary, marginTop: 8 }}>
                    <strong style={{ color: ink.secondary }}>{countOf(f.key)}</strong> of {f.totalVariants} variants · <Code>{f.variant}</Code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="How these differ from Material Symbols">
        <div style={{ border: "1px solid #d9d6fe", background: "#f4f3ff", borderRadius: 12, padding: "14px 16px", maxWidth: 720 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "#5925dc" }}>
            The <strong>Icons (May 2026)</strong> set is monochrome and ships as inline SVG using <Code>currentColor</Code>, so it
            inherits text colour. <strong>Misc icons carry their own brand colours</strong> — they are referenced as static
            assets (<Code>&lt;img src&gt;</Code>) and must never be recoloured.
          </div>
        </div>
      </Section>

      <Section title="Notes">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.secondary, margin: 0, paddingLeft: 18, maxWidth: 720 }}>
          <li><strong>Sizes vary by family</strong> — 16² (emoji) through 48² (folder); payment marks are 46×32 cards. Preserve each family's aspect ratio rather than forcing a single box.</li>
          <li><strong>Two families are raster-backed</strong> — <Code>tech</Code> and <Code>emoji</Code> are exported by Figma as SVGs wrapping a base64 PNG, so they don't scale crisply beyond their natural size. That's how they exist in the source file.</li>
          <li><strong>Static assets, not bundled strings</strong> — imported as URLs and lazy-loaded, keeping ~2.2 MB out of the JS bundle.</li>
        </ul>
      </Section>

      <Section title="Documented but not vendored" desc="Present in the Figma page; excluded to keep this library focused. Available on request.">
        <TokenTable
          head={["Set", "Size", "Why"]}
          rows={notVendored.map((n) => [
            <span style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</span>,
            <span style={{ fontSize: 13, color: ink.tertiary, whiteSpace: "nowrap" }}>{n.count}</span>,
            <span style={{ fontSize: 13, color: ink.tertiary }}>{n.note}</span>,
          ])}
        />
      </Section>
    </Page>
  ),
};

/* ---------------- Library ---------------- */

function Gallery() {
  const [q, setQ] = React.useState("");
  const [fam, setFam] = React.useState<FamilyKey | "all">("all");
  const query = q.trim().toLowerCase();
  const shown = icons.filter((i) => (fam === "all" || i.family === fam) && (!query || i.label.toLowerCase().includes(query) || i.file.includes(query)));
  const groups = families.filter((f) => fam === "all" || f.key === fam).map((f) => ({ f, items: shown.filter((i) => i.family === f.key) })).filter((g) => g.items.length > 0);

  const Tab = ({ id, label, n }: { id: FamilyKey | "all"; label: string; n: number }) => {
    const on = fam === id;
    return (
      <button onClick={() => setFam(id)} style={{ all: "unset", cursor: "pointer", padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", color: on ? "#fff" : ink.secondary, background: on ? "#6852d6" : "#fff", border: `1px solid ${on ? "#6852d6" : ink.border}` }}>
        {label} <span style={{ opacity: 0.65, fontWeight: 500 }}>{n}</span>
      </button>
    );
  };

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <Tab id="all" label="All" n={icons.length} />
        {families.map((f) => <Tab key={f.key} id={f.key} label={f.label} n={countOf(f.key)} />)}
      </div>
      <div style={{ marginBottom: 24, maxWidth: 360 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${icons.length} icons…`}
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 14px", fontSize: 14, fontFamily: styles.sans, color: ink.primary, border: `1px solid ${ink.border}`, borderRadius: 8, outline: "none", background: "#fff" }}
        />
      </div>

      {groups.length === 0 ? (
        <div style={{ fontSize: 14, color: ink.tertiary, padding: "24px 0" }}>No icons match “{q}”.</div>
      ) : (
        groups.map(({ f, items }) => (
          <div key={f.key} style={{ marginBottom: 34 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{f.label}</span>
              <span style={{ fontSize: 12, color: ink.quaternary }}>{items.length} · {f.size}{f.raster ? " · raster" : ""}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(124px, 1fr))", gap: 10 }}>
              {items.map((i) => (
                <div key={`${i.family}/${i.file}`} title={i.label} style={{ border: `1px solid ${ink.border}`, borderRadius: 10, background: "#fff", padding: "12px 8px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Preview icon={i} />
                  <div style={{ fontFamily: styles.mono, fontSize: 10, color: ink.tertiary, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.file}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}

export const Library: Story = {
  name: "Icon Library",
  render: () => (
    <Page
      eyebrow="Foundations · Proposed update"
      title="Misc Icon Library (May 2026)"
      intro="Every vendored misc icon, grouped by family and shown at its natural aspect ratio. Filter by family or search by name."
      meta={[<>Source: Figma “{SOURCE.file}”</>, <>{icons.length} icons · full colour</>]}
    >
      <Section title="All icons">
        <Gallery />
      </Section>
    </Page>
  ),
};
