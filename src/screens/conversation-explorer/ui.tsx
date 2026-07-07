import React from "react";
import { FileImageOutlined, VideoCameraOutlined, FileOutlined, AudioOutlined, CopyOutlined } from "@ant-design/icons";
import CometChatAvatar from "components/base/Avatar/CometChatAvatar";
import CometChatBadge from "components/base/Badge/CometChatBadge";
import type { BadgeColor } from "components/base/Badge/CometChatBadge";
import { c, s, r, font } from "./theme";
import type { GroupType, Role, Person } from "./data";
import { Lock01, Globe02, Shield01, Users03 } from "./icons";

/** Avatar with an online/offline status dot, composed from CometChatAvatar + tokens. */
export function StatusAvatar({ person, size = 40, showStatus = true }: { person: Person; size?: number; showStatus?: boolean }) {
  const dot = Math.max(7, Math.round(size * 0.2));
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <CometChatAvatar src={person.avatar} size={size} shape="circle" style={{ background: c.bgTertiary, color: c.textSecondary, fontSize: size * 0.36 }}>
        {person.initials}
      </CometChatAvatar>
      {showStatus && person.online !== undefined && (
        <span
          style={{
            position: "absolute", right: 0, bottom: 0, width: dot, height: dot, borderRadius: r.full,
            background: person.online ? c.online : c.offline, boxShadow: `0 0 0 2px ${c.white}`,
          }}
        />
      )}
    </span>
  );
}

/** Dual (split) avatar for 1:1 conversations — a circle split into two halves showing both members. */
export function DualAvatar({ a, b, size = 36 }: { a?: string; b?: string; size?: number }) {
  const half = size / 2;
  const imgStyle: React.CSSProperties = { position: "absolute", top: 0, width: size, height: size, maxWidth: "none", objectFit: "cover" };
  return (
    <span style={{ width: size, height: size, borderRadius: r.full, overflow: "hidden", border: `0.75px solid ${c.borderDefault}`, display: "inline-flex", flexShrink: 0, background: c.bgTertiary }}>
      <span style={{ width: half, height: size, overflow: "hidden", position: "relative", borderRight: `0.5px solid ${c.white}` }}>
        <img src={a} alt="" style={{ ...imgStyle, left: 0 }} />
      </span>
      <span style={{ width: half, height: size, overflow: "hidden", position: "relative" }}>
        <img src={b} alt="" style={{ ...imgStyle, right: 0 }} />
      </span>
    </span>
  );
}

/** Group avatar with a type indicator: a colored circle containing a white icon (Figma "Group Status"). */
const groupStatusMeta: Record<GroupType, { bg: string; icon: React.ReactNode }> = {
  Private: { bg: "var(--success-500)", icon: <Lock01 /> },
  Public: { bg: "var(--info-600)", icon: <Globe02 /> },
  Protected: { bg: "var(--warning-500)", icon: <Shield01 /> },
};
export function GroupAvatar({ src, initials, size = 40, type }: { src?: string; initials: string; size?: number; type?: GroupType }) {
  const badge = Math.round(size * 0.375); // ~18 for a 48px avatar
  const icon = Math.round(badge * 0.62);
  const m = type ? groupStatusMeta[type] : null;
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <CometChatAvatar src={src} size={size} shape="circle" style={{ background: c.bgTertiary, color: c.textSecondary, fontSize: size * 0.36 }}>
        {initials}
      </CometChatAvatar>
      {m && (
        <span style={{ position: "absolute", right: 0, bottom: 0, width: badge, height: badge, borderRadius: r.full, background: m.bg, color: c.white, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 2px ${c.white}` }}>
          {React.cloneElement(m.icon as React.ReactElement, { size: icon })}
        </span>
      )}
    </span>
  );
}

const groupTypeMeta: Record<GroupType, { color: BadgeColor; icon: React.ReactNode }> = {
  Private: { color: "success", icon: <Lock01 /> },
  Public: { color: "info", icon: <Globe02 /> },
  Protected: { color: "warning", icon: <Shield01 /> },
};
export function GroupTypeBadge({ type }: { type: GroupType }) {
  const m = groupTypeMeta[type];
  return <CometChatBadge size="sm" type="badge" color={m.color} iconLeading={m.icon}>{type}</CometChatBadge>;
}

const roleColor: Record<Role, BadgeColor> = { Owner: "brand", Admin: "brand", Moderator: "info", Member: "gray" };
export function RoleBadge({ role }: { role: Role }) {
  // Owner is a solid brand chip; the rest use the tinted badge variants.
  if (role === "Owner") {
    return <span style={{ display: "inline-flex", alignItems: "center", padding: `2px ${s.md}`, borderRadius: r.sm, background: c.brand, ...font.caption, color: c.white }}>Owner</span>;
  }
  return <CometChatBadge size="sm" type="badge" color={roleColor[role]}>{role}</CometChatBadge>;
}

const typeMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  image: { icon: <FileImageOutlined />, label: "Image" },
  video: { icon: <VideoCameraOutlined />, label: "Video" },
  file: { icon: <FileOutlined />, label: "File" },
  audio: { icon: <AudioOutlined />, label: "Audio" },
};
export function TypeBadge({ type }: { type: string }) {
  const m = typeMeta[type];
  if (!m) return null;
  return <CometChatBadge size="sm" type="pill" color="brand" iconLeading={m.icon}>{m.label}</CometChatBadge>;
}

/** Member-count badge used in the conversation list (Figma: neutral badge + users-03 icon). */
export function MemberCountBadge({ count }: { count: number }) {
  return <CometChatBadge size="sm" type="badge" color="gray" iconLeading={<Users03 />}>{count}</CometChatBadge>;
}

/** A key/value row inside the right-panel detail sections. */
export function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: s.md, minHeight: 28 }}>
      <span style={{ ...font.captionReg, color: c.textTertiary }}>{label}</span>
      <span style={{ ...font.caption, color: c.textPrimary, display: "inline-flex", alignItems: "center", gap: s.xs }}>{children}</span>
    </div>
  );
}

/** A small pill used for date/time chips in the detail panel. */
export function Chip({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, padding: `2px ${s.sm}`, borderRadius: r.sm, background: c.bgSecondary, border: `1px solid ${c.borderDefault}`, ...font.captionReg, color: c.textSecondary }}>
      {icon}{children}
    </span>
  );
}

/** Monospace-ish copyable id value. */
export function CopyValue({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: s.xs, ...font.caption, color: c.textPrimary }}>
      {children}<CopyOutlined style={{ color: c.textQuaternary, fontSize: 12 }} />
    </span>
  );
}
