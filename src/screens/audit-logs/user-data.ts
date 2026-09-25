// User-level (personal) audit history — shaped exactly like GET /me/audit-logs
// (mgmt proxy, Dashboard token; captured on staging 2026-09-24, `me.zip`) and
// the v4 envelope in Linear ENG-36975:
//
//   { schemaVersion, externalId, appId? | customerId?, correlationId?,
//     timestamp (epoch SECONDS), actor { type, userId?, email?, role? },
//     action "section.resource.verb", section, resource { type, id? },
//     source, sourceIp?, outcome, actionLabel, payload? }
//
// • Null keys are omitted, so optional fields are tested by presence.
// • Exactly one of `appId` (a change you made in an app) or `customerId`
//   (something that happened to your account, e.g. a sign-in) is set.
// • `payload` is flat: the values the action set. No previous value, no
//   change-type discriminator.
// • `actionLabel` comes from the server; section labels come from /catalog.
//
// There is no user id in the URL — mgmt takes it from the token — so this is
// only ever the signed-in person's own history.
import { EXTENSION_LABEL, PROVIDER_LABEL, RESOURCE_TYPE_LABEL, flowLabel, parameterLabel, shortId, type Outcome, type Role, type Source } from "./data";

export type Scope = "all" | "account" | "performed";

type Obj = Record<string, unknown>;

export interface MeEvent {
  schemaVersion: number;
  externalId: string;
  /** Present on app changes. */
  appId?: string;
  /** Present on account events (users.id). */
  customerId?: number;
  correlationId?: string;
  /** Epoch seconds (UTC). */
  timestamp: number;
  /** Account events carry only `type`. */
  actor: { type: "user"; userId?: number; email?: string; role?: Role };
  action: string;
  section: string;
  resource: { type: string; id?: string };
  source: Source;
  sourceIp?: string;
  outcome: Outcome;
  actionLabel: string;
  payload?: Obj;
}

export const isAccountEvent = (ev: MeEvent) => ev.customerId !== undefined;

/* ---------------- who's signed in, and their apps ---------------- */

/** The signed-in person (the Dashboard session). */
export const ME = { customerId: 72, name: "Sarah Chen", email: "sarah.chen@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=47" };

/** The API sends only `appId`; the Dashboard joins it against the person's apps list. */
export interface MyApp {
  appId: string;
  name: string;
}

export const MY_APPS: MyApp[] = [
  { appId: "255454119af71a5a", name: "Acme Support" },
  { appId: "2539140dae87f014", name: "Acme Marketplace" },
  { appId: "2555726ba618578e", name: "QA Sandbox" },
];

/** An app you've since left (or that was deleted): its events stay in your history, its name doesn't. */
const LEFT_APP_ID = "2561b09c7d3e44f1";

export const appFor = (appId: string | undefined) => MY_APPS.find((a) => a.appId === appId);

/* ---------------- catalog (GET /me/audit-logs/catalog) ---------------- */

/** `sectionLabel` per section, as /catalog sends it. */
const SECTION_LABELS: Record<string, string> = {
  ai: "AI",
  apikeys: "API Keys",
  app_management: "App Management",
  auth: "Auth",
  extensions: "Extensions",
  moderation: "Moderation",
  notifications: "Notifications",
  push: "Push",
  roles: "Roles",
};

/** `actionLabels`, as /catalog and every row (`actionLabel`) send them — derived server-side from the action's segments. */
const ACTION_LABELS: Record<string, string> = {
  "ai.settings.update": "Updated settings",
  "apikeys.key.create": "Created key",
  "apikeys.key.delete": "Deleted key",
  "apikeys.key.update": "Updated key",
  "app_management.app.update": "Updated app",
  "auth.session.login": "Signed in",
  "extensions.extension.disable": "Disabled extension",
  "extensions.extension.enable": "Enabled extension",
  "moderation.keyword.create": "Created keyword",
  "moderation.keyword.delete": "Deleted keyword",
  "notifications.settings.update": "Updated settings",
  "push.custom.delete": "Deleted custom",
  "push.preferences.delete": "Deleted preferences",
  "push.templates.delete": "Deleted templates",
  "roles.role.create": "Created role",
  "roles.role.delete": "Deleted role",
  "roles.role.update": "Updated role",
};

export interface CatalogSection {
  section: string;
  sectionLabel: string;
  actions: string[];
  actionLabels: Record<string, string>;
}

export const meSectionLabel = (section: string) => SECTION_LABELS[section] ?? section;
export const meActionLabel = (action: string) => ACTION_LABELS[action] ?? action;

/* ---------------- display helpers ---------------- */

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/** Readable resource: "<type> → <name>", from `resource` plus whatever the payload names. */
export function meResourceLabel(ev: MeEvent): string {
  const { type, id } = ev.resource;
  const p = ev.payload ?? {};
  let name: string;
  switch (type) {
    case "user":
      return "Your account";
    case "app":
      // resource.id arrives truncated for app events ("255454" for 255454119af71a5a), so name the row's appId instead.
      name = appFor(ev.appId)?.name ?? ev.appId ?? "—";
      break;
    case "settings":
      name = id ? parameterLabel(id) : "Multiple settings";
      break;
    case "extension":
      name = id ? EXTENSION_LABEL[id] ?? id : "—";
      break;
    case "provider":
      name = id ? PROVIDER_LABEL[id] ?? id : "—";
      break;
    case "templates":
    case "preferences":
      return RESOURCE_TYPE_LABEL[type];
    case "apikey":
      name = str(p.name) ?? (id ? shortId(id) : "—");
      break;
    default:
      // Creates often have no resource.id (it only exists after the call) — fall back to the payload's name.
      name = str(p.name) ?? id ?? "—";
  }
  return flowLabel(type, id, name);
}

/** Verb for the Action badge — from the action's last segment (v4 has no change type). */
export function meVerb(action: string): string {
  const verb = action.split(".").pop();
  if (verb === "delete" && /\.(settings|templates|preferences)\.delete$/.test(action)) return "Reset";
  switch (verb) {
    case "create":
      return "Created";
    case "update":
      return "Updated";
    case "delete":
      return "Deleted";
    case "enable":
      return "Enabled";
    case "disable":
      return "Disabled";
    case "configure":
      return "Configured";
    case "login":
      return "Signed in";
    default:
      return verb ? verb[0].toUpperCase() + verb.slice(1) : action;
  }
}

/* ---------------- events ---------------- */

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const IP_1 = "10.4.13.7";
const IP_2 = "10.4.6.140";
/** Credential-shaped resource ids arrive masked: first four and last four kept, the middle starred. */
const MASKED_KEY = "be82********************************bd1a";

type Seed = {
  ago: number;
  /** An app id for an app change; omitted for an account event. */
  app?: string;
  role?: Role;
  action: string;
  resource: [type: string, id?: string];
  payload?: Obj;
  outcome?: Outcome;
};

const A1 = MY_APPS[0].appId;
const A2 = MY_APPS[1].appId;
const A3 = MY_APPS[2].appId;

const signIn = (ago: number, extra: Partial<Seed> = {}): Seed => ({
  ago,
  action: "auth.session.login",
  resource: ["user", String(ME.customerId)],
  payload: { method: "password", mfa: false },
  ...extra,
});

const SEEDS: Seed[] = [
  { ago: 7 * MIN, app: A1, role: "admin", action: "app_management.app.update", resource: ["app", "255454"], payload: { metadata: { messages_moderation: false } } },
  signIn(26 * MIN),
  { ago: 90 * MIN, app: A2, role: "admin", action: "extensions.extension.enable", resource: ["extension", "save-message"], payload: { enabled: true } },
  { ago: 68 * MIN, app: A2, role: "admin", action: "notifications.settings.update", resource: ["settings", "core.notifications.logs.enabledAtMS"], payload: { parameterId: "core.notifications.logs.enabledAtMS", value: 1790229015028 } },
  { ago: 2 * HOUR, app: A1, role: "admin", action: "roles.role.create", resource: ["role"], payload: { name: "Support Lead", description: "Can moderate and read logs" } },
  { ago: 3 * HOUR, app: A1, role: "admin", action: "roles.role.update", resource: ["role", "support_lead"], payload: { name: "Support Lead (EU)" } },
  signIn(5 * HOUR + 4 * MIN, { outcome: "failure" }),
  signIn(5 * HOUR, { payload: { method: "password", mfa: true } }),
  { ago: 9 * HOUR, app: A2, role: "admin", action: "extensions.extension.enable", resource: ["extension", "message-translation"], payload: { enabled: true } },
  { ago: 14 * HOUR, app: A1, role: "admin", action: "apikeys.key.create", resource: ["apikey"], payload: { name: "Production key", scope: "authOnly" } },
  { ago: 20 * HOUR, app: A1, role: "admin", action: "moderation.keyword.create", resource: ["keyword", "spam-words"], payload: { id: "spam-words" } },
  { ago: DAY + 2 * HOUR, app: A3, role: "owner", action: "ai.settings.update", resource: ["settings", "features.ai.enabled"], payload: { parameterId: "features.ai.enabled", value: false } },
  signIn(DAY + 6 * HOUR),
  { ago: DAY + 9 * HOUR, app: A3, role: "owner", action: "push.templates.delete", resource: ["templates", "templates"], payload: { id: "templates" } },
  { ago: 2 * DAY, app: A3, role: "owner", action: "push.preferences.delete", resource: ["preferences", "preferences"], payload: { id: "preferences" } },
  { ago: 2 * DAY + 3 * HOUR, app: A3, role: "owner", action: "push.custom.delete", resource: ["provider", "custom"], payload: { id: "custom" } },
  { ago: 2 * DAY + 8 * HOUR, app: A2, role: "admin", action: "extensions.extension.disable", resource: ["extension", "url-shortener-bitly"], payload: { enabled: false } },
  { ago: 3 * DAY, app: A1, role: "admin", action: "apikeys.key.update", resource: ["apikey", MASKED_KEY], payload: { name: "Staging key" } },
  signIn(3 * DAY + 5 * HOUR),
  { ago: 4 * DAY, app: A1, role: "admin", action: "apikeys.key.delete", resource: ["apikey", MASKED_KEY], payload: { id: MASKED_KEY } },
  { ago: 5 * DAY, app: LEFT_APP_ID, role: "admin", action: "roles.role.delete", resource: ["role", "guest"], payload: { id: "guest" } },
  { ago: 6 * DAY, app: LEFT_APP_ID, role: "admin", action: "moderation.keyword.delete", resource: ["keyword", "link-spam"], payload: { id: "link-spam" } },
  { ago: 8 * DAY, app: A2, role: "admin", action: "notifications.settings.update", resource: ["settings", "core.notifications.push.enabled"], payload: { parameterId: "core.notifications.push.enabled", value: true } },
  signIn(10 * DAY),
  { ago: 12 * DAY, app: A3, role: "owner", action: "roles.role.create", resource: ["role"], payload: { name: "QA Test Role", description: "created by test-cases" } },
  { ago: 15 * DAY, app: A3, role: "owner", action: "extensions.extension.enable", resource: ["extension", "pin-message"], payload: { enabled: true } },
  { ago: 18 * DAY, app: A1, role: "admin", action: "app_management.app.update", resource: ["app", "255454"], payload: { name: "Acme Support" } },
  { ago: 22 * DAY, app: A2, role: "admin", action: "moderation.keyword.create", resource: ["keyword", "crypto-scams"], payload: { id: "crypto-scams" } },
  signIn(30 * DAY, { outcome: "failure" }),
  { ago: 35 * DAY, app: A3, role: "owner", action: "ai.settings.update", resource: ["settings", "features.ai.enabled"], payload: { parameterId: "features.ai.enabled", value: true } },
  { ago: 45 * DAY, app: A1, role: "admin", action: "apikeys.key.create", resource: ["apikey"], payload: { name: "Staging key", scope: "fullAccess" } },
  signIn(60 * DAY),
];

const uuid = (n: number) => {
  const h = (x: number) => ((x * 2654435761) >>> 0).toString(16).padStart(8, "0");
  return `${h(n)}-${h(n + 7).slice(0, 4)}-4${h(n + 13).slice(0, 3)}-a${h(n + 19).slice(0, 3)}-${h(n + 23)}${h(n + 29).slice(0, 4)}`;
};

/** Rows keep the schema version they were stored under; all read back in the v4 shape. */
const schemaVersionFor = (ago: number) => (ago < DAY ? 4 : ago < 20 * DAY ? 3 : 1);

/** `GET /me/audit-logs?scope=all`, newest first; timestamps relative to `now` so the date presets always have data. */
export function buildMeEvents(nowSeconds = Math.floor(Date.now() / 1000)): MeEvent[] {
  return SEEDS.map((sd, i): MeEvent => {
    const account = sd.app === undefined;
    return {
      schemaVersion: schemaVersionFor(sd.ago),
      externalId: uuid(i + 201),
      ...(account ? { customerId: ME.customerId } : { appId: sd.app }),
      correlationId: uuid(i + 301),
      timestamp: nowSeconds - sd.ago,
      actor: account ? { type: "user" } : { type: "user", userId: ME.customerId, email: ME.email, role: sd.role },
      action: sd.action,
      section: sd.action.split(".")[0],
      resource: sd.resource[1] === undefined ? { type: sd.resource[0] } : { type: sd.resource[0], id: sd.resource[1] },
      source: "dashboard",
      sourceIp: i % 3 === 0 ? IP_2 : IP_1,
      outcome: sd.outcome ?? "success",
      actionLabel: meActionLabel(sd.action),
      ...(sd.payload ? { payload: sd.payload } : {}),
    };
  }).sort((a, b) => b.timestamp - a.timestamp);
}

/** `GET /me/audit-logs/catalog` — sections and actions present in this person's history, sorted like the API. */
export function buildMeCatalog(events: MeEvent[]): CatalogSection[] {
  const bySection = new Map<string, Set<string>>();
  for (const ev of events) {
    if (!bySection.has(ev.section)) bySection.set(ev.section, new Set());
    bySection.get(ev.section)!.add(ev.action);
  }
  return [...bySection.keys()].sort().map((section) => {
    const actions = [...bySection.get(section)!].sort();
    return { section, sectionLabel: meSectionLabel(section), actions, actionLabels: Object.fromEntries(actions.map((a) => [a, meActionLabel(a)])) };
  });
}
