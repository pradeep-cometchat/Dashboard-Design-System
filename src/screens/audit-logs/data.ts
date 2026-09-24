// Audit Logs sample data, modelled on the Linear Feature Narrative
// ("Dashboard Audit Logs", project P-ENG-362): the Auditable Actions Catalog
// (12 categories), log entry fields (timestamp UTC, actor email / ID / role,
// action, resource, outcome, source Dashboard | API, source IP) and the
// per-type detail payloads (before/after for updates, entity details for
// create/delete, context for auth events).

export type ActionType = "Auth" | "Update" | "Create" | "Delete" | "Config";
export type Role = "owner" | "admin" | "developer" | "moderator";
export type Source = "dashboard" | "api";
export type Outcome = "success" | "failure";

/** Detail payload. Update/Config → before/after; Create/Delete → entity; Auth → context. */
export type Change =
  | { kind: "update"; rows: { field: string; before: string; after: string }[] }
  | { kind: "create"; entity: Record<string, string> }
  | { kind: "delete"; entity: Record<string, string> }
  | { kind: "auth"; context: Record<string, string> };

/** Secrets are never stored — the backend sends this marker and the UI shows "Redacted". */
export const REDACTED = "[redacted]";

/* ---------------- Auditable Actions Catalog ---------------- */

export interface CatalogAction {
  id: string;
  label: string;
  type: ActionType;
}

export interface CatalogSection {
  id: string;
  label: string;
  actions: CatalogAction[];
}

const a = (id: string, label: string, type: ActionType): CatalogAction => ({ id, label, type });

export const CATALOG: CatalogSection[] = [
  {
    id: "auth",
    label: "Authentication & Account",
    actions: [
      a("auth.login", "Login", "Auth"),
      a("auth.login_otp", "Login with OTP", "Auth"),
      a("auth.signup", "Signup", "Auth"),
      a("auth.logout", "Logout", "Auth"),
      a("auth.password_reset", "Password reset", "Auth"),
      a("auth.profile.update", "Update user profile", "Update"),
      a("auth.invite.accept", "Accept collaborator invite", "Auth"),
      a("auth.2fa.toggle", "2FA enable/disable", "Config"),
    ],
  },
  {
    id: "team",
    label: "Team Management",
    actions: [
      a("team.collaborator.add", "Add collaborator", "Create"),
      a("team.collaborator.remove", "Remove collaborator", "Delete"),
      a("team.collaborator.update_role", "Update collaborator role", "Update"),
    ],
  },
  {
    id: "app",
    label: "App Management",
    actions: [
      a("app.create", "Create app", "Create"),
      a("app.update", "Update app", "Update"),
      a("app.delete", "Delete app", "Delete"),
      a("app.settings.update", "Update app settings", "Config"),
      a("app.conversation_settings.update", "Update thread/conversation settings", "Config"),
      a("app.legacy_settings.update", "Update legacy settings", "Config"),
    ],
  },
  {
    id: "users",
    label: "Users",
    actions: [
      a("users.user.create", "Create user", "Create"),
      a("users.user.update", "Update user", "Update"),
      a("users.user.delete", "Delete user (permanent)", "Delete"),
      a("users.user.deactivate", "Deactivate user", "Update"),
      a("users.user.activate", "Activate user", "Update"),
      a("users.auth_token.create", "Create auth token", "Create"),
      a("users.auth_token.delete", "Delete auth token", "Delete"),
      a("users.friend.add", "Add friend", "Update"),
      a("users.friend.remove", "Remove friend", "Update"),
      a("users.group.add", "Add user to group", "Update"),
      a("users.group.kick", "Kick user from group", "Delete"),
      a("users.group.ban", "Ban user from group", "Update"),
      a("users.group.scope", "Update user scope in group", "Update"),
    ],
  },
  {
    id: "groups",
    label: "Groups",
    actions: [
      a("groups.group.create", "Create group", "Create"),
      a("groups.group.update", "Update group", "Update"),
      a("groups.group.delete", "Delete group", "Delete"),
      a("groups.members.add", "Add members", "Update"),
      a("groups.member.kick", "Kick member", "Delete"),
      a("groups.member.ban", "Ban member", "Update"),
      a("groups.member.unban", "Unban member", "Update"),
      a("groups.scope.update", "Update scope permissions", "Config"),
      a("groups.scope.reset", "Reset scope permission", "Config"),
    ],
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    actions: [
      a("roles.role.create", "Create role", "Create"),
      a("roles.role.update", "Update role", "Update"),
      a("roles.role.delete", "Delete role", "Delete"),
      a("roles.restrictions.add", "Add permission restrictions", "Config"),
      a("roles.restrictions.remove", "Remove permission restrictions", "Config"),
      a("roles.permissions.update", "Update role permissions", "Config"),
      a("roles.permissions.reset", "Reset role permission", "Config"),
    ],
  },
  {
    id: "moderation",
    label: "Messages & Moderation",
    actions: [
      a("messages.message.delete", "Delete message", "Delete"),
      a("moderation.message.approve", "Approve moderation message", "Update"),
      a("moderation.message.reject", "Reject moderation message", "Update"),
      a("moderation.flag.accept", "Accept flagged message", "Update"),
      a("moderation.flag.approve", "Approve flagged message", "Update"),
      a("moderation.flag.review", "Review flagged message", "Update"),
      a("moderation.flag.block", "Block flagged message", "Update"),
      a("moderation.flag.ban_sender", "Ban sender of flagged message", "Update"),
      a("moderation.blocked.update", "Update blocked message status", "Update"),
      a("moderation.rule.create", "Create moderation rule", "Create"),
      a("moderation.rule.update", "Update moderation rule", "Update"),
      a("moderation.rule.delete", "Delete moderation rule", "Delete"),
      a("moderation.keyword.create", "Create keyword", "Create"),
      a("moderation.keyword.update", "Update keyword", "Update"),
      a("moderation.keyword.delete", "Delete keyword", "Delete"),
      a("moderation.settings.update", "Update global moderation settings", "Config"),
      a("moderation.category.create", "Add custom category", "Create"),
      a("moderation.category.update", "Update custom category", "Update"),
      a("moderation.category.delete", "Delete custom category", "Delete"),
    ],
  },
  {
    id: "webhooks",
    label: "Webhooks",
    actions: [
      a("webhooks.webhook.create", "Create webhook", "Create"),
      a("webhooks.webhook.update", "Update webhook", "Update"),
      a("webhooks.webhook.delete", "Delete webhook", "Delete"),
      a("webhooks.webhook.enable", "Enable webhook", "Config"),
      a("webhooks.webhook.disable", "Disable webhook", "Config"),
      a("webhooks.triggers.add", "Add webhook triggers", "Update"),
      a("webhooks.triggers.remove", "Remove webhook triggers", "Update"),
    ],
  },
  {
    id: "apikeys",
    label: "API Keys & Credentials",
    actions: [a("apikeys.key.create", "Create API key", "Create"), a("apikeys.key.delete", "Delete API key", "Delete")],
  },
  {
    id: "ai",
    label: "AI Agents & Bots",
    actions: [
      a("ai.agent.update", "Update AI agent", "Update"),
      a("ai.agent.delete", "Delete AI agent", "Delete"),
      a("ai.agent.add_tool", "Add tool to agent", "Update"),
      a("ai.agent.remove_tool", "Remove tool from agent", "Update"),
      a("ai.tool.update", "Update AI tool", "Update"),
      a("ai.knowledge.add", "Add knowledge base files", "Create"),
      a("ai.knowledge.remove", "Remove knowledge base files", "Delete"),
      a("ai.bot.create", "Create bot", "Create"),
      a("ai.bot.update", "Update bot", "Update"),
      a("ai.bot.delete", "Delete bot", "Delete"),
    ],
  },
  {
    id: "push",
    label: "Push Notifications",
    actions: [
      a("push.settings.update", "Update push settings", "Config"),
      a("push.apns.configure", "Configure APNs", "Config"),
      a("push.sendgrid.configure", "Configure SendGrid email", "Config"),
      a("push.twilio.configure", "Configure Twilio SMS", "Config"),
    ],
  },
  {
    id: "billing",
    label: "Billing & Subscriptions",
    actions: [a("billing.subscribe", "Subscribe to plan", "Create"), a("billing.cancel", "Unsubscribe/cancel", "Delete")],
  },
  {
    id: "extensions",
    label: "Extensions & Widgets",
    actions: [
      a("extensions.extension.toggle", "Enable/disable extension", "Config"),
      a("extensions.widget.create", "Create chat widget", "Create"),
      a("extensions.widget.update", "Update chat widget", "Update"),
    ],
  },
];

const ACTION_INDEX = new Map<string, { action: CatalogAction; section: CatalogSection }>();
CATALOG.forEach((section) => section.actions.forEach((action) => ACTION_INDEX.set(action.id, { action, section })));
export const lookupAction = (id: string) => ACTION_INDEX.get(id)!;

/* ---------------- Team members (actor filter source) ---------------- */

export interface Actor {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export const TEAM: Actor[] = [
  { userId: "usr_01", name: "Sarah Chen", email: "sarah.chen@acmecorp.com", role: "owner" },
  { userId: "usr_02", name: "James Wilson", email: "james.wilson@acmecorp.com", role: "admin" },
  { userId: "usr_03", name: "Priya Sharma", email: "priya.sharma@acmecorp.com", role: "admin" },
  { userId: "usr_04", name: "Alex Kim", email: "alex.kim@acmecorp.com", role: "developer" },
  { userId: "usr_05", name: "Maria Garcia", email: "maria.garcia@acmecorp.com", role: "moderator" },
];
const [SARAH, JAMES, PRIYA, ALEX, MARIA] = TEAM;

/* ---------------- Log entries ---------------- */

export interface AuditEntry {
  id: string;
  timestamp: string; // ISO 8601 UTC
  actor: Actor;
  actionId: string;
  /** What was done, as shown in the Action column ("Updated", "Created", "Logged in", …). */
  verb: string;
  /** Section label → affected resource, e.g. "Chat & Messaging → Message Translation". */
  resource: string;
  outcome: Outcome;
  source: Source;
  sourceIp: string;
  change: Change;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

type Seed = [offsetMs: number, actor: Actor, actionId: string, verb: string, resource: string, source: Source, ip: string, change: Change, outcome?: Outcome];

const upd = (...rows: [string, string, string][]): Change => ({ kind: "update", rows: rows.map(([field, before, after]) => ({ field, before, after })) });
const created = (entity: Record<string, string>): Change => ({ kind: "create", entity });
const removed = (entity: Record<string, string>): Change => ({ kind: "delete", entity });
const ctx = (context: Record<string, string>): Change => ({ kind: "auth", context });

const IP_1 = "203.0.113.42";
const IP_2 = "198.51.100.17";
const IP_3 = "192.0.2.88";
const IP_4 = "203.0.113.109";

const SEEDS: Seed[] = [
  [5 * MIN, SARAH, "apikeys.key.delete", "Deleted", "Application → API Key ••••3f2a", "dashboard", IP_1, removed({ Name: "Staging Key", "Key ID": "••••3f2a", Scope: "fullAccess" })],
  [12 * MIN, JAMES, "users.user.create", "Created", "Users → michael@acmecorp.com", "api", IP_2, created({ UID: "michael-001", Name: "Michael Scott", Role: "default" })],
  [38 * MIN, SARAH, "apikeys.key.create", "Created", "Application → API Key ••••9b1c", "dashboard", IP_1, created({ Name: "Production Key", "Key ID": "••••9b1c", Scope: "authOnly", Secret: REDACTED })],
  [55 * MIN, PRIYA, "moderation.rule.update", "Updated", "Moderation → Profanity Filter", "dashboard", IP_3, upd(["Status", "Disabled", "Enabled"], ["Action", "Flag", "Block"])],
  [80 * MIN, JAMES, "users.user.delete", "Deleted", "Users → temp-user@test.com", "dashboard", IP_2, removed({ UID: "temp-user", Name: "Temp User", Role: "default" })],
  [3 * HOUR, SARAH, "app.settings.update", "Updated", "Chat & Messaging → Message Retention", "dashboard", IP_1, upd(["Message Retention", "30 days", "90 days"])],
  [4 * HOUR, PRIYA, "push.apns.configure", "Updated", "Push Notifications → APNs", "dashboard", IP_3, upd(["Provider", "FCM", "APNs"], ["Team ID", "—", "8XK2Q7M4LP"], ["Auth Key (.p8)", REDACTED, REDACTED])],
  [6 * HOUR, JAMES, "auth.login", "Logged in", "Account → Dashboard Login", "dashboard", IP_2, ctx({ Method: "Email + Password", Browser: "Chrome 124", OS: "macOS 15", Location: "Mumbai, IN" })],
  [9 * HOUR, ALEX, "webhooks.webhook.create", "Created", "Webhooks → https://api.acmecorp.com/hooks", "api", IP_4, created({ URL: "https://api.acmecorp.com/hooks", Description: "Order events", Active: "Yes", Secret: REDACTED })],
  [14 * HOUR, MARIA, "moderation.flag.block", "Updated", "Moderation → Flagged message msg-889271", "dashboard", IP_4, upd(["Status", "Flagged", "Blocked"])],
  [22 * HOUR, SARAH, "roles.permissions.update", "Updated", "Roles & Permissions → Admin → Permissions", "dashboard", IP_1, upd(["Delete messages", "Deny", "Allow"], ["Ban users", "Deny", "Allow"])],
  [1 * DAY + 2 * HOUR, PRIYA, "ai.agent.update", "Updated", "AI Agents → Support Agent", "api", IP_3, upd(["Status", "Enabled", "Disabled"])],
  [1 * DAY + 6 * HOUR, SARAH, "ai.bot.create", "Created", "BYO Agents → OrderTracker", "dashboard", IP_1, created({ "Bot UID": "order-tracker", Name: "OrderTracker", Webhook: "https://bots.acmecorp.com/order" })],
  [1 * DAY + 11 * HOUR, JAMES, "webhooks.webhook.update", "Updated", "Webhooks → https://api.acmecorp.com/hooks", "api", IP_2, upd(["Triggers", "message_sent", "message_sent, message_edited"])],
  [2 * DAY, SARAH, "billing.subscribe", "Created", "Plans & Billing → Enterprise", "dashboard", IP_1, created({ Plan: "Enterprise", Billing: "Annual", "Previous plan": "Growth" })],
  [2 * DAY + 4 * HOUR, PRIYA, "users.group.ban", "Updated", "Groups → Hiking Group → spammer42", "dashboard", IP_3, upd(["Membership", "Participant", "Banned"])],
  [2 * DAY + 9 * HOUR, SARAH, "team.collaborator.add", "Created", "Team Members → david@acmecorp.com", "dashboard", IP_1, created({ Email: "david@acmecorp.com", Role: "Developer" })],
  [3 * DAY, JAMES, "extensions.extension.toggle", "Enabled", "Extensions → Message Translation", "api", IP_2, upd(["Message Translation", "Disabled", "Enabled"])],
  [3 * DAY + 5 * HOUR, PRIYA, "groups.group.create", "Created", "Groups → Engineering Team", "dashboard", IP_3, created({ GUID: "engineering", Name: "Engineering Team", Type: "Private" })],
  [4 * DAY, ALEX, "moderation.keyword.delete", "Deleted", "Moderation → Keyword list", "api", IP_4, removed({ Keyword: "crypto-giveaway", List: "Spam" }), "failure"],
  [5 * DAY, SARAH, "team.collaborator.update_role", "Updated", "Team Members → priya.sharma@acmecorp.com", "dashboard", IP_1, upd(["Role", "Developer", "Admin"])],
  [6 * DAY, JAMES, "auth.logout", "Logged out", "Account → Dashboard Logout", "dashboard", IP_2, ctx({ Method: "User initiated", Browser: "Chrome 124", OS: "macOS 15" })],
  [8 * DAY, PRIYA, "push.settings.update", "Updated", "Push Notifications → Settings", "dashboard", IP_3, upd(["Include message body", "Off", "On"])],
  [10 * DAY, SARAH, "auth.2fa.toggle", "Enabled", "Account → Two-factor authentication", "dashboard", IP_1, upd(["Two-factor authentication", "Disabled", "Enabled"])],
  [12 * DAY, MARIA, "moderation.rule.create", "Created", "Moderation → Link Spam", "dashboard", IP_4, created({ Name: "Link Spam", Condition: "Contains URL", Action: "Flag" })],
  [15 * DAY, JAMES, "users.auth_token.create", "Created", "Users → michael-001 → Auth token", "api", IP_2, created({ UID: "michael-001", Token: REDACTED })],
  [18 * DAY, SARAH, "app.update", "Updated", "Application → Acme Support", "dashboard", IP_1, upd(["App name", "Acme Chat", "Acme Support"])],
  [21 * DAY, PRIYA, "roles.role.delete", "Deleted", "Roles & Permissions → Guest", "dashboard", IP_3, removed({ "Role ID": "guest", Name: "Guest" })],
  [26 * DAY, ALEX, "ai.knowledge.add", "Created", "AI Agents → Support Agent → Knowledge base", "api", IP_4, created({ Files: "returns-policy.pdf, shipping-faq.pdf", Count: "2" })],
  [33 * DAY, SARAH, "auth.login", "Logged in", "Account → Dashboard Login", "dashboard", IP_1, ctx({ Method: "Email + OTP", Browser: "Safari 18", OS: "iOS 19", Location: "Bengaluru, IN" }), "failure"],
  [41 * DAY, JAMES, "webhooks.webhook.disable", "Disabled", "Webhooks → https://legacy.acmecorp.com/hook", "dashboard", IP_2, upd(["Active", "Yes", "No"])],
  [52 * DAY, SARAH, "app.conversation_settings.update", "Updated", "Chat & Messaging → Threads", "dashboard", IP_1, upd(["Threaded replies", "Off", "On"])],
];

/** Entries newest first; timestamps are relative to `now` so the date presets always have data. */
export function buildEntries(now = Date.now()): AuditEntry[] {
  return SEEDS.map(([offset, actor, actionId, verb, resource, source, sourceIp, change, outcome = "success"], i) => ({
    id: `evt_${(0x3a9f10 + i * 7919).toString(16)}`,
    timestamp: new Date(now - offset).toISOString(),
    actor,
    actionId,
    verb,
    resource,
    outcome,
    source,
    sourceIp,
    change,
  }));
}
