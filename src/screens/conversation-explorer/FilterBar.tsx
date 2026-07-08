import React from "react";
import CometChatPopover from "components/base/Popover/CometChatPopover";
import { c, s, r, font } from "./theme";
import { CheckIcon, PlusCircle, XClose, SearchLg } from "./icons";

/** Filter-chip toolbar (Figma "Voice & Video Logs" filter pattern), adapted for the conversation list. */

type Opt = { value: string; label: string; count: number };
type Dim = { key: string; name: string; options: Opt[] };

const DIMENSIONS: Dim[] = [
  { key: "type", name: "Type", options: [
    { value: "text", label: "Text", count: 128 },
    { value: "media", label: "Media", count: 42 },
    { value: "custom", label: "Custom", count: 7 },
  ] },
  { key: "status", name: "Moderation", options: [
    { value: "approved", label: "Approved", count: 160 },
    { value: "flagged", label: "Flagged", count: 12 },
    { value: "blocked", label: "Blocked", count: 5 },
  ] },
  { key: "tags", name: "Tags", options: [
    { value: "support", label: "Support", count: 34 },
    { value: "priority", label: "Priority", count: 18 },
    { value: "engineering", label: "Engineering", count: 9 },
  ] },
];

function CheckBox({ on }: { on: boolean }) {
  return (
    <span style={{ width: 20, height: 20, boxSizing: "border-box", flexShrink: 0, borderRadius: r.sm, display: "inline-flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${on ? c.brand : c.borderDark}`, background: on ? c.brand : "transparent", color: c.white }}>
      {on && <CheckIcon size={12} />}
    </span>
  );
}

/** The dropdown popup — search box, checkbox list with counts, and a Clear Filters footer. */
function FilterDropdown({ options, selected, onToggle, onClear }: { options: Opt[]; selected: string[]; onToggle: (v: string) => void; onClear: () => void }) {
  const [q, setQ] = React.useState("");
  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ width: 220, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.md, padding: `${s.md} ${s.lg}`, borderBottom: `1px solid ${c.borderDefault}` }}>
        <SearchLg size={20} style={{ color: c.textQuaternary, flexShrink: 0 }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" style={{ border: "none", outline: "none", flex: 1, minWidth: 0, ...font.body, color: c.textPrimary, background: "transparent" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: s.xs, maxHeight: 360, overflowY: "auto" }}>
        {filtered.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button key={o.value} onClick={() => onToggle(o.value)} style={{ all: "unset", cursor: "pointer", boxSizing: "border-box", width: "100%", display: "flex", alignItems: "center", gap: s.lg, padding: `${s.lg} ${s.md}`, borderRadius: r.sm }}>
              <CheckBox on={on} />
              <span style={{ flex: 1, ...font.body, color: c.textPrimary }}>{o.label}</span>
              <span style={{ ...font.body, color: c.textQuaternary }}>{o.count}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onClear} style={{ all: "unset", cursor: "pointer", boxSizing: "border-box", width: "100%", textAlign: "center", padding: `${s.md} ${s.lg}`, borderTop: `1px solid ${c.borderDefault}`, ...font.bodyMd, color: c.textTertiary }}>Clear Filters</button>
    </div>
  );
}

function FilterChip({ dim, selected, onToggle, onClear, defaultOpen }: { dim: Dim; selected: string[]; onToggle: (v: string) => void; onClear: () => void; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const chosen = dim.options.filter((o) => selected.includes(o.value));
  return (
    <CometChatPopover open={open} onOpenChange={setOpen} trigger="click" placement="bottomLeft" arrow={false} overlayClassName="cc-popover-flush"
      content={<FilterDropdown options={dim.options} selected={selected} onToggle={onToggle} onClear={onClear} />}>
      <button style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", height: 32, boxSizing: "border-box", borderRadius: r.md, border: `1px dashed ${c.borderDark}`, background: chosen.length ? c.bgSecondary : c.bgPrimary, overflow: "hidden" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, padding: chosen.length ? `0 ${s.xs} 0 ${s.md}` : `0 ${s.md}`, color: "var(--text-secondary-hover)" }}>
          <PlusCircle size={16} />
          <span style={{ ...font.bodyMd }}>{dim.name}</span>
        </span>
        {chosen.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, height: "100%", padding: `0 ${s.md}`, borderLeft: `1px dashed ${c.borderDark}` }}>
            {chosen.slice(0, 2).map((o) => (
              <span key={o.value} style={{ display: "inline-flex", alignItems: "center", padding: `2px ${s.sm}`, borderRadius: r.sm, background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, ...font.caption, color: c.textSecondary }}>{o.label}</span>
            ))}
            {chosen.length > 2 && <span style={{ ...font.caption, color: c.textSecondary }}>+{chosen.length - 2}</span>}
          </span>
        )}
      </button>
    </CometChatPopover>
  );
}

export function FilterBar({ initialOpenKey }: { initialOpenKey?: string }) {
  const [state, setState] = React.useState<Record<string, string[]>>({ type: ["text"], status: [], tags: [] });
  const toggle = (key: string, v: string) => setState((st) => ({ ...st, [key]: st[key].includes(v) ? st[key].filter((x) => x !== v) : [...st[key], v] }));
  const clear = (key: string) => setState((st) => ({ ...st, [key]: [] }));
  const reset = () => setState({ type: [], status: [], tags: [] });
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: s.md, padding: `0 ${s.xl} ${s.lg}` }}>
      {DIMENSIONS.map((dim) => (
        <FilterChip key={dim.key} dim={dim} selected={state[dim.key]} onToggle={(v) => toggle(dim.key, v)} onClear={() => clear(dim.key)} defaultOpen={dim.key === initialOpenKey} />
      ))}
      <button onClick={reset} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: s.xs, height: 32, padding: `0 ${s.md}`, color: c.textTertiary }}>
        <XClose size={16} />
        <span style={{ ...font.bodyMd }}>Reset</span>
      </button>
    </div>
  );
}
