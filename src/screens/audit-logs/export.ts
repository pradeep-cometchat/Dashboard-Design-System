// Export — Feature Narrative: download the filtered results as CSV or JSON,
// timestamps in UTC ISO 8601 for machine readability.
import { lookupAction, type AuditEntry } from "./data";

export type ExportFormat = "csv" | "json";

const flatten = (e: AuditEntry) => {
  const { action, section } = lookupAction(e.actionId);
  return {
    id: e.id,
    timestamp: e.timestamp,
    actor_email: e.actor.email,
    actor_id: e.actor.userId,
    actor_role: e.actor.role,
    action: action.id,
    action_label: action.label,
    section: section.label,
    resource: e.resource,
    outcome: e.outcome,
    source: e.source,
    source_ip: e.sourceIp,
    change: e.change,
  };
};

const csvCell = (v: unknown) => {
  const str = typeof v === "string" ? v : JSON.stringify(v);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export function serialize(entries: AuditEntry[], format: ExportFormat): string {
  const rows = entries.map(flatten);
  if (format === "json") return JSON.stringify(rows, null, 2);
  const headers = Object.keys(rows[0] ?? flatten(entries[0]));
  return [headers.join(","), ...rows.map((row) => headers.map((h) => csvCell((row as Record<string, unknown>)[h])).join(","))].join("\n");
}

export function downloadExport(entries: AuditEntry[], format: ExportFormat, appId: string) {
  const body = serialize(entries, format);
  const blob = new Blob([body], { type: format === "json" ? "application/json" : "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${appId}-${new Date().toISOString().slice(0, 10)}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
