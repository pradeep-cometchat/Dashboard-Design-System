// Personal-history detail panel — the app log's 400px slide-out, rendered from
// one GET /me/audit-logs/{externalId} event (v4 envelope, ENG-36975). The title
// is the API's `actionLabel`. There's no Actor section: every row is the
// signed-in person. v4 records only the values an action set (flat `payload`,
// no previous value), so there are no before → after diffs:
//   auth.*            → "Sign-in details"  method, two-factor
//   *.create          → "Created"          payload fields
//   *.delete          → "Removed"          payload fields (often just the id)
//   everything else   → "Values set"       settings = one row named after the setting
import { c } from "../theme";
import { parameterLabel } from "./data";
import { OutcomeBadge, RoleBadge, SourceBadge, VerbBadge, formatDate, formatTime, viewerTimeZone } from "./cells";
import { CHIP_OFFSET, EntityRows, PanelShell, Row, Rows, Section, SectionLink, Value } from "./AuditDetailPanel";
import { ME, appFor, isAccountEvent, meResourceLabel, meSectionLabel, type MeEvent } from "./user-data";

type Obj = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** Nested objects ({ metadata: { messages_moderation: false } }) read as their own fields. */
const flatten = (o: Obj): Obj => Object.fromEntries(Object.entries(o).flatMap(([k, v]) => (isPlainObject(v) ? Object.entries(flatten(v)) : [[k, v]])));

const capitalize = (v: unknown) => (typeof v === "string" && v ? v[0].toUpperCase() + v.slice(1) : v);

function PayloadSection({ entry }: { entry: MeEvent }) {
  const payload = entry.payload;
  if (!payload || Object.keys(payload).length === 0) return null;

  if (entry.section === "auth") {
    const { method, mfa, ...rest } = payload;
    return (
      <Section title="Sign-in details" help="How you signed in, as recorded with this event.">
        <Rows>
          {method !== undefined && (
            <Row label="Method">
              <Value v={capitalize(method)} />
            </Row>
          )}
          {mfa !== undefined && <Row label="Two-factor">{mfa ? "Used" : "Not used"}</Row>}
        </Rows>
        {Object.keys(rest).length > 0 && <EntityRows items={flatten(rest)} />}
      </Section>
    );
  }

  // Settings: one row, labelled with the readable setting name.
  if (typeof payload.parameterId === "string" && "value" in payload) {
    return (
      <Section title="Values set" help="The value this change set. The audit log doesn't keep previous values.">
        <Rows>
          <Row label={parameterLabel(payload.parameterId)}>
            <Value v={payload.value} field={payload.parameterId} />
          </Row>
        </Rows>
      </Section>
    );
  }

  const verb = entry.action.split(".").pop();
  if (verb === "create") {
    return (
      <Section title="Created" help="The values the new item was created with, as recorded by the API. Secrets are never stored and show as Redacted.">
        <EntityRows items={flatten(payload)} />
      </Section>
    );
  }
  if (verb === "delete") {
    return (
      <Section title="Removed" help="What this action removed, as recorded by the API. For many deletes that is only the item's ID.">
        <EntityRows items={flatten(payload)} />
      </Section>
    );
  }
  return (
    <Section title="Values set" help="The values this change set. The audit log doesn't keep previous values. Secrets are never stored and show as Redacted.">
      <EntityRows items={flatten(payload)} />
    </Section>
  );
}

export default function UserAuditDetailPanel({ entry, onClose }: { entry: MeEvent | null; onClose: () => void }) {
  const app = entry ? appFor(entry.appId) : undefined;
  return (
    <PanelShell title={entry ? entry.actionLabel : null} onClose={onClose}>
      {entry && (
        <>
          <Section title="Summary" help="What happened, where it happened, and whether it succeeded.">
            <Rows>
              {isAccountEvent(entry) ? (
                <Row label="Account">{ME.email}</Row>
              ) : (
                <>
                  <Row label="App">{app ? app.name : <span style={{ color: c.textTertiary }}>No longer have access</span>}</Row>
                  <Row label="App ID">{entry.appId}</Row>
                </>
              )}
              <Row label="Resource">{meResourceLabel(entry)}</Row>
              <Row label="Section">
                <SectionLink label={meSectionLabel(entry.section)} />
              </Row>
              <Row label="Action" labelOffset={CHIP_OFFSET}>
                <VerbBadge action={entry.action} />
              </Row>
              {entry.actor.role && (
                <Row label="Your role" labelOffset={CHIP_OFFSET}>
                  <RoleBadge role={entry.actor.role} />
                </Row>
              )}
              <Row label="Outcome" labelOffset={CHIP_OFFSET}>
                <OutcomeBadge outcome={entry.outcome} />
              </Row>
            </Rows>
          </Section>

          <Section title="Details" help={`When and from where the action was performed. Times are shown in your timezone (${viewerTimeZone()}); the API stores them in UTC.`}>
            <Rows>
              <Row label="Date">{formatDate(entry.timestamp)}</Row>
              <Row label="Time">
                {formatTime(entry.timestamp)}
                <span style={{ color: c.textQuaternary }}>({viewerTimeZone()})</span>
              </Row>
              <Row label="Source" labelOffset={CHIP_OFFSET}>
                <SourceBadge source={entry.source} />
              </Row>
              <Row label="Source IP">
                <Value v={entry.sourceIp} />
              </Row>
              <Row label="Event ID">{entry.externalId}</Row>
              <Row label="Correlation ID">
                <Value v={entry.correlationId} />
              </Row>
            </Rows>
          </Section>

          <PayloadSection entry={entry} />
        </>
      )}
    </PanelShell>
  );
}
