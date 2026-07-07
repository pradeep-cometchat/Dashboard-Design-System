import type { CSSProperties, ReactNode } from "react";

/** Shared presentational helpers for the Foundations docs. */

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const sans =
  "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export function Page({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ fontFamily: sans, color: "#181d27", maxWidth: 1100, padding: "8px 4px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{title}</h1>
      {intro && <p style={{ fontSize: 15, lineHeight: 1.6, color: "#535862", margin: "0 0 28px", maxWidth: 720 }}>{intro}</p>}
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#717680", margin: "0 0 16px", paddingBottom: 8, borderBottom: "1px solid #e9eaeb" }}>
        {title}
      </h2>
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

/** A single color swatch card with name + value. */
export function Swatch({ color, name, sub, ring }: { color: string; name: string; sub?: string; ring?: boolean }) {
  return (
    <div style={{ border: "1px solid #e9eaeb", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <div style={{ height: 68, background: color, boxShadow: ring ? "inset 0 0 0 1px rgba(10,13,18,0.08)" : undefined }} />
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
        {sub && <div style={{ fontFamily: mono, fontSize: 11, color: "#717680", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/** A horizontal 25→950 color ramp. */
export function Ramp({ label, steps }: { label: string; steps: { step: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "capitalize" }}>{label}</div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid #e9eaeb" }}>
        {steps.map((s) => {
          const dark = parseInt(s.step, 10) >= 500 || s.step === "black";
          return (
            <div key={s.step} title={s.value} style={{ flex: 1, background: s.value, padding: "10px 4px 8px", minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: dark ? "#fff" : "#181d27" }}>{s.step}</div>
              <div style={{ fontFamily: mono, fontSize: 8.5, color: dark ? "rgba(255,255,255,0.75)" : "#717680", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Reusable table for semantic/token rows. */
export function TokenTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const cell: CSSProperties = { padding: "10px 14px", borderBottom: "1px solid #f0f0f1", fontSize: 13, textAlign: "left", verticalAlign: "middle" };
  return (
    <div style={{ border: "1px solid #e9eaeb", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: sans }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={{ ...cell, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#717680", background: "#fafafa" }}>{h}</th>
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

export const styles = { mono, sans };
