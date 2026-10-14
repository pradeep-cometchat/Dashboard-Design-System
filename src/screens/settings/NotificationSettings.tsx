// Notification Settings — Settings › Preferences tab. Mirrors the dashboard's
// notification preferences screen: Common Preferences (collapsible) holding
// Group, One-on-one and Call preferences. Each row: event, the channels it can
// reach (push / email / SMS), the app default, and whether users may override it.
//
// Options and override rules follow cometchat-notifications-core:
// • Messages, Replies, Quoted Replies, Reactions and Group / Call events each have
//   their own option list (README "Verdicts").
// • Every preference carries an `override` flag ("users may change this"), except
//   Message edited / deleted, whose override admins can't change.
// • Email and SMS only fire for conversation events; actions and calls are push-only.
// Foundation tokens + base components only.
import React from "react";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatTabs from "components/base/Tabs/CometChatTabs";
import CometChatCollapse from "components/base/Collapse/CometChatCollapse";
import CometChatSelect from "components/base/Select/CometChatSelect";
import CometChatToggle from "components/base/Toggle/CometChatToggle";
import CometChatTooltip from "components/base/Tooltip/CometChatTooltip";
import { c, s, r, font } from "../theme";
import { DashboardFrame, Icon, dim } from "../pin/ui";
import "./notification-settings.scss";

const w = {
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

/* ---------------- model ---------------- */

const OPTIONS = {
  messages: ["Don't notify", "Notify for all messages", "Notify for messages with mentions"],
  replies: ["Don't notify", "Notify for all replies", "Notify for replies with mentions", "Notify for subscribed threads"],
  quotedReplies: ["Don't notify", "Notify for all replies", "Notify for replies with mentions", "Notify when my message is quoted"],
  reactions: ["Don't notify", "Notify for reactions received on own messages", "Notify for all reactions"],
  simple: ["Notify", "Don't notify"],
} as const;

type Channel = "push" | "email" | "sms";

interface Pref {
  label: string;
  options: readonly string[];
  value: string;
  /** Channels this event can be delivered on. */
  channels: Channel[];
  /** `undefined` = no user override for this preference (Message edited / deleted). */
  override?: boolean;
  /** Shown only when the group's Legacy checkbox is on. */
  legacy?: boolean;
}

interface PrefGroup {
  title: string;
  prefs: Pref[];
}

const ALL: Channel[] = ["push", "email", "sms"];
const PUSH: Channel[] = ["push"];

const conversations = (quoted: string): PrefGroup => ({
  title: "Conversations",
  prefs: [
    { label: "Messages", options: OPTIONS.messages, value: "Notify for all messages", channels: ALL, override: true },
    { label: "Replies", options: OPTIONS.replies, value: "Notify for subscribed threads", channels: ALL, override: true },
    { label: "Quoted Replies", options: OPTIONS.quotedReplies, value: quoted, channels: ALL, override: true },
  ],
});

const messageActions: PrefGroup = {
  title: "Message Actions",
  prefs: [
    { label: "Message is edited", options: OPTIONS.simple, value: "Don't notify", channels: PUSH },
    { label: "Message is deleted", options: OPTIONS.simple, value: "Don't notify", channels: PUSH },
    { label: "Message receives a reaction", options: OPTIONS.reactions, value: "Notify for reactions received on own messages", channels: PUSH, override: true },
  ],
};

const groupAction = (label: string, value: string): Pref => ({ label, options: OPTIONS.simple, value, channels: PUSH, override: true });

const SECTIONS: { title: string; groups: PrefGroup[] }[] = [
  {
    title: "Group Preferences",
    groups: [
      conversations("Notify when my message is quoted"),
      messageActions,
      {
        title: "Group Actions",
        prefs: [
          groupAction("A member leaves", "Don't notify"),
          groupAction("A new member is added", "Notify"),
          groupAction("A new member joins", "Don't notify"),
          groupAction("A member is kicked", "Don't notify"),
          groupAction("A member is banned", "Don't notify"),
          groupAction("A member is unbanned", "Don't notify"),
          groupAction("A member's scope changes", "Don't notify"),
        ],
      },
    ],
  },
  {
    title: "One-on-one Preferences",
    groups: [conversations("Notify for all replies"), messageActions],
  },
  {
    title: "Call Preferences",
    groups: [
      {
        title: "Call Events",
        prefs: [
          { label: "Call initiated", options: OPTIONS.simple, value: "Notify", channels: PUSH, override: true },
          { label: "Call ongoing", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
          { label: "Call cancelled", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
          { label: "Call rejected", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
          { label: "Call unanswered", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
          { label: "Call busy", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
          { label: "Call ended", options: OPTIONS.simple, value: "Don't notify", channels: PUSH, override: true, legacy: true },
        ],
      },
    ],
  },
];

/* ---------------- building blocks ---------------- */

const CHANNEL: Record<Channel, { icon: string; name: string }> = {
  push: { icon: "notifications", name: "Push" },
  email: { icon: "mail", name: "Email" },
  sms: { icon: "sms", name: "SMS" },
};

/** Push / email / SMS glyphs — brand when the event can use that channel, faded when it can't. */
function Channels({ channels }: { channels: Channel[] }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: s.md }}>
      {(Object.keys(CHANNEL) as Channel[]).map((ch) => {
        const on = channels.includes(ch);
        const tip = `${CHANNEL[ch].name}${on ? "" : " isn't available for this event"}`;
        return (
          <CometChatTooltip key={ch} title={tip} placement="top">
            <span style={{ display: "inline-flex" }} aria-label={tip} role="img">
              <Icon name={CHANNEL[ch].icon} size={dim.iconSm} color={on ? c.brand : "var(--fg-disabled-subtle)"} />
            </span>
          </CometChatTooltip>
        );
      })}
    </span>
  );
}

/** Row grid: event | channels | default | user override. Shared by every row so the columns line up. */
const GRID: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) max-content minmax(0, 1.4fr) max-content",
  columnGap: s["5xl"],
  alignItems: "center",
};

function PrefRow({ pref }: { pref: Pref }) {
  const [value, setValue] = React.useState(pref.value);
  const [override, setOverride] = React.useState(pref.override);
  return (
    <div style={GRID}>
      <span style={{ ...font.body, color: c.textSecondary }}>{pref.label}</span>
      <Channels channels={pref.channels} />
      <CometChatSelect className="cc-notif-select" value={value} onChange={(v) => setValue(v as string)} options={pref.options.map((o) => ({ value: o, label: o }))} aria-label={pref.label} />
      {/* Same width either way, so the column stays aligned on rows without an override. */}
      <span className="cc-notif-override" style={{ display: "inline-flex", alignItems: "center", gap: s.md, visibility: override === undefined ? "hidden" : "visible" }}>
        <span style={{ ...font.body, color: c.textSecondary }}>Override</span>
        <CometChatToggle size="sm" checked={!!override} onChange={(on: boolean) => setOverride(on)} ariaLabel={`Let users override: ${pref.label}`} />
      </span>
    </div>
  );
}

/**
 * A titled group of rows. A group with legacy rows (Call Events) gets a Show / Hide legacy text
 * button: hidden by default (only Call initiated), shown reveals every row.
 */
function Group({ group, last }: { group: PrefGroup; last: boolean }) {
  const hasLegacy = group.prefs.some((p) => p.legacy);
  const [legacy, setLegacy] = React.useState(false);
  const shown = group.prefs.filter((p) => legacy || !p.legacy);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: s.xl, padding: `${s["2xl"]} ${s.lg}`, borderBottom: last ? "none" : `1px solid ${c.borderLight}` }}>
      {/* Title, with the Show / Hide legacy button at the right end of the same line. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.xl }}>
        <h4 style={{ ...font.body, fontWeight: w.medium as unknown as number, color: c.textSecondary, margin: 0 }}>{group.title}</h4>
        {hasLegacy && (
          <CometChatButton hierarchy="tertiary" size="sm" className="cc-notif-legacy-btn" aria-expanded={legacy} onClick={() => setLegacy((on) => !on)}>
            {legacy ? "Hide legacy" : "Show legacy"}
          </CometChatButton>
        )}
      </div>
      {shown.map((p) => (
        <PrefRow key={p.label} pref={p} />
      ))}
    </div>
  );
}

/** Section bar — gray band with the section name and the User Override column header. */
function SectionBar({ title }: { title: string }) {
  const help = "Lets users change this preference for themselves. When it's off, everyone gets the app default.";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${s.lg} ${s.xl}`, background: c.bgSecondary, borderRadius: r.lg }}>
      <h3 style={{ ...font.body, fontWeight: w.medium as unknown as number, color: c.textPrimary, margin: 0 }}>{title}</h3>
      <CometChatTooltip title={help} placement="top">
        <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, ...font.body, color: c.textSecondary }}>
          User Override
          <Icon name="info" size={dim.iconXs} color={c.textQuaternary} />
        </span>
      </CometChatTooltip>
    </div>
  );
}

function Section({ title, groups }: { title: string; groups: PrefGroup[] }) {
  return (
    <section style={{ display: "flex", flexDirection: "column" }}>
      <SectionBar title={title} />
      {groups.map((g, i) => (
        <Group key={g.title} group={g} last={i === groups.length - 1} />
      ))}
    </section>
  );
}

/* ---------------- the screen ---------------- */

export default function NotificationSettingsScreen() {
  return (
    <DashboardFrame active="Notifications">
      <div style={{ display: "flex", flexDirection: "column", gap: s.xl }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: dim.avatar }}>
          <h1
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-display-xs)",
              lineHeight: "var(--line-height-display-xs)",
              fontWeight: w.semibold as unknown as number,
              color: c.textPrimary,
              margin: 0,
            }}
          >
            Settings
          </h1>
          <CometChatButton hierarchy="secondary">Documentation</CometChatButton>
        </header>

        <CometChatTabs
          type="button-border"
          className="cc-notif-tabs"
          defaultActiveKey="preferences"
          items={[
            { key: "providers", label: "Providers" },
            { key: "preferences", label: "Preferences" },
            { key: "templates", label: "Templates and Sounds" },
          ]}
        />

        <CometChatCollapse
          className="cc-notif-collapse"
          defaultActiveKey={["common"]}
          items={[
            {
              key: "common",
              label: "Common Preferences",
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: s["2xl"] }}>
                  {SECTIONS.map((sec) => (
                    <Section key={sec.title} title={sec.title} groups={sec.groups} />
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </DashboardFrame>
  );
}
