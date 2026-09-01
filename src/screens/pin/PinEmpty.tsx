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
import PinConversationModal, { PinPickerSelect, CONVERSATIONS, PIN_LIMIT, type Conversation } from "./PinConversationModal";

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
};

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

function EmptySlot({ n, onClick }: { n: number; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
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

function PinnedSlot({ n, conv, onRemove, dragging, handlers }: { n: number; conv: Conversation; onRemove: () => void; dragging: boolean; handlers: DragHandlers }) {
  return (
    <div
      draggable
      {...handlers}
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.xl,
        boxSizing: "border-box",
        padding: `${s.lg} ${s["3xl"]}`,
        background: dragging ? c.bgSecondary : c.bgPrimary,
        border: `1px solid ${c.borderDefault}`,
        borderRadius: r.xl,
        cursor: "grab",
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
  // V2: which slot's picker dropdown is open (null = none), and whether it
  // opens above the slot (when the viewport has more room there than below —
  // keeps the last slots from spilling scroll space under the section).
  const [openSlot, setOpenSlot] = React.useState<number | null>(null);
  const [dropUp, setDropUp] = React.useState(false);
  // Approximate rendered dropdown height (list viewport + search/footer chrome);
  // only steers the above/below choice, nothing is sized with it.
  const PICKER_HEIGHT_ESTIMATE = 400;
  const slotsRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (openSlot === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (slotsRef.current && !slotsRef.current.contains(e.target as Node)) setOpenSlot(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlot(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openSlot]);
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
      dragFrom.current = null;
      setDragIndex(null);
    },
  });

  const counter = (
    <>
      <span style={{ ...font.body, color: c.textQuaternary }}>·</span>
      <span style={{ ...font.body, color: c.textQuaternary }}>
        {pinnedConvs.length} of {PIN_LIMIT}
      </span>
    </>
  );

  const modal = <PinConversationModal open={pickerOpen} onClose={() => setPickerOpen(false)} pinned={pinnedSet} onToggle={toggle} />;

  if (labelOutside) {
    // V2: label row + PIN_LIMIT slot cards.
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: s.lg }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: s.md }}>
          <span style={{ ...font.bodyMd, color: c.textPrimary }}>{title}</span>
          {counter}
        </div>
        <div ref={slotsRef} style={{ display: "flex", flexDirection: "column", gap: s.lg }}>
          {Array.from({ length: PIN_LIMIT }, (_, i) => {
            const conv = pinnedConvs[i];
            if (!conv)
              return (
                // Relative anchor so the picker dropdown overlays the slots below instead of pushing them.
                <div key={`empty-${i}`} style={{ position: "relative" }}>
                  <EmptySlot
                    n={i + 1}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - rect.bottom;
                      setDropUp(spaceBelow < PICKER_HEIGHT_ESTIMATE && rect.top > spaceBelow);
                      setOpenSlot((open) => (open === i ? null : i));
                    }}
                  />
                  {openSlot === i && (
                    <div
                      style={{
                        position: "absolute",
                        ...(dropUp ? { bottom: `calc(100% + ${s.md})` } : { top: `calc(100% + ${s.md})` }),
                        left: 0,
                        right: 0,
                        zIndex: 30,
                        background: c.bgPrimary,
                        border: `1px solid ${c.borderDefault}`,
                        borderRadius: r.xl,
                        boxShadow: shadow.lg,
                        boxSizing: "border-box",
                        overflow: "hidden",
                      }}
                    >
                      <PinPickerSelect
                        pinned={pinnedSet}
                        onCancel={() => setOpenSlot(null)}
                        onConfirm={(ids) => {
                          pinMany(ids);
                          setOpenSlot(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            return (
              <PinnedSlot key={conv.id} n={i + 1} conv={conv} dragging={dragIndex === i} onRemove={() => toggle(conv.id)} handlers={dragHandlers(i)} />
            );
          })}
        </div>
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
