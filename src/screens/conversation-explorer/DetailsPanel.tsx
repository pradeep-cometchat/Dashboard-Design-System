import React from "react";
import CometChatEmpty from "components/base/Empty/CometChatEmpty";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatBadge from "components/base/Badge/CometChatBadge";
import CometChatInput from "components/base/Input/CometChatInput";
import { c, s, r, font, SOFT_RING } from "./theme";
import type { Message, Person, ConversationDetail } from "./data";
import { StatusAvatar, MemberCountBadge, RoleBadge } from "./ui";
import { FeaturedIcon, Database01, Copy06, Image01, CalendarCheck02, Clock, Expand01, ArrowUpRight, ChevronUp, ChevronDown, Download01, Flag02, SearchLg, Hash } from "./icons";

const cap: React.CSSProperties = { fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-text-xs)", lineHeight: "var(--line-height-text-xs)", fontWeight: 500 };
const labelStyle: React.CSSProperties = { ...cap, color: c.textQuaternary, whiteSpace: "nowrap", flexShrink: 0 };
const valueStyle: React.CSSProperties = { ...cap, color: c.textPrimary };

/** Right-panel empty state (no message selected). */
export function DetailsEmpty() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: s.xl, background: c.bgPrimary }}>
      <CometChatEmpty
        size="sm"
        iconType="featured-icon"
        showBackgroundPattern={false}
        icon={<FeaturedIcon><Database01 /></FeaturedIcon>}
        description={<span style={{ fontSize: "var(--font-size-text-xs)", lineHeight: "var(--line-height-text-xs)" }}>Select a message from the conversation to view metadata, delivery details, reactions, and moderation insights.</span>}
      />
    </div>
  );
}

/** Collapsible "overview card": subtle outer, header + chevron, white inner box (Figma pattern). */
function Card({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ padding: s.md }}>
      <div style={{ background: "var(--neutral-lm-25)", border: `1px solid ${c.borderDefault}`, borderRadius: r.xl, overflow: "hidden" }}>
        <button onClick={() => setOpen((o) => !o)} style={{ all: "unset", cursor: "pointer", boxSizing: "border-box", width: "100%", height: 48, display: "flex", alignItems: "center", gap: s.xl, padding: `${s.lg} ${s.md} ${s.lg} ${s.lg}` }}>
          <span style={{ flex: 1, ...font.bodyMd, color: c.textPrimary }}>{title}</span>
          <span style={{ color: c.textTertiary, display: "inline-flex" }}>{open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        </button>
        {open && <div style={{ background: c.bgPrimary, border: `1px solid ${c.borderDefault}`, borderRadius: r.xl }}>{children}</div>}
      </div>
    </div>
  );
}

/** A field row: label left, value(s) right-aligned. */
function Row({ label, children, between }: { label: string; children: React.ReactNode; between?: boolean }) {
  return (
    <div style={{ display: "flex", gap: s.lg, alignItems: "center", justifyContent: between ? "space-between" : "flex-start", padding: s.lg, boxSizing: "border-box", width: "100%" }}>
      <span style={labelStyle}>{label}</span>
      {between ? children : <span style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: s.xs, ...valueStyle, textAlign: "right" }}>{children}</span>}
    </div>
  );
}

function DateTimeBadges({ date, time }: { date: string; time: string }) {
  return (
    <>
      <CometChatBadge size="sm" type="badge" color="gray" iconLeading={<CalendarCheck02 />}>{date}</CometChatBadge>
      <CometChatBadge size="sm" type="badge" color="gray" iconLeading={<Clock />}>{time}</CometChatBadge>
    </>
  );
}

function Avatar16({ src }: { src?: string }) {
  return <img src={src} alt="" style={{ width: 16, height: 16, borderRadius: r.full, objectFit: "cover", boxShadow: "inset 0 0 0 0.33px rgba(0,0,0,0.08)" }} />;
}

function MemberRow({ p, size = 48, meta, trailing }: { p: Person; size?: number; meta?: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.lg, padding: s.lg, boxSizing: "border-box", width: "100%" }}>
      <StatusAvatar person={p} size={size} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: s.xxs }}>
        <span style={{ ...font.bodyMd, color: c.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
        <span style={{ ...font.captionReg, color: c.textQuaternary, display: "flex", alignItems: "center", gap: s.xs }}>{meta ?? p.uid}</span>
      </div>
      {trailing != null && <span style={{ flexShrink: 0, fontSize: 20, lineHeight: 1 }}>{trailing}</span>}
    </div>
  );
}

/** Underlined tab strip shared by Read Receipts + Reactions. */
function Tabs({ items, active, onChange }: { items: { id: string; label: React.ReactNode }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${c.borderDefault}`, paddingTop: s.md }}>
      {items.map((it) => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{ all: "unset", cursor: "pointer", flex: 1, textAlign: "center", height: 40, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: s.xs, ...font.bodyMd, color: on ? c.brand : c.textQuaternary, borderBottom: on ? `2px solid ${c.brand}` : "2px solid transparent" }}>{it.label}</button>
        );
      })}
    </div>
  );
}

/** Tabbed reactor list (All / per-emoji) with the reactor + their emoji. */
function ReactionsList({ reactors }: { reactors: { person: Person; emoji: string }[] }) {
  const byEmoji = reactors.reduce<Record<string, number>>((acc, r) => { acc[r.emoji] = (acc[r.emoji] ?? 0) + 1; return acc; }, {});
  const [tab, setTab] = React.useState("all");
  const items = [{ id: "all", label: `All ${reactors.length}` }, ...Object.entries(byEmoji).map(([emoji, n]) => ({ id: emoji, label: <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs }}><span style={{ fontSize: 16 }}>{emoji}</span>{n}</span> }))];
  const filtered = tab === "all" ? reactors : reactors.filter((r) => r.emoji === tab);
  return (
    <>
      <Tabs items={items} active={tab} onChange={setTab} />
      {filtered.map((r, i) => <MemberRow key={i} p={r.person} size={40} trailing={r.emoji} />)}
    </>
  );
}

function MediaThumb({ src, kind, onClick }: { src: string; kind: "image" | "video"; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ all: "unset", cursor: "pointer", position: "relative", flex: 1, minWidth: 0, height: 132, borderRadius: r.md, overflow: "hidden", background: c.white }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      {kind === "video" && (
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 48, height: 48, borderRadius: r.full, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill={c.white} aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
      )}
      <span style={{ position: "absolute", right: s.md, bottom: s.md, color: c.white }}><Expand01 size={20} /></span>
    </button>
  );
}

/** Tabbed Read Receipts. */
function ReadReceipts({ reader }: { reader: Person }) {
  const [tab, setTab] = React.useState("read");
  return (
    <>
      <Tabs items={[{ id: "read", label: "Read By" }, { id: "delivered", label: "Delivered to" }]} active={tab} onChange={setTab} />
      <MemberRow p={reader} size={40} meta={<>Read<span style={{ width: 2, height: 2, borderRadius: r.full, background: c.textQuaternary }} />19:24</>} />
    </>
  );
}

/** Members overview card — shared by Message Details and Conversation Details. */
function MembersCard({ members }: { members: Person[] }) {
  return (
    <Card title="Members">
      {members.length > 2 && (
        <div style={{ padding: `${s.lg} ${s.lg} 0`, boxSizing: "border-box", width: "100%" }}>
          <CometChatInput placeholder="Search members" prefix={<SearchLg size={20} style={{ color: c.textQuaternary }} />} />
        </div>
      )}
      {members.map((m) => <MemberRow key={m.uid} p={m} trailing={m.role ? <RoleBadge role={m.role} /> : undefined} />)}
    </Card>
  );
}

/** Right panel when a conversation (but no message) is selected — conversation-level metadata + member roster. */
export function ConversationDetails({ conversation, members, exportVariant = "single" }: {
  conversation: ConversationDetail; members: Person[]; exportVariant?: "single" | "csv-json";
}) {
  const isGroup = conversation.conversationType === "group";
  const [cDate, cTime = ""] = conversation.createdAt.split(", ");
  const [uDate, uTime = ""] = conversation.updatedAt.split(", ");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.bgPrimary }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.md, height: 58, padding: `0 ${s.xl}`, borderBottom: `1px solid ${c.borderDefault}`, flexShrink: 0 }}>
        <span style={font.h4}>Conversation Details</span>
        {exportVariant === "single"
          ? <CometChatButton hierarchy="secondary" size="sm" iconLeading={<Download01 size={20} />} style={{ boxShadow: SOFT_RING, borderColor: "var(--border-default)" }}>Export</CometChatButton>
          : <div style={{ display: "flex", gap: s.sm }}>
              <CometChatButton hierarchy="secondary" size="sm" iconLeading={<Download01 size={20} />} style={{ boxShadow: SOFT_RING, borderColor: "var(--border-default)" }}>CSV</CometChatButton>
              <CometChatButton hierarchy="dark" size="sm" iconLeading={<Download01 size={20} />}>JSON</CometChatButton>
            </div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: c.bgPrimary }}>
        <Card title="Conversation">
          <Row label="ID">{conversation.conversationId}<Copy06 size={14} style={{ color: c.textQuaternary }} /></Row>
          <Row label="Conversation Type"><CometChatBadge size="sm" type="badge" color="brand">{conversation.conversationType}</CometChatBadge></Row>
          {isGroup && <>
            <Row label="Group Name">{conversation.groupName}</Row>
            <Row label="Group Type">{conversation.groupType?.toLowerCase()}</Row>
            <Row label="Owner">{conversation.owner}</Row>
          </>}
          <Row label="Members"><MemberCountBadge count={conversation.members} /></Row>
          <Row label="Messages">{conversation.messages}</Row>
          <Row label="Unread Count">{conversation.unreadCount}</Row>
          <Row label="Created At"><DateTimeBadges date={cDate} time={cTime} /></Row>
          <Row label="Updated At"><DateTimeBadges date={uDate} time={uTime} /></Row>
          <Row label="Tags">
            <span style={{ display: "flex", gap: s.sm, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {conversation.tags.map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: s.xs, padding: `2px ${s.md} 2px ${s.sm}`, borderRadius: r.sm, background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, ...font.caption, color: c.textSecondary }}>
                  <Hash size={12} style={{ color: c.textQuaternary }} />{t}
                </span>
              ))}
            </span>
          </Row>
        </Card>

        <MembersCard members={members} />
      </div>
    </div>
  );
}

export function MessageDetails({ message, members, exportVariant = "single", onOpenMedia, receiverType = "User" }: {
  message: Message; members: Person[]; exportVariant?: "single" | "csv-json"; onOpenMedia?: (m: Message) => void; receiverType?: string;
}) {
  const d = message.detail;
  const mod = message.moderation;
  const reportedBy = members.find((m) => m.role === "Moderator") ?? members[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.bgPrimary }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.md, height: 58, padding: `0 ${s.xl}`, borderBottom: `1px solid ${c.borderDefault}`, flexShrink: 0 }}>
        <span style={font.h4}>Message Details</span>
        {exportVariant === "single"
          ? <CometChatButton hierarchy="secondary" size="sm" iconLeading={<Download01 size={20} />} style={{ boxShadow: SOFT_RING, borderColor: "var(--border-default)" }}>Export</CometChatButton>
          : <div style={{ display: "flex", gap: s.sm }}>
              <CometChatButton hierarchy="secondary" size="sm" iconLeading={<Download01 size={20} />} style={{ boxShadow: SOFT_RING, borderColor: "var(--border-default)" }}>CSV</CometChatButton>
              <CometChatButton hierarchy="dark" size="sm" iconLeading={<Download01 size={20} />}>JSON</CometChatButton>
            </div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: c.bgPrimary }}>
        {/* Message */}
        <Card title="Message">
          {d && <>
            <Row label="ID">{d.messageId}<Copy06 size={14} style={{ color: c.textQuaternary }} /></Row>
            <Row label="Category">{d.category}</Row>
            <Row label="Type">{d.receiverType ?? receiverType}</Row>
            <Row label="Members"><MemberCountBadge count={members.length} /></Row>
            <Row label="Message Type"><CometChatBadge size="sm" type="badge" color="brand" iconLeading={<Image01 />}>{d.type}</CometChatBadge></Row>
            <Row label="Delivery"><CometChatBadge size="sm" type="badge" color="success">{d.delivery}</CometChatBadge></Row>
            <Row label="Sender"><CometChatBadge size="sm" type="badge" color="brand" avatar={<Avatar16 src={message.sender.avatar} />}>{message.sender.name}</CometChatBadge></Row>
            <Row label="Last Active"><CometChatBadge size="sm" type="badge" color="gray">{message.sender.lastSeen ?? "—"}</CometChatBadge></Row>
            <Row label="Sent At"><DateTimeBadges date={d.sentAt.date} time={d.sentAt.time} /></Row>
            <Row label="Updated At"><DateTimeBadges date={d.updatedAt.date} time={d.updatedAt.time} /></Row>
          </>}
        </Card>

        {/* Members */}
        <MembersCard members={members} />

        {/* Media Preview */}
        {message.media?.length ? (
          <Card title="Media Preview">
            <div style={{ display: "flex", gap: s.md, padding: s.lg, boxSizing: "border-box", width: "100%" }}>
              {message.media.map((m, i) => <MediaThumb key={i} src={m.src} kind={m.kind} onClick={() => onOpenMedia?.(message)} />)}
            </div>
          </Card>
        ) : null}

        {/* Reactions */}
        <Card title="Reactions">
          {message.reactors?.length
            ? <ReactionsList reactors={message.reactors} />
            : <div style={{ padding: s.lg, boxSizing: "border-box", width: "100%", ...font.bodyMd, color: c.textSecondary, textAlign: "center" }}>No Reactions Yet</div>}
        </Card>

        {/* Read Receipts */}
        <Card title="Read Receipts">
          <ReadReceipts reader={members.find((m) => m.online) ?? members[0]} />
        </Card>

        {/* Moderation */}
        <Card title="Moderation" defaultOpen={!!mod}>
          {mod ? <>
            <Row label="Violation Type">{mod.violationType}</Row>
            <Row label="Reason" between>
              <span style={{ display: "inline-flex", alignItems: "center", gap: s.xxs, padding: `${s.xxs} ${s.md} ${s.xxs} ${s.sm}`, borderRadius: r.sm, background: c.flaggedBadgeBg, border: `1px solid var(--amber-200)`, color: c.flaggedBadgeText, ...cap }}>
                <Flag02 size={12} />{mod.reasonLabel ?? mod.violationType}
              </span>
            </Row>
            <Row label="Reported By" between>
              <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, ...valueStyle }}>
                <img src={reportedBy?.avatar} alt="" style={{ width: 24, height: 24, borderRadius: r.full, objectFit: "cover", boxShadow: `0 0 0 1px ${c.white}` }} />
                {reportedBy?.name}
              </span>
            </Row>
            <button style={{ all: "unset", cursor: "pointer", boxSizing: "border-box", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: s.sm, padding: s.md, borderTop: `1px solid ${c.borderDefault}`, ...font.bodyMd, color: c.brand }}>
              View Moderation Logs <ArrowUpRight size={20} />
            </button>
          </> : (
            <Row label="Status"><CometChatBadge size="sm" type="badge" color="success">Approved</CometChatBadge></Row>
          )}
        </Card>
      </div>
    </div>
  );
}
