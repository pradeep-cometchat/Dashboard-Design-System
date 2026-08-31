// "Pin a conversation" picker — the Add Members modal pattern from the
// dashboard, with copy written for the Pin context. Built from base
// components (CometChatModal, CometChatInput, CometChatButton,
// CometChatAvatar) and foundation tokens; glyphs come from the vendored
// May 2026 icon set. Avatar photos use the same pravatar convention as the
// Conversation Explorer demo data.
import React from "react";
import CometChatModal from "components/base/Modal/CometChatModal";
import CometChatInput from "components/base/Input/CometChatInput";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import CometChatTabs from "components/base/Tabs/CometChatTabs";
import { c, r, s, font } from "../theme";
import { Icon, dim } from "./ui";
import "./pin-modal.scss";

const w = {
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

export type ConversationType = "user" | "group";
export type Conversation = { id: string; name: string; type: ConversationType; uid: string; avatar?: string };

const USER_NAMES = [
  "Andrew Joseph", "George Alan", "Nancy Grace", "Susan Marie", "John Paul",
  "Olivia Rhye", "Alec Whitten", "Priya Shah", "Marco Rossi", "Amara Okafor",
  "Wei Chen", "Lena Fischer", "Diego Alvarez", "Fatima Noor", "Tom Becker",
  "Ana Souza", "Ken Watanabe", "Sara Lindgren", "Ravi Patel", "Mia Novak",
];
const GROUP_NAMES = [
  "Design Crew", "Support Heroes", "Launch Week", "Beta Testers", "Product Squad",
  "Growth Guild", "Mobile Guild", "Web Platform", "API Partners", "Onboarding Cohort",
  "Release Captains", "Docs Circle", "QA Task Force", "Sales Bridge", "Community Mods",
  "Weekend Hackers", "Infra Watch", "Billing Desk", "Customer Council", "Announcements",
];

export const CONVERSATIONS: Conversation[] = [
  ...USER_NAMES.map((name, i): Conversation => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    type: "user",
    uid: `cometchat-uid-${i + 1}`,
    avatar: `https://i.pravatar.cc/96?img=${(i * 7) % 70 + 1}`,
  })),
  ...GROUP_NAMES.map((name, i): Conversation => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    type: "group",
    uid: `cometchat-guid-${i + 1}`,
  })),
].sort((a, b) => a.name.localeCompare(b.name));

const TAB_ITEMS = [
  { key: "all", label: "All" },
  { key: "user", label: "Users" },
  { key: "group", label: "Groups" },
];

const PAGE = 8;

/** Admins can pin at most this many conversations. */
export const PIN_LIMIT = 5;
// List viewport height — a component dimension with no foundation token yet
// (needs a $control/$panel size family); fixed so the card doesn't resize
// when a tab filters down to fewer rows.
const LIST_HEIGHT = 360;

export default function PinConversationModal({
  open,
  onClose,
  pinned,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  pinned: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const [visible, setVisible] = React.useState(PAGE);
  const atLimit = pinned.size >= PIN_LIMIT;
  const matches = CONVERSATIONS.filter(
    (conv) => (tab === "all" || conv.type === tab) && conv.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const shown = matches.slice(0, visible);
  const onListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      setVisible((v) => (v < matches.length ? v + PAGE : v));
    }
  };

  return (
    <CometChatModal
      open={open}
      onCancel={onClose}
      title="Pin a conversation"
      description={
        atLimit
          ? `All ${PIN_LIMIT} pin slots are used. Unpin a conversation to make room for another.`
          : `Pinned conversations appear at the top of the list for everyone. You can pin up to ${PIN_LIMIT}.`
      }
      showClose
      hideOk
      hideCancel
      size="3xl"
      className="cc-pin-modal"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: s.xl }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: s.lg }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
            <CometChatInput
              placeholder="Search by name or group"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              prefix={<Icon name="search" size={dim.iconSm} color={c.textQuaternary} />}
              allowClear
            />
          </div>
          <CometChatTabs
            type="button-border"
            size="sm"
            items={TAB_ITEMS}
            activeKey={tab}
            onChange={(key) => {
              setTab(key);
              setVisible(PAGE);
            }}
          />
        </div>

        <div style={{ border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden" }}>
          <div style={{ background: c.bgSecondary, borderBottom: `1px solid ${c.borderDefault}`, padding: `${s.lg} ${s.xl}` }}>
            <span style={{ ...font.caption, fontWeight: w.semibold as unknown as number, color: c.textQuaternary }}>Conversation</span>
          </div>

          <div style={{ height: LIST_HEIGHT, overflowY: "auto" }} onScroll={onListScroll}>
            {shown.length === 0 ? (
              <div style={{ padding: `${s["3xl"]} ${s.xl}`, textAlign: "center" }}>
                <span style={{ ...font.body, color: c.textTertiary }}>No conversations match “{query.trim()}”</span>
              </div>
            ) : (
              shown.map((conv) => (
                <div
                  key={conv.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: s.lg,
                    padding: `${s.md} ${s.xl}`,
                    borderBottom: `1px solid ${c.borderLight}`,
                  }}
                >
                  {conv.type === "user" ? (
                  <CometChatAvatar src={conv.avatar} size={dim.avatar} alt={conv.name} />
                ) : (
                  <CometChatAvatar size={dim.avatar} alt={conv.name} icon={<Icon name="group" size={dim.iconSm} color={c.textSecondary} />} />
                )}
                  <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <span style={{ ...font.bodyMd, color: c.textPrimary }}>{conv.name}</span>
                    <span style={{ ...font.captionReg, color: c.textTertiary }}>{conv.uid}</span>
                  </span>
                  {pinned.has(conv.id) ? (
                    <CometChatButton hierarchy="tertiary" iconLeading={<Icon name="check" size={dim.iconSm} />} onClick={() => onToggle(conv.id)}>
                      Pinned
                    </CometChatButton>
                  ) : (
                    <CometChatButton hierarchy="secondary" disabled={atLimit} onClick={() => onToggle(conv.id)}>
                      Pin
                    </CometChatButton>
                  )}
                </div>
              ))
            )}
            {shown.length > 0 && shown.length < matches.length && (
              <div style={{ padding: `${s.md} ${s.xl}`, textAlign: "center" }}>
                <span style={{ ...font.caption, color: c.textQuaternary }}>Scroll for more</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CometChatModal>
  );
}
