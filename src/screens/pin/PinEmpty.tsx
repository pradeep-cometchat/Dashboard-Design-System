// Pinned Conversations panel — "❖ Dashboard--May 2026" Figma file
// eoA7wXLLCe1NmlryPuVvn9. Two variants share the state, picker and dirty
// tracking:
//   • Default: gray wrapper with header band; body is the node 59-90300 empty
//     state or the pinned-row list.
//   • V2 (labelOutside): form-style label above PIN_LIMIT slot cards — pinned
//     rows first, dashed "Select a person or group" placeholders for the rest.
// Base components + foundation tokens + vendored May 2026 icons throughout.
import React from "react";
import CometChatEmpty from "components/base/Empty/CometChatEmpty";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import { c, r, s, font, shadow } from "../theme";
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

function GroupAvatar({ name }: { name: string }) {
  return (
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
      {initials(name)}
    </span>
  );
}

function RemoveButton({ name, onRemove }: { name: string; onRemove: () => void }) {
  // Glyph at 24 to match the + in V2 slots; negative margin re-centres the
  // 40px hit-target so both glyphs sit on the same axis.
  return (
    <CometChatButton
      variant="close"
      iconOnly
      iconLeading={<Icon name="close" size={dim.iconMd} />}
      ariaLabel={`Unpin ${name}`}
      onClick={onRemove}
      style={{ margin: `calc(${s.md} * -1)` }}
    />
  );
}

type DragHandlers = {
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
};

// 1×1 transparent GIF for setDragImage. The native drag snapshot is rendered
// by the OS with forced translucency and an opaque white backing behind the
// rounded corners; V2 suppresses it and floats its own opaque card instead.
const EMPTY_DRAG_IMAGE = typeof Image !== "undefined" ? new Image() : null;
if (EMPTY_DRAG_IMAGE) EMPTY_DRAG_IMAGE.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/* ---------------- Default variant pieces ---------------- */

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

/** The empty "no conversations pinned" body (node 59-90300, copy adapted). */
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

/** Default variant row: drag handle · avatar · name + uid · remove. */
function PinnedRow({ conv, onRemove, dragging, handlers }: { conv: Conversation; onRemove: () => void; dragging: boolean; handlers: DragHandlers }) {
  return (
    <div
      draggable
      {...handlers}
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.lg,
        padding: `${s.md} ${s.xl}`,
        borderBottom: `1px solid ${c.borderLight}`,
        background: dragging ? c.bgSecondary : c.bgPrimary,
        cursor: "grab",
      }}
    >
      <Icon name="drag-indicator" size={dim.iconSm} color={c.textQuaternary} />
      {conv.type === "user" ? <CometChatAvatar src={conv.avatar} size={dim.avatar} alt={conv.name} /> : <GroupAvatar name={conv.name} />}
      <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span style={{ ...font.bodyMd, color: c.textPrimary }}>{conv.name}</span>
        <span style={{ ...font.body, color: c.textQuaternary }}>{conv.uid}</span>
      </span>
      <RemoveButton name={conv.name} onRemove={onRemove} />
    </div>
  );
}

/* ---------------- V2 variant pieces (slot model) ---------------- */

function SlotNumber({ n }: { n: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim.iconMd,
        height: dim.iconMd,
        flexShrink: 0,
        borderRadius: r.full,
        background: c.bgTertiary,
        ...font.bodyMd,
        color: c.textTertiary,
      }}
    >
      {n}
    </span>
  );
}

function EmptySlot({ n, onClick }: { n: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.xl,
        width: "100%",
        boxSizing: "border-box",
        padding: `${s.lg} ${s["3xl"]}`,
        background: c.bgPrimary,
        border: `1px dashed ${c.borderDark}`,
        borderRadius: r.xl,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-family-base)",
      }}
    >
      <SlotNumber n={n} />
      {/* min-height pegs the empty slot to the pinned slot's 40px avatar row so the card height doesn't change as slots fill. */}
      <span style={{ ...font.body, flex: 1, minWidth: 0, display: "flex", alignItems: "center", minHeight: dim.avatar }}>Select a person or group</span>
      <Icon name="add" size={dim.iconMd} color="var(--fg-brand-primary)" />
    </button>
  );
}

/** The slot card visuals — shared by the in-list row and the floating drag preview. */
function SlotCard({ n, conv, onRemove }: { n: number; conv: Conversation; onRemove: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.xl,
        boxSizing: "border-box",
        padding: `${s.lg} ${s["3xl"]}`,
        background: c.bgPrimary,
        border: `1px solid ${c.borderDefault}`,
        borderRadius: r.xl,
      }}
    >
      <SlotNumber n={n} />
      <Icon name="drag-indicator" size={dim.iconSm} color={c.textQuaternary} />
      {conv.type === "user" ? <CometChatAvatar src={conv.avatar} size={dim.avatar} alt={conv.name} /> : <GroupAvatar name={conv.name} />}
      <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span style={{ ...font.bodyMd, color: c.textPrimary }}>{conv.name}</span>
        <span style={{ ...font.body, color: c.textQuaternary }}>{conv.uid}</span>
      </span>
      <RemoveButton name={conv.name} onRemove={onRemove} />
    </div>
  );
}

function PinnedSlot({ n, conv, onRemove, dragging, handlers }: { n: number; conv: Conversation; onRemove: () => void; dragging: boolean; handlers: DragHandlers }) {
  return (
    <div draggable {...handlers} style={{ cursor: "grab", background: "transparent" }}>
      {dragging ? (
        // While the floating preview carries the card, the source slot reads as
        // an empty drop target: dashed outline, same height and layout as an
        // empty slot, with a hint instead of blank space.
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: s.xl,
            boxSizing: "border-box",
            padding: `${s.lg} ${s["3xl"]}`,
            border: `1px dashed ${c.borderDark}`,
            borderRadius: r.xl,
            background: c.bgSecondary,
          }}
        >
          <SlotNumber n={n} />
          <span style={{ ...font.body, color: c.textQuaternary, display: "flex", alignItems: "center", minHeight: dim.avatar }}>
            Drop here to place at position {n}
          </span>
        </div>
      ) : (
        <SlotCard n={n} conv={conv} onRemove={onRemove} />
      )}
    </div>
  );
}

/* ---------------- the panel ---------------- */

export default function PinEmpty({
  title = "Pinned Conversations",
  labelOutside = false,
  onDirtyChange,
  saveTick = 0,
}: {
  title?: string;
  /** V2: form-style label above the slot cards instead of the header band + empty state. */
  labelOutside?: boolean;
  /** Reports whether the list differs from the last saved state (add, remove, or reorder). */
  onDirtyChange?: (dirty: boolean) => void;
  /** Increment to mark the current list as saved (resets dirtiness). */
  saveTick?: number;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pinnedIds, setPinnedIds] = React.useState<string[]>([]);
  const baseline = React.useRef("[]");
  React.useEffect(() => {
    baseline.current = JSON.stringify(pinnedIds);
    onDirtyChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveTick]);
  React.useEffect(() => {
    onDirtyChange?.(JSON.stringify(pinnedIds) !== baseline.current);
  }, [pinnedIds, onDirtyChange]);

  const dragFrom = React.useRef<number | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  // V2 floating drag preview: an opaque copy of the card that follows the
  // cursor (position driven directly on the DOM node — no re-render per move).
  const previewRef = React.useRef<HTMLDivElement>(null);
  const dragMeta = React.useRef<{ w: number; x: number; y: number; ox: number; oy: number } | null>(null);
  const movePreview = React.useCallback((ev: DragEvent) => {
    const el = previewRef.current;
    const meta = dragMeta.current;
    if (!el || !meta || (ev.clientX === 0 && ev.clientY === 0)) return;
    el.style.transform = `translate(${ev.clientX - meta.ox}px, ${ev.clientY - meta.oy}px)`;
  }, []);
  const endPreview = React.useCallback(() => {
    document.removeEventListener("dragover", movePreview);
    dragMeta.current = null;
    dragFrom.current = null;
    setDragIndex(null);
  }, [movePreview]);
  React.useEffect(() => () => document.removeEventListener("dragover", movePreview), [movePreview]);

  const pinnedSet = React.useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const pinnedConvs = pinnedIds
    .map((id) => CONVERSATIONS.find((conv) => conv.id === id))
    .filter((conv): conv is Conversation => !!conv);

  const toggle = (id: string) =>
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return prev.length < PIN_LIMIT ? [...prev, id] : prev;
    });

  const pinMany = (ids: string[]) =>
    setPinnedIds((prev) => [...prev, ...ids.filter((id) => !prev.includes(id))].slice(0, PIN_LIMIT));

  const reorder = (from: number, to: number) =>
    setPinnedIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const dragHandlers = (i: number): DragHandlers => ({
    onDragStart: (e) => {
      dragFrom.current = i;
      setDragIndex(i);
      e.dataTransfer.effectAllowed = "move";
      if (labelOutside && EMPTY_DRAG_IMAGE) {
        // Replace the OS ghost (translucent, white-backed corners) with our
        // own opaque floating card, anchored where the row was grabbed.
        e.dataTransfer.setDragImage(EMPTY_DRAG_IMAGE, 0, 0);
        const rect = e.currentTarget.getBoundingClientRect();
        dragMeta.current = { w: rect.width, x: rect.left, y: rect.top, ox: e.clientX - rect.left, oy: e.clientY - rect.top };
        document.addEventListener("dragover", movePreview);
      }
    },
    onDragOver: (e) => {
      e.preventDefault();
      const from = dragFrom.current;
      if (from !== null && from !== i) {
        reorder(from, i);
        dragFrom.current = i;
        setDragIndex(i);
      }
    },
    onDrop: (e) => {
      e.preventDefault();
      endPreview();
    },
    // Fires on the source even when dropped outside the list — always clean up.
    onDragEnd: () => endPreview(),
  });

  const counter = (
    <>
      <span style={{ ...font.body, color: c.textQuaternary }}>·</span>
      <span style={{ ...font.body, color: c.textQuaternary }}>
        {pinnedConvs.length} of {PIN_LIMIT}
      </span>
    </>
  );

  const modal = (
    <PinConversationModal
      open={pickerOpen}
      onClose={() => setPickerOpen(false)}
      pinned={pinnedSet}
      onConfirm={(ids) => {
        pinMany(ids);
        setPickerOpen(false);
      }}
    />
  );

  if (labelOutside) {
    // V2: label row + PIN_LIMIT slot cards; empty slots open the picker pop-up.
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: s.lg }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: s.md }}>
          <span style={{ ...font.bodyMd, color: c.textPrimary }}>{title}</span>
          {counter}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: s.lg }}>
          {Array.from({ length: PIN_LIMIT }, (_, i) => {
            const conv = pinnedConvs[i];
            if (!conv) return <EmptySlot key={`empty-${i}`} n={i + 1} onClick={() => setPickerOpen(true)} />;
            return (
              <PinnedSlot key={conv.id} n={i + 1} conv={conv} dragging={dragIndex === i} onRemove={() => toggle(conv.id)} handlers={dragHandlers(i)} />
            );
          })}
        </div>
        {dragIndex !== null && pinnedConvs[dragIndex] && dragMeta.current && (
          <div
            ref={previewRef}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: dragMeta.current.w,
              transform: `translate(${dragMeta.current.x}px, ${dragMeta.current.y}px)`,
              zIndex: 50,
              pointerEvents: "none",
              boxShadow: shadow.lg,
              borderRadius: r.xl,
            }}
          >
            <SlotCard n={dragIndex + 1} conv={pinnedConvs[dragIndex]} onRemove={() => {}} />
          </div>
        )}
        {modal}
      </div>
    );
  }

  // Default: gray wrapper, header band, empty state or row list in the merged-border card.
  return (
    <div style={{ background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.lg, padding: `${s.lg} ${s.xl} ${s.lg} ${s["3xl"]}` }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: s.md, flex: 1, minWidth: 0 }}>
          <span style={{ ...font.caption, fontWeight: w.semibold as unknown as number, color: c.textQuaternary }}>{title}</span>
          {counter}
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
            <PinnedRow key={conv.id} conv={conv} dragging={dragIndex === i} onRemove={() => toggle(conv.id)} handlers={dragHandlers(i)} />
          ))
        )}
      </div>

      {modal}
    </div>
  );
}
