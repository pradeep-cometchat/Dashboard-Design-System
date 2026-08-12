import type { CSSProperties, ReactNode } from "react";

/** Shared presentational helpers for the Foundations docs. */

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const sans =
  "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Doc palette (mirrors foundation tokens; these pages document the values themselves).
const ink = {
  primary: "#181d27",
  secondary: "#414651",
  tertiary: "#535862",
  quaternary: "#717680",
  border: "#e9eaeb",
  borderLight: "#f0f0f1",
  bgSubtle: "#fafafa",
  brand: "#6852d6",
};

export function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: ink.bgSubtle, border: `1px solid ${ink.border}`, fontSize: 12, fontWeight: 500, color: ink.tertiary, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function Page({ title, eyebrow, intro, meta, children }: { title: string; eyebrow?: string; intro?: ReactNode; meta?: ReactNode[]; children: ReactNode }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ fontFamily: sans, color: ink.primary, maxWidth: 980, margin: "0 auto", padding: "56px 40px 96px" }}>
        <header style={{ marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${ink.border}` }}>
          {eyebrow && (
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: ink.brand, marginBottom: 10 }}>{eyebrow}</div>
          )}
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</h1>
          {intro && <p style={{ fontSize: 15, lineHeight: 1.7, color: ink.tertiary, margin: "14px 0 0", maxWidth: 680 }}>{intro}</p>}
          {meta && meta.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
              {meta.map((m, i) => <MetaChip key={i}>{m}</MetaChip>)}
            </div>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}

export function Section({ title, desc, children }: { title: string; desc?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: ink.quaternary, margin: "0 0 6px" }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: 14, lineHeight: 1.6, color: ink.tertiary, margin: "0 0 16px", maxWidth: 680 }}>{desc}</p>}
      {!desc && <div style={{ height: 10 }} />}
      {children}
    </section>
  );
}

export function Grid({ children, min = 150 }: { children: ReactNode; min?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 12 }}>
      {children}
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code style={{ fontFamily: mono, fontSize: 12.5, background: ink.bgSubtle, border: `1px solid ${ink.borderLight}`, padding: "2px 6px", borderRadius: 5, color: ink.secondary, whiteSpace: "nowrap" }}>{children}</code>
  );
}

/** Multi-line code block with an optional filename/label bar. */
export function CodeBlock({ label, lines }: { label?: string; lines: string[] }) {
  return (
    <div style={{ border: `1px solid ${ink.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      {label && (
        <div style={{ padding: "8px 14px", background: ink.bgSubtle, borderBottom: `1px solid ${ink.border}`, fontFamily: mono, fontSize: 11.5, color: ink.quaternary }}>{label}</div>
      )}
      <pre style={{ margin: 0, padding: "14px 16px", fontFamily: mono, fontSize: 12.5, lineHeight: 1.7, color: ink.secondary, overflowX: "auto" }}>
        {lines.join("\n")}
      </pre>
    </div>
  );
}

/** A single color swatch card with name + value. */
export function Swatch({ color, name, sub, ring }: { color: string; name: string; sub?: string; ring?: boolean }) {
  return (
    <div style={{ border: `1px solid ${ink.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <div style={{ height: 68, background: color, boxShadow: ring ? "inset 0 0 0 1px rgba(10,13,18,0.08)" : undefined }} />
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
        {sub && <div style={{ fontFamily: mono, fontSize: 11, color: ink.quaternary, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/** A horizontal 25→950 color ramp. */
export function Ramp({ label, steps }: { label: string; steps: { step: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "capitalize" }}>{label}</div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${ink.border}` }}>
        {steps.map((s) => {
          const dark = parseInt(s.step, 10) >= 500 || s.step === "black";
          return (
            <div key={s.step} title={s.value} style={{ flex: 1, background: s.value, padding: "10px 4px 8px", minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: dark ? "#fff" : ink.primary }}>{s.step}</div>
              <div style={{ fontFamily: mono, fontSize: 8.5, color: dark ? "rgba(255,255,255,0.75)" : ink.quaternary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Reusable table for semantic/token rows. */
export function TokenTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const cell: CSSProperties = { padding: "10px 14px", borderBottom: `1px solid ${ink.borderLight}`, fontSize: 13, textAlign: "left", verticalAlign: "middle" };
  return (
    <div style={{ border: `1px solid ${ink.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: sans }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={{ ...cell, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: ink.quaternary, background: ink.bgSubtle }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} style={cell}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const styles = { mono, sans, ink };
