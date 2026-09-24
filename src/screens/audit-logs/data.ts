// Audit Logs sample data — shaped exactly like the staging audit-log API
// (GET /apps/{appId}/audit-logs, captured 2026-09-23/24; Linear "Audit Log —
// Wire Contract v1" + the dashboard team's WIRE-CONTRACT.md / Api-response/):
//
//   { externalId, appId, correlationId, timestamp (epoch SECONDS),
//     actor { type, userId, email, role },      ← no display name, no avatar
//     action "section.resource.verb", section,
//     resource { type, id | null },            ← raw ids (parameter keys, microservice ids, key hashes)
//     source "dashboard" | "api", sourceIp, outcome "success" | "failure",
//     change: create{entity} | update{before|null, after} | toggle{after{enabled}}
//             | delete{entity} | auth{context} }
//
// Everything readable (action / section / resource labels, the actor's name and
// photo) is a Dashboard-side lookup: label maps below, plus a join of
// actor.email against the app's team members.

export type Role = "owner" | "admin" | "developer" | "moderator";
export type Source = "dashboard" | "api";
export type Outcome = "success" | "failure";

type Obj = Record<string, unknown>;

export type Change =
  | { type: "create"; entity: Obj }
  | { type: "update"; before: Obj | null; after: Obj }
  | { type: "toggle"; after: { enabled: boolean } }
  | { type: "delete"; entity: Obj }
  | { type: "auth"; context: Obj };

export interface AuditEvent {
  externalId: string;
  appId: string;
  correlationId: string | null;
  /** Epoch seconds (UTC). */
  timestamp: number;
  actor: { type: "user"; userId: number; email: string; role: Role };
  action: string;
  section: string;
  resource: { type: string; id: string | null };
  source: Source;
  sourceIp: string | null;
  outcome: Outcome;
  change: Change;
}

/** Secrets are never stored — the backend keeps the key and sends this marker as the value. */
export const REDACTED = "[redacted]";

/* ---------------- label maps (Dashboard-side) ---------------- */

/** Backend sections (the `/catalog` ids) → readable names. */
export const SECTION_LABEL: Record<string, string> = {
  team: "Team Management",
  app_management: "App Management",
  roles: "Roles & Permissions",
  moderation: "Moderation",
  messages: "Messages",
  apikeys: "API Keys",
  ai: "AI Agents & Bots",
  push: "Push Notifications",
  notifications: "Notifications",
  billing: "Billing & Subscriptions",
  extensions: "Extensions",
  vcb: "Voice & Video",
};

/** Backend action catalog (wire contract §4) → readable labels. The Section / Action filters are built from this, as `/catalog` would. */
export const ACTION_LABEL: Record<string, string> = {
  "team.collaborator.create": "Add collaborator",
  "team.collaborator.delete": "Remove collaborator",
  "team.collaborator.update_role": "Change collaborator role",
  "app_management.app.update": "Update app",
  "app_management.app.delete": "Delete app",
  "app_management.settings.update": "Update app setting",
  "app_management.settings.delete": "Reset app settings",
  "messages.settings.update": "Update messaging setting",
  "roles.role.create": "Create role",
  "roles.role.update": "Update role",
  "roles.role.delete": "Delete role",
  "moderation.rule.create": "Create moderation rule",
  "moderation.rule.update": "Update moderation rule",
  "moderation.rule.delete": "Delete moderation rule",
  "moderation.keyword.create": "Create keyword list",
  "moderation.keyword.update": "Update keyword list",
  "moderation.keyword.delete": "Delete keyword list",
  "moderation.settings.update": "Update moderation settings",
  "apikeys.key.create": "Create API key",
  "apikeys.key.update": "Update API key",
  "apikeys.key.delete": "Delete API key",
  "ai.settings.update": "Update AI setting",
  "ai.agent.create": "Create AI agent",
  "ai.agent.update": "Update AI agent",
  "ai.agent.delete": "Delete AI agent",
  "ai.bot.create": "Create bot",
  "ai.bot.update": "Update bot",
  "ai.bot.delete": "Delete bot",
  "push.settings.update": "Update push settings",
  "push.apns.configure": "Configure APNs",
  "push.fcm.configure": "Configure FCM",
  "push.templates.delete": "Reset push templates",
  "push.preferences.delete": "Reset push preferences",
  "push.custom.delete": "Remove custom push provider",
  "notifications.settings.update": "Update notification setting",
  "billing.subscription.create": "Subscribe to plan",
  "billing.subscription.cancel": "Cancel subscription",
  "extensions.extension.enable": "Enable extension",
  "extensions.extension.disable": "Disable extension",
  "vcb.builder.create": "Create call builder",
  "vcb.builder.update": "Update call builder",
};

/** `resource.type` → readable noun. */
const RESOURCE_TYPE_LABEL: Record<string, string> = {
  collaborator: "Collaborator",
  app: "App",
  settings: "Setting",
  role: "Role",
  rule: "Moderation rule",
  keyword: "Keyword list",
  apikey: "API key",
  agent: "AI agent",
  bot: "Bot",
  provider: "Push provider",
  templates: "Push templates",
  preferences: "Push preferences",
  subscription: "Subscription",
  extension: "Extension",
  builder: "Call builder",
};

/** Settings `resource.id` / `parameterId` → readable name (raw key is the fallback). */
export const PARAMETER_LABEL: Record<string, string> = {
  "core.notifications.push.enabled": "Push notifications",
  "core.notifications.logs.enabledAtMS": "Notification logs enabled at",
  "features.ai.enabled": "AI features",
  "core.chat.messages.retentionDays": "Message retention (days)",
  "core.conversations.updateOnCustomMessage": "Update conversation on custom message",
  "features.moderation.enabled": "Moderation",
};

/** Extension `microserviceId` → product name (raw id is the fallback). */
const EXTENSION_LABEL: Record<string, string> = {
  "message-translation": "Message Translation",
  "stickers-stipop": "Stickers (Stipop)",
  "pin-message": "Pin Message",
  "url-shortener-bitly": "URL Shortener (Bitly)",
  "voice-transcription": "Voice Transcription",
  "disappearing-messages": "Disappearing Messages",
};

const PROVIDER_LABEL: Record<string, string> = { apns: "APNs", fcm: "FCM", custom: "Custom provider" };

export const actionLabel = (id: string) => ACTION_LABEL[id] ?? id;
export const sectionLabel = (id: string) => SECTION_LABEL[id] ?? id;
export const parameterLabel = (key: string) => PARAMETER_LABEL[key] ?? key;

/** Long opaque ids (API key hashes) are shortened for display: first 4 · last 4. */
export const shortId = (id: string) => (id.length > 16 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id);

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/** Readable resource: "<type> → <name>", from `resource` plus whatever the change body names. */
export function resourceLabel(ev: AuditEvent): string {
  const { type, id } = ev.resource;
  const body: Obj = ev.change.type === "create" || ev.change.type === "delete" ? ev.change.entity : ev.change.type === "update" ? ev.change.after : {};
  let name: string;
  switch (type) {
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
      name = str(body.name) ?? (id ? shortId(id) : "—");
      break;
    case "subscription":
      name = str(body.plan) ?? id ?? "—";
      break;
    default:
      // Creates often have resource.id null (the id only exists after the call) — fall back to the entity's name.
      name = str(body.name) ?? str(body.keyword) ?? id ?? "—";
  }
  return `${RESOURCE_TYPE_LABEL[type] ?? type} → ${name}`;
}

/** What was done, for the Action badge. */
export function verbOf(ev: AuditEvent): string {
  if (ev.change.type === "toggle") return ev.change.after.enabled ? "Enabled" : "Disabled";
  if (ev.action.endsWith(".enable")) return "Enabled"; // extension first-enable arrives as `create`
  if (ev.action.endsWith(".disable")) return "Disabled";
  if (ev.action.endsWith(".cancel")) return "Cancelled";
  if (ev.action.endsWith(".configure")) return "Configured";
  switch (ev.change.type) {
    case "create":
      return "Created";
    case "update":
      return "Updated";
    case "delete":
      return ev.action.endsWith("settings.delete") || ev.action.endsWith("templates.delete") || ev.action.endsWith("preferences.delete") ? "Reset" : "Deleted";
    case "auth":
      return "Signed in";
  }
}

/** `/catalog`-style list for the Section → Action filters, built from the label map. */
export const CATALOG: { id: string; label: string; actions: { id: string; label: string }[] }[] = Object.keys(SECTION_LABEL)
  .map((section) => ({
    id: section,
    label: SECTION_LABEL[section],
    actions: Object.keys(ACTION_LABEL)
      .filter((a) => a.startsWith(`${section}.`))
      .map((a) => ({ id: a, label: ACTION_LABEL[a] })),
  }))
  .filter((sec) => sec.actions.length > 0);

/* ---------------- team members (Dashboard's collaborators list) ---------------- */

/** The API has no actor name or photo; the Dashboard joins actor.email against the app's team members. */
export interface Member {
  userId: number;
  name: string;
  email: string;
  avatar: string;
}

export const TEAM: Member[] = [
  { userId: 965, name: "Sarah Chen", email: "sarah.chen@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=47" },
  { userId: 972, name: "James Wilson", email: "james.wilson@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=12" },
  { userId: 981, name: "Priya Sharma", email: "priya.sharma@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=45" },
  { userId: 990, name: "Alex Kim", email: "alex.kim@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=15" },
  { userId: 994, name: "Maria Garcia", email: "maria.garcia@acmecorp.com", avatar: "https://i.pravatar.cc/96?img=5" },
];

export const memberFor = (email: string) => TEAM.find((m) => m.email === email);

/* ---------------- events ---------------- */

const MIN = 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

type ActorSeed = { userId: number; email: string; role: Role };
const SARAH: ActorSeed = { userId: 965, email: "sarah.chen@acmecorp.com", role: "owner" };
const JAMES: ActorSeed = { userId: 972, email: "james.wilson@acmecorp.com", role: "admin" };
const PRIYA: ActorSeed = { userId: 981, email: "priya.sharma@acmecorp.com", role: "admin" };
const ALEX: ActorSeed = { userId: 990, email: "alex.kim@acmecorp.com", role: "developer" };
const MARIA: ActorSeed = { userId: 994, email: "maria.garcia@acmecorp.com", role: "moderator" };
/** Removed from the team since — no longer in the members list, so the UI can only show the email. */
const FORMER: ActorSeed = { userId: 941, email: "tom.baker@acmecorp.com", role: "admin" };

const IP_1 = "10.4.13.7";
const IP_2 = "10.4.6.140";
const KEY_HASH_1 = "be82468ea05aab3f4f40150cefa6bce5c686bd1a";
const KEY_HASH_2 = "4c1f09d2e77ab5613c0b8e9a2f4d6c8e1b3a5f70";

type Seed = {
  ago: number;
  actor: ActorSeed;
  action: string;
  resource: [type: string, id: string | null];
  change: Change;
  source?: Source;
  outcome?: Outcome;
  ip?: string | null;
};

const setting = (key: string, before: unknown, after: unknown): Change => ({
  type: "update",
  before: { parameterId: key, value: before },
  after: { parameterId: key, value: after },
});

const SEEDS: Seed[] = [
  { ago: 4 * MIN, actor: SARAH, action: "apikeys.key.delete", resource: ["apikey", KEY_HASH_1], change: { type: "delete", entity: { id: KEY_HASH_1 } } },
  { ago: 11 * MIN, actor: JAMES, action: "team.collaborator.create", resource: ["collaborator", "david@acmecorp.com"], change: { type: "create", entity: { email: "david@acmecorp.com", role: "developer" } } },
  { ago: 37 * MIN, actor: SARAH, action: "apikeys.key.create", resource: ["apikey", null], change: { type: "create", entity: { name: "Production key", scope: "authOnly" } } },
  { ago: 54 * MIN, actor: PRIYA, action: "moderation.rule.update", resource: ["rule", "profanity-filter"], change: { type: "update", before: null, after: { name: "Profanity Filter", action: "block", enabled: true } }, outcome: "failure" },
  { ago: 79 * MIN, actor: SARAH, action: "notifications.settings.update", resource: ["settings", "core.notifications.push.enabled"], change: setting("core.notifications.push.enabled", false, true) },
  { ago: 3 * HOUR, actor: SARAH, action: "messages.settings.update", resource: ["settings", "core.chat.messages.retentionDays"], change: setting("core.chat.messages.retentionDays", 30, 90) },
  { ago: 4 * HOUR, actor: PRIYA, action: "push.apns.configure", resource: ["provider", "apns"], change: { type: "update", before: null, after: { teamId: "8XK2Q7M4LP", keyId: "ZB39Q2K7HD", p8Key: REDACTED, production: true } }, outcome: "failure" },
  { ago: 6 * HOUR, actor: JAMES, action: "extensions.extension.enable", resource: ["extension", "message-translation"], change: { type: "create", entity: { microserviceId: "message-translation", enabled: true } } },
  { ago: 9 * HOUR, actor: ALEX, action: "ai.agent.create", resource: ["agent", "support-agent"], change: { type: "create", entity: { name: "Support Agent", model: "claude-sonnet-5", temperature: 0.2 } }, source: "api" },
  { ago: 14 * HOUR, actor: MARIA, action: "moderation.keyword.create", resource: ["keyword", "spam-words"], change: { type: "create", entity: { keyword: "spam-words", listName: "Spam", keywords: ["crypto-giveaway", "free-followers", "dm-for-promo"], action: "flag", enabled: true } } },
  { ago: 22 * HOUR, actor: SARAH, action: "team.collaborator.update_role", resource: ["collaborator", "priya.sharma@acmecorp.com"], change: { type: "update", before: { role: "developer" }, after: { role: "admin" } } },
  { ago: DAY + 2 * HOUR, actor: PRIYA, action: "ai.settings.update", resource: ["settings", "features.ai.enabled"], change: setting("features.ai.enabled", true, false) },
  { ago: DAY + 6 * HOUR, actor: SARAH, action: "roles.role.create", resource: ["role", null], change: { type: "create", entity: { name: "Support Lead", description: "Can moderate and read logs", permissions: ["messages.read", "moderation.review"] } } },
  { ago: DAY + 11 * HOUR, actor: JAMES, action: "extensions.extension.disable", resource: ["extension", "url-shortener-bitly"], change: { type: "toggle", after: { enabled: false } } },
  { ago: 2 * DAY, actor: SARAH, action: "billing.subscription.create", resource: ["subscription", "enterprise-2026"], change: { type: "create", entity: { plan: "enterprise-2026", isAnnual: true } } },
  { ago: 2 * DAY + 4 * HOUR, actor: FORMER, action: "roles.role.update", resource: ["role", "support_lead"], change: { type: "update", before: null, after: { name: "Support Lead", permissions: ["messages.read", "moderation.review", "users.read"] } } },
  { ago: 2 * DAY + 9 * HOUR, actor: SARAH, action: "app_management.app.update", resource: ["app", "240998CGSF2026"], change: { type: "update", before: { name: "Acme Chat" }, after: { name: "Acme Support" } } },
  { ago: 3 * DAY, actor: JAMES, action: "extensions.extension.enable", resource: ["extension", "pin-message"], change: { type: "toggle", after: { enabled: true } } },
  { ago: 3 * DAY + 5 * HOUR, actor: PRIYA, action: "apikeys.key.update", resource: ["apikey", KEY_HASH_2], change: { type: "update", before: null, after: { name: "Staging key", scope: "fullAccess" } } },
  { ago: 4 * DAY, actor: ALEX, action: "moderation.rule.delete", resource: ["rule", "link-spam"], change: { type: "delete", entity: { id: "link-spam" } }, outcome: "failure" },
  { ago: 5 * DAY, actor: SARAH, action: "team.collaborator.delete", resource: ["collaborator", "tom.baker@acmecorp.com"], change: { type: "delete", entity: { email: "tom.baker@acmecorp.com", role: "admin" } } },
  { ago: 6 * DAY, actor: JAMES, action: "push.templates.delete", resource: ["templates", "templates"], change: { type: "delete", entity: { id: "templates" } } },
  { ago: 8 * DAY, actor: PRIYA, action: "notifications.settings.update", resource: ["settings", "core.notifications.logs.enabledAtMS"], change: setting("core.notifications.logs.enabledAtMS", 1787138905596, 1790229015028) },
  { ago: 10 * DAY, actor: SARAH, action: "app_management.settings.delete", resource: ["settings", null], change: { type: "delete", entity: { parameterIds: ["core.conversations.updateOnCustomMessage", "features.moderation.enabled"] } } },
  { ago: 12 * DAY, actor: MARIA, action: "moderation.rule.create", resource: ["rule", "link-spam"], change: { type: "create", entity: { name: "Link Spam", description: "Flags messages with 3+ links", action: "flag", enabled: true } } },
  { ago: 15 * DAY, actor: JAMES, action: "roles.role.delete", resource: ["role", "guest"], change: { type: "delete", entity: { id: "guest" } } },
  { ago: 18 * DAY, actor: SARAH, action: "apikeys.key.create", resource: ["apikey", null], change: { type: "create", entity: { name: "Staging key", scope: "fullAccess" } } },
  { ago: 21 * DAY, actor: PRIYA, action: "vcb.builder.create", resource: ["builder", "support-calls"], change: { type: "create", entity: { name: "Support Calls", type: "video", settings: { recording: true, maxParticipants: 8 } } } },
  { ago: 26 * DAY, actor: ALEX, action: "ai.bot.update", resource: ["bot", "order-tracker"], change: { type: "update", before: null, after: { name: "OrderTracker", webhookUrl: "https://bots.acmecorp.com/order", secret: REDACTED } } },
  { ago: 33 * DAY, actor: JAMES, action: "extensions.extension.enable", resource: ["extension", "voice-transcription"], change: { type: "toggle", after: { enabled: true } } },
  { ago: 41 * DAY, actor: SARAH, action: "billing.subscription.cancel", resource: ["subscription", "growth-2025"], change: { type: "delete", entity: { plan: "growth-2025", cancelsAt: 1787200000 } } },
  { ago: 52 * DAY, actor: SARAH, action: "messages.settings.update", resource: ["settings", "core.conversations.updateOnCustomMessage"], change: setting("core.conversations.updateOnCustomMessage", true, false) },
];

const uuid = (n: number) => {
  const h = (x: number) => ((x * 2654435761) >>> 0).toString(16).padStart(8, "0");
  return `${h(n)}-${h(n + 7).slice(0, 4)}-4${h(n + 13).slice(0, 3)}-a${h(n + 19).slice(0, 3)}-${h(n + 23)}${h(n + 29).slice(0, 4)}`;
};

/** Events newest first; timestamps are relative to `now` (epoch seconds) so the date presets always have data. */
export function buildEvents(nowSeconds = Math.floor(Date.now() / 1000)): AuditEvent[] {
  return SEEDS.map((sd, i) => ({
    externalId: uuid(i + 1),
    appId: "240998CGSF2026",
    correlationId: uuid(i + 101),
    timestamp: nowSeconds - sd.ago,
    actor: { type: "user", ...sd.actor },
    action: sd.action,
    section: sd.action.split(".")[0],
    resource: { type: sd.resource[0], id: sd.resource[1] },
    source: sd.source ?? "dashboard",
    sourceIp: sd.ip === undefined ? (i % 3 === 0 ? IP_1 : IP_2) : sd.ip,
    outcome: sd.outcome ?? "success",
    change: sd.change,
  }));
}
