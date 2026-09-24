// Audit Logs filters — Feature Narrative "Filter and Export buttons":
// the Filter button toggles a row of chips under the header; each chip opens a
// dropdown with a search bar, checkbox / radio options and Clear / Apply — the
// dashboard's filter pattern (see Conversation Explorer's FilterBar). Filters:
// Time range (24h / 7d / 30d / 90d), Custom dates, Section, Action type
// (dependent on Section — changing Section resets Action), Actor, Source.
import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import CometChatPopover from "components/base/Popover/CometChatPopover";
import CometChatCheckbox from "components/base/Checkbox/CometChatCheckbox";
import CometChatRadio from "components/base/Radio/CometChatRadio";
import CometChatDatePicker from "components/base/DatePicker/CometChatDatePicker";
import CometChatButton from "components/base/Button/CometChatButton";
import { c, s, r, font } from "../theme";
import { Icon, dim } from "../pin/ui";
import { SearchLg } from "../conversation-explorer/icons";
import { CATALOG, TEAM, lookupAction, type AuditEntry, type Source } from "./data";

/* ---------------- model ---------------- */

export type DatePreset = "24h" | "7d" | "30d" | "90d" | "custom";

export interface DateFilter {
  preset: DatePreset;
  /** Custom range bounds, ISO strings (inclusive days). */
  from?: string;
  to?: string;
}

export interface Filters {
  date: DateFilter | null;
  actors: string[]; // userId
  sections: string[]; // section id
  actions: string[]; // action id
  sources: Source[];
}

export const EMPTY_FILTERS: Filters = { date: null, actors: [], sections: [], actions: [], sources: [] };

export const activeFilterCount = (f: Filters) =>
  [f.date !== null, f.actors.length > 0, f.sections.length > 0, f.actions.length > 0, f.sources.length > 0].filter(Boolean).length;

type TimePreset = Exclude<DatePreset, "custom">;

const PRESET_MS: Record<TimePreset, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
};

export const PRESET_LABEL: Record<TimePreset, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};
const TIME_PRESETS = Object.keys(PRESET_LABEL) as TimePreset[];

export const SOURCE_LABEL: Record<Source, string> = { dashboard: "Dashboard", api: "API" };

export function applyFilters(entries: AuditEntry[], f: Filters, now = Date.now()): AuditEntry[] {
  return entries.filter((e) => {
    const t = Date.parse(e.timestamp);
    if (f.date) {
      if (f.date.preset === "custom") {
        if (f.date.from && t < dayjs(f.date.from).startOf("day").valueOf()) return false;
        if (f.date.to && t > dayjs(f.date.to).endOf("day").valueOf()) return false;
      } else if (t < now - PRESET_MS[f.date.preset]) return false;
    }
    if (f.actors.length && !f.actors.includes(e.actor.userId)) return false;
    if (f.sections.length && !f.sections.includes(lookupAction(e.actionId).section.id)) return false;
    if (f.actions.length && !f.actions.includes(e.actionId)) return false;
    if (f.sources.length && !f.sources.includes(e.source)) return false;
    return true;
  });
}

/* ---------------- chip ---------------- */

/** Dropdown width (same as Conversation Explorer's FilterBar) and list cap — no size-token family for overlays (flagged to design). */
const PANEL_W = 220;
const LIST_MAX_H = 264;

/** How many value pills a chip shows before collapsing to "+n". */
const MAX_PILLS = 2;

/**
 * Filter chip — the dashboard's filter pattern (see Conversation Explorer's
 * FilterBar / Figma "Voice & Video Logs" filters): a dashed chip with a ⊕ label;
 * once values are applied a dashed-divided segment lists them as small pills.
 * Chip height = bodyMd line-height + 2 × $spacing-sm (32), derived from tokens.
 */
const CHIP_H = "calc(var(--line-height-text-sm) + 2 * var(--spacing-sm))";
function FilterChip({
  label,
  values,
  open,
  onOpenChange,
  panel,
}: {
  label: string;
  /** Applied values, already formatted for display. */
  values: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: React.ReactNode;
}) {
  const active = values.length > 0;
  return (
    <CometChatPopover
      open={open}
      onOpenChange={onOpenChange}
      trigger="click"
      placement="bottomLeft"
      arrow={false}
      overlayClassName="cc-popover-flush"
      // antd never opens a popover whose content is empty, so the panel is always
      // passed; destroyOnHidden remounts it per open so its draft state resets.
      destroyOnHidden
      content={panel}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "stretch",
          height: CHIP_H,
          boxSizing: "border-box",
          borderRadius: r.md,
          border: `1px dashed ${c.borderDark}`,
          background: active ? c.bgSecondary : c.bgPrimary,
          overflow: "hidden",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, padding: active ? `0 ${s.xs} 0 ${s.md}` : `0 ${s.md}`, color: "var(--text-secondary-hover)" }}>
          <Icon name="add-circle" size={dim.iconXs} />
          <span style={{ ...font.bodyMd, color: "inherit" }}>{label}</span>
        </span>
        {active && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, padding: `0 ${s.md}`, borderLeft: `1px dashed ${c.borderDark}` }}>
            {values.slice(0, MAX_PILLS).map((v) => (
              <span key={v} style={{ display: "inline-flex", alignItems: "center", padding: `${s.xxs} ${s.sm}`, borderRadius: r.sm, background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, ...font.caption, color: c.textSecondary, whiteSpace: "nowrap" }}>
                {v}
              </span>
            ))}
            {values.length > MAX_PILLS && <span style={{ ...font.caption, color: c.textSecondary }}>+{values.length - MAX_PILLS}</span>}
          </span>
        )}
      </button>
    </CometChatPopover>
  );
}

/* ---------------- panels ---------------- */

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x) => b.includes(x));

/** Search row: subtle gray search glyph + borderless field (the dashboard's dropdown search). */
function SearchRow({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.md, padding: `${s.md} ${s.lg}`, borderBottom: `1px solid ${c.borderLight}` }}>
      <SearchLg size={dim.iconSm} style={{ color: "var(--fg-quaternary)", flexShrink: 0 }} />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ all: "unset", flex: 1, minWidth: 0, ...font.body, color: c.textPrimary }}
      />
    </div>
  );
}

/**
 * Equal-width footer buttons. Grid tracks, not flex: a flex item's base size can't
 * drop below its padding + border, so black's 2px border kept Apply 2px wider.
 */
const EQUAL_BTN: React.CSSProperties = { width: "100%", boxSizing: "border-box" };

/** Clear / Apply (black = the primary action), equal width. Apply stays disabled until the draft differs from what's applied. */
function PanelFooter({ onClear, onApply, applyDisabled }: { onClear: () => void; onApply: () => void; applyDisabled: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: s.md, padding: s.lg, borderTop: `1px solid ${c.borderLight}` }}>
      <CometChatButton hierarchy="secondary" size="sm" onClick={onClear} style={EQUAL_BTN}>
        Clear
      </CometChatButton>
      <CometChatButton hierarchy="black" size="sm" onClick={onApply} disabled={applyDisabled} style={EQUAL_BTN}>
        Apply
      </CometChatButton>
    </div>
  );
}

function NoMatches({ query }: { query: string }) {
  return (
    <div style={{ padding: `${s.lg} ${s.lg}`, textAlign: "center" }}>
      <span style={{ ...font.body, color: c.textTertiary }}>No matches for “{query.trim()}”</span>
    </div>
  );
}

interface Option {
  value: string;
  label: string;
  /** Extra text the search also matches (e.g. an actor's email). */
  keywords?: string;
}

const matches = (o: Option, q: string) => !q || o.label.toLowerCase().includes(q) || o.keywords?.toLowerCase().includes(q);

/** Search + checkbox list + Clear / Apply. Selection is a draft until Apply. */
function CheckboxPanel({ options, selected, onApply }: { options: Option[]; selected: string[]; onApply: (values: string[]) => void }) {
  const [query, setQuery] = React.useState("");
  const [draft, setDraft] = React.useState<string[]>(selected);
  const q = query.trim().toLowerCase();
  const shown = options.filter((o) => matches(o, q));
  const toggle = (v: string) => setDraft((d) => (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]));
  return (
    <div className="cc-audit-filter" style={{ width: PANEL_W, display: "flex", flexDirection: "column" }}>
      <SearchRow value={query} onChange={setQuery} />
      <div style={{ maxHeight: LIST_MAX_H, overflowY: "auto", padding: `${s.md} 0` }}>
        {shown.length === 0 ? (
          <NoMatches query={query} />
        ) : (
          shown.map((o) => (
            // flex row: the inline-flex checkbox would otherwise sit on a text baseline and add descender space
            <div key={o.value} style={{ display: "flex", padding: `${s.xs} ${s.lg}` }}>
              <CometChatCheckbox size="sm" checked={draft.includes(o.value)} onChange={() => toggle(o.value)} label={o.label} />
            </div>
          ))
        )}
      </div>
      <PanelFooter onClear={() => setDraft([])} onApply={() => onApply(draft)} applyDisabled={sameSet(draft, selected)} />
    </div>
  );
}

/** Search + radio list of presets + Clear / Apply. */
function TimeRangePanel({ value, onApply }: { value: TimePreset | null; onApply: (v: TimePreset | null) => void }) {
  const [query, setQuery] = React.useState("");
  const [draft, setDraft] = React.useState<TimePreset | null>(value);
  const q = query.trim().toLowerCase();
  const shown = TIME_PRESETS.filter((p) => PRESET_LABEL[p].toLowerCase().includes(q));
  return (
    <div className="cc-audit-filter" style={{ width: PANEL_W, display: "flex", flexDirection: "column" }}>
      <SearchRow value={query} onChange={setQuery} />
      <div style={{ padding: `${s.md} ${s.lg}` }}>
        {shown.length === 0 ? (
          <NoMatches query={query} />
        ) : (
          <CometChatRadio size="sm" value={draft ?? undefined} onChange={(v) => setDraft(v as TimePreset)} options={shown.map((p) => ({ value: p, label: PRESET_LABEL[p] }))} />
        )}
      </div>
      <PanelFooter onClear={() => setDraft(null)} onApply={() => onApply(draft)} applyDisabled={draft === value} />
    </div>
  );
}

const SIX_MONTHS_AGO = () => dayjs().subtract(6, "month").startOf("day");

/** Custom date range (max 6 months back — the retention window) + Clear / Apply. */
function CustomDatesPanel({ value, onApply }: { value: DateFilter | null; onApply: (v: DateFilter | null) => void }) {
  const applied: [Dayjs, Dayjs] | null = value?.preset === "custom" && value.from && value.to ? [dayjs(value.from), dayjs(value.to)] : null;
  const [range, setRange] = React.useState<[Dayjs, Dayjs] | null>(applied);
  const unchanged = (range === null && applied === null) || (range !== null && applied !== null && range[0].isSame(applied[0], "day") && range[1].isSame(applied[1], "day"));
  return (
    <div className="cc-audit-filter" style={{ width: PANEL_W, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: s.lg, display: "flex", flexDirection: "column", gap: s.xs }}>
        <CometChatDatePicker.RangePicker
          className="cc-datepicker"
          value={range}
          onChange={(v) => setRange(v && v[0] && v[1] ? [v[0], v[1]] : null)}
          disabledDate={(d) => d.isAfter(dayjs(), "day") || d.isBefore(SIX_MONTHS_AGO())}
          format="MMM D, YYYY"
          allowClear
          getPopupContainer={(el) => el.parentElement ?? document.body}
        />
        <span style={{ ...font.captionReg, color: c.textTertiary }}>Logs are kept for 6 months.</span>
      </div>
      <PanelFooter
        onClear={() => setRange(null)}
        onApply={() => onApply(range ? { preset: "custom", from: range[0].format("YYYY-MM-DD"), to: range[1].format("YYYY-MM-DD") } : null)}
        applyDisabled={unchanged}
      />
    </div>
  );
}

/* ---------------- bar ---------------- */

type ChipKey = "time" | "custom" | "section" | "action" | "actor" | "source";

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const [openChip, setOpenChip] = React.useState<ChipKey | null>(null);
  const setOpen = (key: ChipKey) => (open: boolean) => setOpenChip(open ? key : null);
  const apply = (patch: Partial<Filters>) => {
    onChange({ ...filters, ...patch });
    setOpenChip(null);
  };

  const sectionLabel = (id: string) => CATALOG.find((sec) => sec.id === id)?.label ?? id;
  const actorName = (id: string) => TEAM.find((m) => m.userId === id)?.name ?? id;
  const actionLabel = (id: string) => lookupAction(id).action.label;

  // Time range and Custom dates share the one date filter; applying either replaces the other.
  const timePreset = filters.date && filters.date.preset !== "custom" ? filters.date.preset : null;
  const customRange = filters.date?.preset === "custom" ? filters.date : null;

  // Action options depend on Section: only actions from the selected sections.
  const actionOptions: Option[] = CATALOG.filter((sec) => filters.sections.length === 0 || filters.sections.includes(sec.id)).flatMap((sec) =>
    sec.actions.map((act) => ({ value: act.id, label: act.label, keywords: sec.label })),
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: s.md }}>
      <FilterChip
        label="Time range"
        values={timePreset ? [PRESET_LABEL[timePreset]] : []}
        open={openChip === "time"}
        onOpenChange={setOpen("time")}
        panel={<TimeRangePanel value={timePreset} onApply={(preset) => apply({ date: preset ? { preset } : null })} />}
      />
      <FilterChip
        label="Custom dates"
        values={customRange ? [`${dayjs(customRange.from).format("MMM D")} – ${dayjs(customRange.to).format("MMM D, YYYY")}`] : []}
        open={openChip === "custom"}
        onOpenChange={setOpen("custom")}
        panel={<CustomDatesPanel value={customRange} onApply={(date) => apply({ date })} />}
      />
      <FilterChip
        label="Section"
        values={filters.sections.map(sectionLabel)}
        open={openChip === "section"}
        onOpenChange={setOpen("section")}
        panel={
          <CheckboxPanel
            options={CATALOG.map((sec) => ({ value: sec.id, label: sec.label }))}
            selected={filters.sections}
            // Changing Section resets the Action filter.
            onApply={(sections) => apply({ sections, actions: sameSet(sections, filters.sections) ? filters.actions : [] })}
          />
        }
      />
      <FilterChip
        label="Action"
        values={filters.actions.map(actionLabel)}
        open={openChip === "action"}
        onOpenChange={setOpen("action")}
        panel={<CheckboxPanel options={actionOptions} selected={filters.actions} onApply={(actions) => apply({ actions })} />}
      />
      <FilterChip
        label="Actor"
        values={filters.actors.map(actorName)}
        open={openChip === "actor"}
        onOpenChange={setOpen("actor")}
        panel={<CheckboxPanel options={TEAM.map((m) => ({ value: m.userId, label: m.name, keywords: m.email }))} selected={filters.actors} onApply={(actors) => apply({ actors })} />}
      />
      <FilterChip
        label="Source"
        values={filters.sources.map((v) => SOURCE_LABEL[v])}
        open={openChip === "source"}
        onOpenChange={setOpen("source")}
        panel={
          <CheckboxPanel
            options={[
              { value: "dashboard", label: "Dashboard" },
              { value: "api", label: "API" },
            ]}
            selected={filters.sources}
            onApply={(sources) => apply({ sources: sources as Source[] })}
          />
        }
      />
      <button
        type="button"
        onClick={() => onChange(EMPTY_FILTERS)}
        disabled={activeFilterCount(filters) === 0}
        style={{ all: "unset", cursor: activeFilterCount(filters) === 0 ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: s.xs, height: CHIP_H, boxSizing: "border-box", padding: `0 ${s.md}`, color: activeFilterCount(filters) === 0 ? c.textQuaternary : c.textTertiary }}
      >
        <Icon name="close" size={dim.iconXs} />
        <span style={{ ...font.bodyMd, color: "inherit" }}>Reset</span>
      </button>
    </div>
  );
}
