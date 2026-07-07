import React from "react";
import CometChatButton from "components/base/Button/CometChatButton";
import { c, s, r, font, shadow } from "./theme";
import type { Message, GroupType, Poll } from "./data";
import { StatusAvatar, RoleBadge, GroupTypeBadge, DualAvatar } from "./ui";
import { SearchLg, Flag02, CheckIcon } from "./icons";

const cap2: React.CSSProperties = { fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-text-xs)", lineHeight: "16px", fontWeight: 400 };

function DateDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: `${s.xxs} 0` }}>
      <span style={{ ...font.caption, color: c.textPrimary, background: c.bgSecondary, border: `1px solid ${c.borderDark}`, borderRadius: r.xs, boxShadow: shadow.xs, padding: `${s.xs} ${s.md}` }}>{label}</span>
    </div>
  );
}

/** Glassy blurred play button (backdrop-blur + translucent white) with a solid white triangle. */
function VideoPlay() {
  return (
    <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ width: 48, height: 48, borderRadius: r.full, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
        <svg viewBox="0 0 24 24" width={22} height={22} fill={c.white} aria-hidden><path d="M8 5v14l11-7z" /></svg>
      </span>
    </span>
  );
}

/** Timestamp footer row inside a bubble. Handles plain time, edited, and moderation violation. */
function Footer({ msg }: { msg: Message }) {
  const mod = msg.moderation;
  const time = <span style={{ ...cap2, color: c.textTertiary }}>{msg.time}</span>;
  if (mod && (mod.status === "flagged" || mod.status === "blocked")) {
    const isFlagged = mod.status === "flagged";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.xs, padding: s.xs, width: "100%", boxSizing: "border-box" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, minWidth: 0, color: isFlagged ? c.flaggedBadgeText : c.blockedBadgeText }}>
          <Flag02 size={12} />
          <span style={{ ...cap2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.reasonLabel ?? mod.violationType}</span>
        </span>
        <span style={{ flexShrink: 0 }}>{time}</span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: s.xs, padding: `${s.xs} 0`, width: "100%", boxSizing: "border-box" }}>
      {msg.edited && <><span style={{ ...cap2, color: c.textTertiary }}>Edited</span><span style={{ width: 2, height: 2, borderRadius: r.full, background: c.textQuaternary }} /></>}
      {time}
    </div>
  );
}

function Reactions({ msg }: { msg: Message }) {
  if (!msg.reactions?.length) return null;
  const flagged = msg.moderation?.status === "flagged";
  return (
    <div style={{ display: "flex", gap: s.xxs, flexWrap: "wrap", padding: `0 ${s.xs}`, marginTop: -4 }}>
      {msg.reactions.map((rx, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: s.xs, height: 24, padding: `${s.xxs} ${s.md}`, borderRadius: r.full,
          background: flagged ? c.flaggedBg : c.bgPrimary, border: `1px solid ${flagged ? c.flaggedBorder : c.borderLight}` }}>
          <span style={{ ...font.body, color: c.textPrimary }}>{rx.emoji}</span>
          <span style={{ ...font.caption, color: c.textPrimary }}>{rx.count}</span>
        </span>
      ))}
    </div>
  );
}

function PollBubble({ poll, msg }: { poll: Poll; msg: Message }) {
  return (
    <div style={{ width: 240, background: "var(--neutral-lm-200)", borderRadius: r.xl, padding: `${s.xs} ${s.xs} 0`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: s.xl, padding: s.md }}>
        <div style={{ ...font.bodyMd }}>{poll.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: s["2xl"] }}>
          {poll.options.map((o, i) => (
            <div key={i} style={{ display: "flex", gap: s.md, alignItems: "flex-start" }}>
              <span style={{ width: 20, height: 20, flexShrink: 0, borderRadius: r.full, display: "inline-flex", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${o.checked ? c.brand : "var(--neutral-lm-800)"}`, background: o.checked ? c.brand : "transparent", color: c.white }}>
                {o.checked && <CheckIcon size={12} />}
              </span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: s.xs }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: s.xs }}>
                  <span style={{ ...font.body, color: c.textPrimary, flex: 1 }}>{o.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: s.xs }}>
                    <span style={{ display: "inline-flex" }}>
                      {o.voters.map((v, j) => (
                        <img key={j} src={v} alt="" style={{ width: 20, height: 20, borderRadius: r.full, objectFit: "cover", marginRight: j === o.voters.length - 1 ? 0 : -8, boxShadow: `0 0 0 1.5px ${c.white}` }} />
                      ))}
                    </span>
                    <span style={{ ...font.body, color: c.textPrimary }}>{o.extra ? `+${o.extra}` : o.voters.length}</span>
                  </span>
                </div>
                <div style={{ position: "relative", height: 4, borderRadius: 16, background: "var(--neutral-lm-300)", width: "100%" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: 4, borderRadius: 16, background: c.brand, width: `${o.percent}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: s.xs, padding: s.xs }}>
        <span style={{ ...cap2, color: c.textTertiary }}>{poll.totalVotes} Votes</span>
        <span style={{ width: 2, height: 2, borderRadius: r.full, background: c.textQuaternary }} />
        <span style={{ ...cap2, color: c.textTertiary }}>{msg.time}</span>
      </div>
    </div>
  );
}

function MediaBubble({ msg, onOpenMedia }: { msg: Message; onOpenMedia?: (m: Message) => void }) {
  const flagged = msg.moderation?.status === "flagged";
  const media = msg.media ?? [];
  const multi = media.length > 1;
  return (
    <div style={{ width: 240, boxSizing: "border-box", background: flagged ? c.flaggedBadgeBg : "var(--neutral-lm-200)", border: flagged ? `1px solid ${c.flaggedBorder}` : "none", borderRadius: r.xl, padding: s.xs, display: "flex", flexDirection: "column", gap: s.xs }}>
      <div style={{ display: "flex", gap: 2, width: "100%", height: multi ? 232 : 132, borderRadius: r.md, overflow: "hidden" }}>
        {media.map((m, i) => (
          <button key={i} onClick={() => onOpenMedia?.(msg)} style={{ all: "unset", cursor: "pointer", position: "relative", flex: 1, height: "100%", minWidth: 0, overflow: "hidden", background: c.white }}>
            <img src={m.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {flagged && <span style={{ position: "absolute", inset: 0, background: "rgba(10,13,18,0.2)" }} />}
            {m.kind === "video" && <VideoPlay />}
          </button>
        ))}
      </div>
      <Footer msg={msg} />
    </div>
  );
}

function Bubble({ msg, selected, onSelect, onOpenMedia }: { msg: Message; selected?: boolean; onSelect?: () => void; onOpenMedia?: (m: Message) => void }) {
  const blocked = msg.moderation?.status === "blocked";
  const nameColor = msg.sender.online ? "var(--info-700)" : "var(--neutral-lm-700)";
  const isMedia = (msg.type === "image" || msg.type === "video") && msg.media?.length;
  const isPoll = msg.type === "poll" && msg.poll;

  let body: React.ReactNode;
  if (isPoll) {
    body = <PollBubble poll={msg.poll!} msg={msg} />;
  } else if (isMedia) {
    body = <MediaBubble msg={msg} onOpenMedia={onOpenMedia} />;
  } else {
    // text bubble (normal or blocked)
    body = (
      <div style={{ display: "inline-flex", flexDirection: "column", background: blocked ? c.blockedBadgeBg : "var(--neutral-lm-200)", border: blocked ? `1px solid ${c.blockedBorder}` : "none", borderRadius: r.xl, padding: `${s.xs} ${s.xs} 0`, maxWidth: 560 }}>
        <div style={{ padding: `${s.md} ${s.md} 0` }}>
          <div style={{ ...font.body, color: c.textPrimary }}>{msg.text}</div>
          <Footer msg={msg} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      style={{ display: "flex", alignItems: "flex-start", gap: s.md, padding: `${s.md} ${s.xl}`, background: selected ? c.bgBrand : "transparent", cursor: "pointer" }}
    >
      <StatusAvatar person={msg.sender} size={32} />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: s.xs, paddingBottom: s.sm }}>
          <span style={{ ...font.caption, color: nameColor, fontWeight: 500 }}>{msg.sender.name}</span>
          {msg.sender.role && <RoleBadge role={msg.sender.role} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {body}
          <Reactions msg={msg} />
        </div>
      </div>
    </div>
  );
}

export function ChatView({ header, messages, selectedMessageId, onSelectMessage, onOpenMedia }: {
  header: { title: string; groupType?: GroupType; members: number; online: number; messages: number; avatar?: string; avatarB?: string; initials: string };
  messages: Message[];
  selectedMessageId?: string;
  onSelectMessage?: (m: Message) => void;
  onOpenMedia?: (m: Message) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.bgPrimary }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.md, height: 58, padding: `0 ${s.xl}`, borderBottom: `1px solid ${c.borderDefault}`, flexShrink: 0 }}>
        {header.avatarB
          ? <DualAvatar a={header.avatar} b={header.avatarB} size={36} />
          : <StatusAvatar person={{ uid: "h", name: header.title, initials: header.initials, avatar: header.avatar, online: header.online > 0 }} size={36} showStatus={!header.groupType} />}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: s.xxs, justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: s.md }}>
            <span style={{ ...font.bodyMd, fontWeight: 600, color: c.textPrimary }}>{header.title}</span>
            {header.groupType && <GroupTypeBadge type={header.groupType} />}
          </div>
          <div style={{ ...font.captionReg, color: c.textSecondary }}>
            {header.members} Members · {header.online} Online · {header.messages} Messages
          </div>
        </div>
        <CometChatButton hierarchy="tertiary" iconOnly ariaLabel="Search in conversation" iconLeading={<SearchLg size={20} style={{ color: c.textQuaternary }} />} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: c.bgSecondary, padding: `${s.md} 0` }}>
        {messages.map((m) => (
          <React.Fragment key={m.id}>
            {m.divider && <DateDivider label={m.divider} />}
            <Bubble msg={m} selected={m.id === selectedMessageId} onSelect={() => onSelectMessage?.(m)} onOpenMedia={onOpenMedia} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
