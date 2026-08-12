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

/* ---------- palette audit (computed) ---------- */

/** Value → ramp step. Ramps are declared light-family first, so a value that appears in
 *  both the light and dark neutral ramps resolves to the light one. */
const RAMP_INDEX = new Map<string, { family: string; step: string; i: number }>();
ramps2026.forEach((r) =>
  r.steps.forEach((s, i) => {
    const k = s.value.toLowerCase();
    if (!RAMP_INDEX.has(k)) RAMP_INDEX.set(k, { family: r.family, step: s.step, i });
  })
);
base2026.forEach((b) => {
  const k = b.value.toLowerCase();
  if (!RAMP_INDEX.has(k)) RAMP_INDEX.set(k, { family: "Base", step: b.name.split("/").pop() ?? b.name, i: -1 });
});
const stepOf = (v: string) => RAMP_INDEX.get(v.toLowerCase());
const stepLabel = (v: string) => {
  const s = stepOf(v);
  return s ? `${s.family}/${s.step}` : "—";
};

const relLum = (hex: string) => {
  const h = hex.replace("#", "");
  const c = [0, 2, 4]
    .map((i) => parseInt(h.substr(i, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const SEM_GROUPS = ["text", "border", "foreground", "background"] as const;
const allSemantic = SEM_GROUPS.flatMap((g) => semantic2026[g].map((t) => ({ group: g as string, ...t })));
const currentValueOf = (name?: string | null) => {
  if (!name) return undefined;
  for (const list of Object.values(tokens.semantic)) {
    const hit = (list as readonly { name: string; value: string }[]).find((t) => t.name === name);
    if (hit) return hit.value;
  }
  return undefined;
};

/** Hovers that intentionally break the +1-step rule, with the reason shown on the page. */
const HOVER_EXCEPTIONS: Record<string, string> = {
  "BG Black Solid Hover": "Base sits at the darkest neutral step, so hover can only lighten.",
};

function computeAudit() {
  // Light-theme tokens whose value comes from the dark-mode ramp.
  const darkModeLeaks = allSemantic.filter((t) => /dark mode/i.test(stepOf(t.value)?.family ?? ""));

  // The file's hover convention: hover = base + exactly one step of the same ramp.
  const hoverPairs = allSemantic
    .filter((t) => /\bhover\b/i.test(t.name))
    .map((hover) => {
      const baseName = hover.name.replace(/\s*hover\s*/i, " ").trim().toLowerCase();
      const base = allSemantic.find((t) => t.group === hover.group && t.name.toLowerCase() === baseName);
      const a = base && stepOf(base.value);
      const b = stepOf(hover.value);
      const comparable = !!a && !!b && a.family === b.family && a.i >= 0 && b.i >= 0;
      return { hover, base, delta: comparable ? b!.i - a!.i : null };
    })
    .filter((p) => !!p.base);
  const hoverOk = hoverPairs.filter((p) => p.delta === 1);
  const hoverCrossFamily = hoverPairs.filter((p) => p.delta === null);
  const hoverOff = hoverPairs.filter((p) => p.delta !== null && p.delta !== 1);

  // "Alt" tokens that now equal their base but hold distinct values today.
  const altCollapsed = allSemantic
    .filter((t) => /\balt$/i.test(t.name))
    .map((alt) => {
      const baseName = alt.name.replace(/\s*alt$/i, "").trim().toLowerCase();
      const base = allSemantic.find((t) => t.group === alt.group && t.name.toLowerCase() === baseName);
      return { alt, base, curAlt: currentValueOf(alt.maps), curBase: currentValueOf(base?.maps) };
    })
    .filter((r) => !!r.base && eq(r.base!.value, r.alt.value) && !!r.curBase && !!r.curAlt && !eq(r.curBase, r.curAlt));

  // Text tokens that lose contrast against BG 01 and land under the 3:1 large-text floor.
  const contrastDrops = semantic2026.text
    .map((t) => ({ t, cur: currentValueOf(t.maps) }))
    .filter((r) => !!r.cur)
    .map((r) => ({ ...r, before: contrast(r.cur!, "#ffffff"), after: contrast(r.t.value, "#ffffff") }))
    .filter((r) => r.after < r.before && r.after < 3);

  // Values that trace back to no documented ramp step or base colour.
  const orphans = allSemantic.filter((t) => !stepOf(t.value));

  return { darkModeLeaks, hoverPairs, hoverOk, hoverCrossFamily, hoverOff, altCollapsed, contrastDrops, orphans };
}

const audit = computeAudit();

/** Recommended replacement values. `figma` is the value these were raised against — if the
 *  file is re-pulled and the value has moved, the row reports itself as resolved. */
const proposedFixes = [
  {
    token: "Text Brand",
    figma: "#403679",
    proposed: "#6852d6",
    why: "Brand text and brand icons match today (both #6852d6) and split here. Text Brand Hover is already Brand/700, which is base+1 for a Brand/600 base — so the hover is correct and the base is what drifted.",
  },
  {
    token: "BG Disabled Subtle",
    figma: "#13161b",
    proposed: "#fafafa",
    why: "The only value in the light palette taken from the dark-mode ramp. Swapping ramps alone does not fix it — Neutral (light)/900 is #181d27, still near-black — so both ramp and step are wrong.",
  },
  {
    token: "Text Placeholder Subtle",
    figma: "#d5d7da",
    proposed: "#a4a7ae",
    why: "Reverting stops the regression but neither value clears AA; reaching 4.5:1 needs Neutral/500, which is what Text Placeholder already is.",
  },
].map((f) => {
  const live = allSemantic.find((t) => t.name === f.token);
  return { ...f, live: live?.value, resolved: !!live && !eq(live.value, f.figma) };
});

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
          <li><strong>{diff.removed.length} current tokens have no May-2026 counterpart</strong> — see “Changes vs Current” for the exact list.</li>
        </ul>
      </Section>

      <Section title="Needs design review" desc="Values that look like authoring slips rather than deliberate changes. Full evidence and proposed replacements on the “Open Questions” page.">
        <div style={{ border: "1px solid #fedf89", background: "#fffaeb", borderRadius: 12, padding: "14px 16px", maxWidth: 720 }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "#b54708" }}>
            <strong>{proposedFixes.filter((f) => !f.resolved).length} values look wrong</strong> — {proposedFixes.filter((f) => !f.resolved).map((f) => f.token).join(", ")}.
            {audit.altCollapsed.length > 0 && <> A further <strong>{audit.altCollapsed.length} “Alt” tokens</strong> collapsed onto their base and need a keep-or-retire decision.</>}
            {" "}The brand rollout is blocked on these; spacing, radius and the Info colours are not.
          </div>
        </div>
      </Section>

      <Section title="In this folder">
        <ul style={{ fontSize: 14, lineHeight: 1.8, color: ink.tertiary, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: ink.primary }}>Primitive Ramps</strong> — the seven May-2026 ramps, flagged where they differ.</li>
          <li><strong style={{ color: ink.primary }}>Semantic Colors</strong> — all 80 semantic tokens with their current-token mapping.</li>
          <li><strong style={{ color: ink.primary }}>Changes vs Current</strong> — the full changed / added / removed breakdown.</li>
          <li><strong style={{ color: ink.primary }}>Open Questions</strong> — suspected authoring errors, proposed fixes, and what the audit cleared.</li>
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

export const OpenQuestions: Story = {
  name: "Open Questions",
  render: () => {
    const open = proposedFixes.filter((f) => !f.resolved);
    const cleared = proposedFixes.filter((f) => f.resolved);
    return (
      <Page
        eyebrow="Foundations · Proposed update"
        title="Open Questions"
        intro="Values in the May 2026 file that look like authoring slips rather than deliberate changes, with the evidence each one rests on and a proposed replacement. Everything here is computed from the pulled Figma data — the staging values themselves are left exactly as the file defines them, so the diff on the other pages stays honest."
        meta={pageMeta}
      >
        <Section title="Status" desc="Counted live from the pulled data, so these numbers follow the Figma file rather than this prose.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
            {[
              { n: open.length, label: "Values to correct", color: "#d92d20" },
              { n: audit.altCollapsed.length, label: "Awaiting a decision", color: "#dc6803" },
              { n: audit.hoverOk.length, label: "Hover pairs correct", color: "#079455" },
              { n: audit.orphans.length, label: "Untraceable values", color: "#079455" },
            ].map((s) => (
              <div key={s.label} style={{ border: `1px solid ${ink.border}`, borderRadius: 12, padding: 16, background: "#fff" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.n}</div>
                <div style={{ fontSize: 13, color: ink.tertiary, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {open.length > 0 && (
          <Section title={`Suspected errors (${open.length})`} desc="Each row is a single value change. Nothing else in the palette depends on them being wrong.">
            <TokenTable
              head={["Token", "File says", "Should be", "Why"]}
              rows={open.map((f) => [
                <span style={{ fontWeight: 600, fontSize: 13 }}>{f.token}</span>,
                <span style={{ whiteSpace: "nowrap" }}>
                  <Chip value={f.figma} /> <Code>{f.figma}</Code>
                  <div style={{ fontSize: 11, color: ink.quaternary, marginTop: 2 }}>{stepLabel(f.figma)}</div>
                </span>,
                <span style={{ whiteSpace: "nowrap" }}>
                  <Chip value={f.proposed} /> <Code>{f.proposed}</Code>
                  <div style={{ fontSize: 11, color: ink.quaternary, marginTop: 2 }}>{stepLabel(f.proposed)}</div>
                </span>,
                <span style={{ fontSize: 13, color: ink.tertiary, lineHeight: 1.6 }}>{f.why}</span>,
              ])}
            />
          </Section>
        )}

        {cleared.length > 0 && (
          <Section title={`Resolved in the latest pull (${cleared.length})`} desc="Raised against an earlier export; the file no longer carries the flagged value.">
            <TokenTable
              head={["Token", "Was", "Now"]}
              rows={cleared.map((f) => [
                <span style={{ fontWeight: 600, fontSize: 13 }}>{f.token}</span>,
                <Code>{f.figma}</Code>,
                <span style={{ whiteSpace: "nowrap" }}><Chip value={f.live!} /> <Code>{f.live}</Code></span>,
              ])}
            />
          </Section>
        )}

        {audit.altCollapsed.length > 0 && (
          <Section
            title={`“Alt” tokens — keep or retire? (${audit.altCollapsed.length})`}
            desc="Every Alt token in the palette now equals its base. The Brand ramp was re-cut and most of the old Alt values no longer exist in it, so they cannot simply be restored."
          >
            <TokenTable
              head={["Token", "Base", "Alt (May 2026)", "Alt today", "Still in the new ramp?"]}
              rows={audit.altCollapsed.map((r) => [
                <span style={{ fontWeight: 600, fontSize: 13 }}>{r.alt.name}</span>,
                <span style={{ whiteSpace: "nowrap" }}><Chip value={r.base!.value} /> <Code>{r.base!.value}</Code></span>,
                <span style={{ whiteSpace: "nowrap" }}><Chip value={r.alt.value} /> <Code>{r.alt.value}</Code></span>,
                <span style={{ whiteSpace: "nowrap" }}><Chip value={r.curAlt!} /> <Code>{r.curAlt}</Code></span>,
                stepOf(r.curAlt!)
                  ? <span style={{ fontSize: 12.5, color: "#067647" }}>yes — {stepLabel(r.curAlt!)}</span>
                  : <span style={{ fontSize: 12.5, color: "#b42318" }}>no, retired from the ramp</span>,
              ])}
            />
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: ink.tertiary, margin: "14px 0 0", maxWidth: 760 }}>
              If Alt is being retired, alias each one to its base and drop it after the migration — no new values needed. If it
              is staying, design has to supply fresh steps, since the old colours are gone from the palette.
            </p>
          </Section>
        )}

        <Section title="What the audit cleared" desc="Checks that ran across every semantic token and came back clean — useful for knowing what not to re-litigate.">
          <TokenTable
            head={["Check", "Result"]}
            rows={[
              [
                <span style={{ fontSize: 13, fontWeight: 600 }}>Values trace to a real ramp step</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>{allSemantic.length - audit.orphans.length} of {allSemantic.length} — no invented colours.</span>,
              ],
              [
                <span style={{ fontSize: 13, fontWeight: 600 }}>Dark-mode values in the light set</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>
                  {audit.darkModeLeaks.length === 0 ? "None." : `${audit.darkModeLeaks.length} — ${audit.darkModeLeaks.map((t) => t.name).join(", ")}.`}
                </span>,
              ],
              [
                <span style={{ fontSize: 13, fontWeight: 600 }}>Hover = base + one ramp step</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>
                  {audit.hoverOk.length} of {audit.hoverOk.length + audit.hoverOff.length} comparable pairs follow it
                  {audit.hoverCrossFamily.length > 0 && `; ${audit.hoverCrossFamily.length} cross-family pair not comparable`}.
                </span>,
              ],
              [
                <span style={{ fontSize: 13, fontWeight: 600 }}>Text contrast on BG 01</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>
                  {audit.contrastDrops.length === 0
                    ? "No text token drops below the 3:1 large-text floor."
                    : audit.contrastDrops.map((r) => `${r.t.name} falls ${r.before.toFixed(2)}:1 → ${r.after.toFixed(2)}:1`).join("; ") + "."}
                </span>,
              ],
            ]}
          />
        </Section>

        <Section title="Trips a rule, but intentional" desc="Flagged by the automated checks and deliberately not raised with design.">
          <TokenTable
            head={["Token", "Observation", "Why it is fine"]}
            rows={[
              ...audit.hoverOff
                .filter((p) => HOVER_EXCEPTIONS[p.hover.name])
                .map((p) => [
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.hover.name}</span>,
                  <span style={{ fontSize: 13, color: ink.tertiary }}>
                    {stepLabel(p.base!.value)} → {stepLabel(p.hover.value)} lightens instead of darkening.
                  </span>,
                  <span style={{ fontSize: 13, color: ink.tertiary }}>{HOVER_EXCEPTIONS[p.hover.name]}</span>,
                ]),
              [
                <span style={{ fontWeight: 600, fontSize: 13 }}>Text vs FG Quaternary / Disabled</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>Text is <Code>#717680</Code> where the foreground role is <Code>#a4a7ae</Code>.</span>,
                <span style={{ fontSize: 13, color: ink.tertiary }}>They differ in the current tokens too — preserved intent, not a new split.</span>,
              ],
            ]}
          />
        </Section>

        <Section title="Out of scope for this palette">
          <div style={{ border: `1px solid ${ink.border}`, borderRadius: 12, padding: "14px 16px", maxWidth: 760, background: "#fff" }}>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, color: ink.tertiary }}>
              The <strong style={{ color: ink.primary }}>moderation</strong> tokens are not part of this comparison. They are built on a
              dedicated amber ramp that the May 2026 file does not define, and the new Warning ramp is a different orange
              (<Code>#f79009</Code> against amber’s <Code>#fe9a00</Code>), so it is not a drop-in substitute. That is a gap in the new
              palette rather than an error in it — keeping the current amber is the only non-breaking option until design adds a ramp.
            </div>
          </div>
        </Section>
      </Page>
    );
  },
};
