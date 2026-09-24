// Export — mirrors the server's /audit-logs/export (captured on staging):
// JSON = a bare array of events; CSV = 12 fixed columns with `change` as a JSON
// string. Timestamps are epoch seconds, as the API sends them (the Feature
// Narrative asks for ISO 8601 — see the backend discrepancy list).
import type { AuditEvent } from "./data";

export type ExportFormat = "csv" | "json";

const CSV_COLUMNS = ["timestamp", "action", "section", "actorEmail", "actorRole", "resourceType", "resourceId", "outcome", "sourceIp", "externalId", "correlationId", "change"] as const;

const csvRow = (e: AuditEvent): Record<(typeof CSV_COLUMNS)[number], unknown> => ({
  timestamp: e.timestamp,
  action: e.action,
  section: e.section,
  actorEmail: e.actor.email,
  actorRole: e.actor.role,
  resourceType: e.resource.type,
  resourceId: e.resource.id ?? "",
  outcome: e.outcome,
  sourceIp: e.sourceIp ?? "",
  externalId: e.externalId,
  correlationId: e.correlationId ?? "",
  change: e.change,
});

const csvCell = (v: unknown) => {
  const str = typeof v === "string" ? v : typeof v === "number" ? String(v) : JSON.stringify(v);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export function serialize(events: AuditEvent[], format: ExportFormat): string {
  if (format === "json") return JSON.stringify(events, null, 2);
  return [CSV_COLUMNS.join(","), ...events.map((e) => CSV_COLUMNS.map((col) => csvCell(csvRow(e)[col])).join(","))].join("\n");
}

export function downloadExport(events: AuditEvent[], format: ExportFormat, appId: string) {
  const blob = new Blob([serialize(events, format)], { type: format === "json" ? "application/json" : "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit-logs-${appId}-${new Date().toISOString().slice(0, 10)}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}
