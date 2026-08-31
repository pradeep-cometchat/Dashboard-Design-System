// Pinned Conversations panel — "❖ Dashboard--May 2026" Figma file
// eoA7wXLLCe1NmlryPuVvn9. Empty state from node 59-90300 (copy adapted to the
// Pin context); pinned rows follow the drag-handle / remove pattern from the
// design. Composed from base components — CometChatEmpty, CometChatButton,
// CometChatAvatar — with foundation tokens and the vendored May 2026 icon set.
import React from "react";
import CometChatEmpty from "components/base/Empty/CometChatEmpty";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import { c, r, s, font } from "../theme";
import { Icon, dim } from "./ui";
import PinConversationModal, { CONVERSATIONS, PIN_LIMIT, type Conversation } from "./PinConversationModal";

const w = {
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** 48px featured icon per the design: border-dark, radius-lg, skeuomorphic ring, 28px glyph. */
function FeaturedIcon() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: c.bgPrimary,
        border: `1px solid ${c.borderDark}`,
        borderRadius: r.lg,
        boxShadow: "var(--shadow-xs-skeuomorphic)",
      }}
    >
      <Icon name="keep" size={28} color={c.textSecondary} />
    </span>
  );
}

/** The empty "no conversations pinned" body. */
function EmptyBody({ onPin }: { onPin: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${s["4xl"]} 0`, minHeight: 360, boxSizing: "border-box" }}>
      <CometChatEmpty
        size="sm"
        iconType="featured-icon"
        icon={<FeaturedIcon />}
        title="No pinned conversations yet"
        description={`Pin up to ${PIN_LIMIT} users or groups to keep them at the top of everyone's list.`}
        showBackgroundPattern={false}
        primaryAction={
          <CometChatButton hierarchy="secondary" iconLeading={<Icon name="add" size={dim.iconMd} />} onClick={onPin}>
            Pin Conversation
          </CometChatButton>
        }
      />
    </div>
  );
}

/** One pinned row: drag handle · avatar · name + type · remove. */
function PinnedRow({
  conv,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  dragging,
}: {
  conv: Conversation;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.lg,
        padding: `${s.md} ${s.xl}`,
        borderBottom: `1px solid ${c.borderLight}`,
        background: dragging ? c.bgSecondary : c.bgPrimary,
        cursor: "grab",
        opacity: dragging ? 0.6 : 1,
      }}
    >
      <Icon name="drag-indicator" size={dim.iconSm} color={c.textQuaternary} />
      {conv.type === "user" ? (
        <CometChatAvatar src={conv.avatar} size={dim.avatar} alt={conv.name} />
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: dim.avatar,
            height: dim.avatar,
            flexShrink: 0,
            borderRadius: r.full,
            background: "var(--bg-brand-secondary)",
            ...font.bodyMd,
            fontWeight: w.semibold as unknown as number,
            color: c.textBrand,
          }}
        >
          {initials(conv.name)}
        </span>
      )}
      <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span style={{ ...font.bodyMd, fontWeight: w.semibold as unknown as number, color: c.textPrimary }}>{conv.name}</span>
        <span style={{ ...font.captionReg, color: c.textTertiary }}>{conv.uid}</span>
      </span>
      <CometChatButton
        variant="close"
        iconOnly
        iconLeading={<Icon name="x-close" size={dim.iconSm} />}
        ariaLabel={`Unpin ${conv.name}`}
        onClick={onRemove}
      />
    </div>
  );
}

/**
 * The Pinned Conversations panel. Header carries the primary Pin Conversation
 * action; pinned items list with drag-to-reorder and remove, empty state otherwise.
 */
export default function PinEmpty({ title = "Pinned Conversations" }: { title?: string }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pinnedIds, setPinnedIds] = React.useState<string[]>([]);
  // Ref carries the live drag position (state commits are async and can lag a
  // fast dragover); state only drives the row's visual dragging style.
  const dragFrom = React.useRef<number | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const pinnedSet = React.useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const pinnedConvs = pinnedIds
    .map((id) => CONVERSATIONS.find((conv) => conv.id === id))
    .filter((conv): conv is Conversation => !!conv);

  const toggle = (id: string) =>
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return prev.length < PIN_LIMIT ? [...prev, id] : prev;
    });

  const reorder = (from: number, to: number) =>
    setPinnedIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <div style={{ background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.lg, padding: `${s.lg} ${s.xl} ${s.lg} ${s["3xl"]}` }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: s.md, flex: 1, minWidth: 0 }}>
          <span style={{ ...font.caption, fontWeight: w.semibold as unknown as number, color: c.textQuaternary }}>{title}</span>
          <span style={{ ...font.captionReg, color: c.textQuaternary }}>·</span>
          <span style={{ ...font.captionReg, color: c.textQuaternary }}>
            {pinnedConvs.length} of {PIN_LIMIT}
          </span>
        </span>
        {pinnedConvs.length > 0 && (
          <CometChatButton hierarchy="secondary" size="sm" iconLeading={<Icon name="add" size={dim.iconSm} />} onClick={() => setPickerOpen(true)}>
            Pin Conversation
          </CometChatButton>
        )}
      </div>

      <div
        style={{
          background: c.bgPrimary,
          border: `1px solid ${c.borderDefault}`,
          borderTopLeftRadius: r.xl,
          borderTopRightRadius: r.xl,
          margin: "0 -1px -1px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {pinnedConvs.length === 0 ? (
          <EmptyBody onPin={() => setPickerOpen(true)} />
        ) : (
          pinnedConvs.map((conv, i) => (
            <PinnedRow
              key={conv.id}
              conv={conv}
              dragging={dragIndex === i}
              onRemove={() => toggle(conv.id)}
              onDragStart={(e) => {
                dragFrom.current = i;
                setDragIndex(i);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                const from = dragFrom.current;
                if (from !== null && from !== i) {
                  reorder(from, i);
                  dragFrom.current = i;
                  setDragIndex(i);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                dragFrom.current = null;
                setDragIndex(null);
              }}
            />
          ))
        )}
      </div>

      <PinConversationModal open={pickerOpen} onClose={() => setPickerOpen(false)} pinned={pinnedSet} onToggle={toggle} />
    </div>
  );
}
