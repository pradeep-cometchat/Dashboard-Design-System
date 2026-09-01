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
import CometChatCheckbox from "components/base/Checkbox/CometChatCheckbox";
import CometChatTabs from "components/base/Tabs/CometChatTabs";
import { c, r, s, font } from "../theme";
import { Icon, dim } from "./ui";
import "./pin-modal.scss";

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

// Labels carry a hidden semibold ghost (see pin-modal.scss) so each tab keeps
// its active-state width and the bar doesn't resize as the selection moves.
const tabLabel = (text: string) => (
  <span className="cc-pin-modal__tab-label" data-label={text}>
    {text}
  </span>
);
const TAB_ITEMS = [
  { key: "all", label: tabLabel("All") },
  { key: "user", label: tabLabel("Users") },
  { key: "group", label: tabLabel("Groups") },
];

const PAGE = 8;

/** Admins can pin at most this many conversations. */
export const PIN_LIMIT = 5;
// List viewport height — a component dimension with no foundation token yet
// (needs a $control/$panel size family); fixed so the card doesn't resize
// when a tab filters down to fewer rows.
const LIST_HEIGHT = 360;
// Picker list viewport; max-height so short result sets leave no blank space.
const PICKER_LIST_HEIGHT = 240;

/**
 * The picker body — search + tabs, checkbox multi-select rows, and a
 * Cancel / "Pin selected (n)" footer. Hosted by the pop-up modal.
 * Already-pinned conversations are excluded; selection stops at the free slots.
 */
export function PinPickerSelect({
  pinned,
  onCancel,
  onConfirm,
}: {
  pinned: Set<string>;
  onCancel: () => void;
  onConfirm: (ids: string[]) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [tab, setTab] = React.useState("all");
  const [visible, setVisible] = React.useState(PAGE);
  const [selected, setSelected] = React.useState<string[]>([]);
  const free = PIN_LIMIT - pinned.size - selected.length;
  const matches = CONVERSATIONS.filter(
    (conv) => !pinned.has(conv.id) && (tab === "all" || conv.type === tab) && conv.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const shown = matches.slice(0, visible);
  const onListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      setVisible((v) => (v < matches.length ? v + PAGE : v));
    }
  };
  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : free > 0 ? [...prev, id] : prev));

  return (
    <div className="cc-pin-picker" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: s.lg, padding: `${s.xl} ${s["3xl"]}`, borderBottom: `1px solid ${c.borderLight}` }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
          <CometChatInput
            placeholder="Search people or groups"
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

      <div style={{ maxHeight: PICKER_LIST_HEIGHT, overflowY: "auto" }} onScroll={onListScroll}>
        {shown.length === 0 ? (
          <div style={{ padding: `${s["3xl"]} ${s.xl}`, textAlign: "center" }}>
            <span style={{ ...font.body, color: c.textTertiary }}>No conversations match “{query.trim()}”</span>
          </div>
        ) : (
          shown.map((conv) => {
            const checked = selected.includes(conv.id);
            const disabled = !checked && free <= 0;
            return (
              <div
                key={conv.id}
                onClick={() => !disabled && toggleSelect(conv.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s.lg,
                  padding: `${s.md} ${s["3xl"]}`,
                  borderBottom: `1px solid ${c.borderLight}`,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {/* stopPropagation: without it a checkbox click also fires the row's onClick and the two toggles cancel out. */}
                {/* marginRight tops up the row's 12px gap to a 16px visible gap between checkbox and avatar */}
                <span onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", marginRight: s.xs }}>
                  <CometChatCheckbox checked={checked} disabled={disabled} ariaLabel={`Select ${conv.name}`} onChange={() => !disabled && toggleSelect(conv.id)} />
                </span>
                {conv.type === "user" ? (
                  <CometChatAvatar src={conv.avatar} size={dim.avatar} alt={conv.name} />
                ) : (
                  <CometChatAvatar size={dim.avatar} alt={conv.name} icon={<Icon name="group" size={dim.iconSm} color={c.textSecondary} />} />
                )}
                <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                  <span style={{ ...font.bodyMd, color: c.textPrimary }}>{conv.name}</span>
                  <span style={{ ...font.body, color: c.textQuaternary }}>{conv.uid}</span>
                </span>
              </div>
            );
          })
        )}
        {shown.length > 0 && shown.length < matches.length && (
          <div style={{ padding: `${s.md} ${s.xl}`, textAlign: "center" }}>
            <span style={{ ...font.caption, color: c.textQuaternary }}>Scroll for more</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: s.lg, padding: `${s.xl} ${s["3xl"]}`, borderTop: `1px solid ${c.borderLight}` }}>
        <CometChatButton hierarchy="secondary" onClick={onCancel}>
          Cancel
        </CometChatButton>
        <CometChatButton hierarchy="primary" disabled={selected.length === 0} onClick={() => onConfirm(selected)}>
          {/* tabular-nums: every digit takes the same advance width, so the count changing can't resize the button */}
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Pin selected ({selected.length})</span>
        </CometChatButton>
      </div>
    </div>
  );
}

export default function PinConversationModal({
  open,
  onClose,
  pinned,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  pinned: Set<string>;
  /** Pin the chosen conversations (the caller also closes the modal). */
  onConfirm: (ids: string[]) => void;
}) {
  const atLimit = pinned.size >= PIN_LIMIT;
  return (
    <CometChatModal
      open={open}
      onCancel={onClose}
      title="Select conversations to pin"
      description={
        atLimit
          ? `All ${PIN_LIMIT} pin slots are used. Unpin a conversation to make room for another.`
          : "Choose up to five people or groups. You can reorder them afterward."
      }
      showClose
      hideOk
      hideCancel
      size="3xl"
      className="cc-pin-modal"
      destroyOnHidden
    >
      {/* destroyOnHidden unmounts the picker on close, so search/tab/selection reset every open */}
      <PinPickerSelect pinned={pinned} onCancel={onClose} onConfirm={onConfirm} />
    </CometChatModal>
  );
}
