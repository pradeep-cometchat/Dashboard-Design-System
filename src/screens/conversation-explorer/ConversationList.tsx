import React from "react";
import CometChatInput from "components/base/Input/CometChatInput";
import CometChatButton from "components/base/Button/CometChatButton";
import { c, s, r, font, SOFT_RING } from "./theme";
import type { Conversation } from "./data";
import { GroupAvatar, StatusAvatar, DualAvatar, GroupTypeBadge, MemberCountBadge } from "./ui";
import { SearchLg, FilterLines } from "./icons";
import { FilterBar } from "./FilterBar";

function UnreadPill({ n }: { n: number }) {
  // Solid brand pill (design uses filled purple #6852d6, text #fafafa) — colors are tokens.
  return (
    <span style={{ minWidth: 20, width: 24, height: 20, padding: `3px 4px`, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: r.full, background: c.brand }}>
      <span style={{ ...font.captionReg, color: "var(--neutral-lm-50)" }}>{n}</span>
    </span>
  );
}

function ConversationRow({ conv, selected, onClick }: { conv: Conversation; selected?: boolean; onClick?: () => void }) {
  const hasTagsRow = !!(conv.groupType || conv.memberCount);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", gap: s.lg, width: "100%", textAlign: "left", cursor: "pointer",
        padding: `${s.lg} ${s.xl}`,
        border: "none",
        outline: "none", WebkitAppearance: "none", appearance: "none",
        background: selected ? c.bgActive : "transparent", alignItems: hasTagsRow ? "flex-start" : "center",
      }}
    >
      {conv.kind === "group"
        ? <GroupAvatar src={conv.avatar} initials={conv.initials} type={conv.groupType} size={48} />
        : conv.avatarB
        ? <DualAvatar a={conv.avatar} b={conv.avatarB} size={48} />
        : <StatusAvatar person={{ uid: conv.id, name: conv.title, initials: conv.initials, avatar: conv.avatar, online: conv.online }} size={48} showStatus={false} />}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: s.xxs }}>
        {/* row 1: title + time */}
        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: s.md }}>
          <span style={{ ...font.bodyMd, color: c.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.title}</span>
          <span style={{ ...font.captionReg, color: c.textSecondary, flexShrink: 0 }}>{conv.time}</span>
        </span>
        {/* row 2: sender + preview + unread */}
        <span style={{ display: "flex", justifyContent: "space-between", gap: s.md, alignItems: "center" }}>
          <span style={{ minWidth: 0, display: "flex", gap: s.xs, alignItems: "center", overflow: "hidden" }}>
            <span style={{ ...font.caption, color: c.textSecondary, flexShrink: 0 }}>{conv.lastSenderName}</span>
            <span style={{ ...font.captionReg, color: c.textQuaternary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.lastPreview}</span>
          </span>
          {conv.unread ? <UnreadPill n={conv.unread} /> : null}
        </span>
        {/* row 3: group type + member count */}
        {(conv.groupType || conv.memberCount) && (
          <span style={{ display: "flex", gap: s.md, alignItems: "center", paddingTop: s.xxs, flexWrap: "wrap" }}>
            {conv.groupType && <GroupTypeBadge type={conv.groupType} />}
            {conv.memberCount ? <MemberCountBadge count={conv.memberCount} /> : null}
          </span>
        )}
      </span>
    </button>
  );
}

export function ConversationList({ conversations, selectedId, onSelect, searchPlaceholder = "Search by user...", initialFilterOpen }: {
  conversations: Conversation[]; selectedId?: string; onSelect?: (id: string) => void; searchPlaceholder?: string; initialFilterOpen?: boolean;
}) {
  const [filterOpen, setFilterOpen] = React.useState(!!initialFilterOpen);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.bgPrimary }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.md, height: 58, padding: `0 ${s.xl}`, borderBottom: `1px solid ${c.borderDefault}` }}>
        <span style={font.h4}>Conversations</span>
        <span style={{ ...font.caption, color: c.textQuaternary }}>{String(conversations.length).padStart(2, "0")}</span>
      </div>
      <div style={{ display: "flex", gap: s.lg, padding: `${s.xl} ${s.xl} ${s.lg}` }}>
        <div style={{ flex: 1 }}>
          <CometChatInput
            placeholder={searchPlaceholder}
            prefix={<SearchLg size={20} style={{ color: c.textQuaternary }} />}
            suffix={<kbd style={{ ...font.captionReg, color: c.textQuaternary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xs, padding: `0 ${s.xs}` }}>⌘K</kbd>}
          />
        </div>
        <CometChatButton hierarchy="secondary" iconOnly ariaLabel="Filter conversations" iconLeading={<FilterLines size={20} style={filterOpen ? { color: "var(--text-secondary-hover)" } : undefined} />} onClick={() => setFilterOpen((o) => !o)}
          style={{ boxShadow: SOFT_RING, borderColor: filterOpen ? "var(--border-dark)" : "var(--border-default)", background: filterOpen ? c.bgSecondary : undefined }} />
      </div>
      {filterOpen && <FilterBar initialOpenKey={initialFilterOpen ? "type" : undefined} />}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {conversations.map((conv) => (
          <ConversationRow key={conv.id} conv={conv} selected={conv.id === selectedId} onClick={() => onSelect?.(conv.id)} />
        ))}
      </div>
    </div>
  );
}
