// Personal-history filters — the same chip row as the app log, limited to what
// GET /me/audit-logs accepts: `scope` (Activity), `from` / `to` (Time range,
// Custom dates), `section` and `action` (from /me/audit-logs/catalog). There's
// no app, actor or source filter on this route.
import React from "react";
import dayjs from "dayjs";
import { s } from "../theme";
import { CheckboxPanel, CustomDatesPanel, FilterChip, PRESET_LABEL, RadioPanel, ResetButton, TimeRangePanel, matchesDate, sameSet, type DateFilter, type Option } from "./filters";
import type { CatalogSection, MeEvent, Scope } from "./user-data";

export interface MeFilters {
  /** `all` (the API default) = no filter. */
  scope: Scope;
  date: DateFilter | null;
  sections: string[];
  actions: string[];
}

export const EMPTY_ME_FILTERS: MeFilters = { scope: "all", date: null, sections: [], actions: [] };

export const activeMeFilterCount = (f: MeFilters) => [f.scope !== "all", f.date !== null, f.sections.length > 0, f.actions.length > 0].filter(Boolean).length;

const SCOPE_OPTIONS: Option[] = [
  { value: "account", label: "Account activity", keywords: "sign in login" },
  { value: "performed", label: "App changes" },
];
const scopeLabel = (scope: Scope) => SCOPE_OPTIONS.find((o) => o.value === scope)?.label ?? scope;

export function applyMeFilters(entries: MeEvent[], f: MeFilters, now = Date.now()): MeEvent[] {
  return entries.filter((e) => {
    // scope: account = events with customerId, performed = events with appId.
    if (f.scope === "account" && e.customerId === undefined) return false;
    if (f.scope === "performed" && e.appId === undefined) return false;
    if (!matchesDate(e.timestamp, f.date, now)) return false;
    if (f.sections.length && !f.sections.includes(e.section)) return false;
    if (f.actions.length && !f.actions.includes(e.action)) return false;
    return true;
  });
}

/**
 * Action options from the catalog. The API's labels repeat across sections ("Updated settings" is
 * both AI and Notifications), so a repeated label gets its section added to tell them apart.
 */
function actionOptions(catalog: CatalogSection[]): Option[] {
  const all = catalog.flatMap((sec) => sec.actions.map((a) => ({ value: a, label: sec.actionLabels[a], section: sec.sectionLabel })));
  const count = (label: string) => all.filter((o) => o.label === label).length;
  return all.map((o) => ({ value: o.value, label: count(o.label) > 1 ? `${o.label} (${o.section})` : o.label, keywords: o.section }));
}

type ChipKey = "scope" | "time" | "custom" | "section" | "action";

export function UserFilterBar({ filters, catalog, onChange }: { filters: MeFilters; catalog: CatalogSection[]; onChange: (next: MeFilters) => void }) {
  const [openChip, setOpenChip] = React.useState<ChipKey | null>(null);
  const setOpen = (key: ChipKey) => (open: boolean) => setOpenChip(open ? key : null);
  const apply = (patch: Partial<MeFilters>) => {
    onChange({ ...filters, ...patch });
    setOpenChip(null);
  };

  const sectionLabel = (id: string) => catalog.find((sec) => sec.section === id)?.sectionLabel ?? id;
  const allActions = actionOptions(catalog);
  const actionLabel = (id: string) => allActions.find((o) => o.value === id)?.label ?? id;
  // Action options depend on Section: only actions from the selected sections.
  const shownActions = actionOptions(catalog.filter((sec) => filters.sections.length === 0 || filters.sections.includes(sec.section))).map((o) => ({ ...o, label: actionLabel(o.value) }));

  // Time range and Custom dates share the one date filter; applying either replaces the other.
  const timePreset = filters.date && filters.date.preset !== "custom" ? filters.date.preset : null;
  const customRange = filters.date?.preset === "custom" ? filters.date : null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: s.md }}>
      <FilterChip
        label="Activity"
        values={filters.scope === "all" ? [] : [scopeLabel(filters.scope)]}
        open={openChip === "scope"}
        onOpenChange={setOpen("scope")}
        panel={<RadioPanel options={SCOPE_OPTIONS} value={filters.scope === "all" ? null : filters.scope} onApply={(v) => apply({ scope: (v as Scope | null) ?? "all" })} />}
      />
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
            options={catalog.map((sec) => ({ value: sec.section, label: sec.sectionLabel }))}
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
        panel={<CheckboxPanel options={shownActions} selected={filters.actions} onApply={(actions) => apply({ actions })} />}
      />
      <ResetButton disabled={activeMeFilterCount(filters) === 0} onClick={() => onChange(EMPTY_ME_FILTERS)} />
    </div>
  );
}
