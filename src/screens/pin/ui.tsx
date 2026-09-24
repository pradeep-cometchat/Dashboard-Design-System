// Shared chrome for the Pin screens: dashboard sidebar + page container.
// Colors, type, spacing, radius and shadows all resolve to foundation tokens
// (src/screens/theme.ts → tokens.css). Icons are inlined from the vendored
// May 2026 foundation set (currentColor, recolorable). Dimensions that have no
// token family yet (control heights, icon boxes, panel widths) live in `dim`
// below — they need $control-height-* / $icon-size-* foundations, flagged on
// the Colors (May 2026) Open Questions page.
import React from "react";
import { c, s, r, font } from "../theme";

import logoUrl from "./assets/cometchat-logo.svg";
import avatarUrl from "./assets/avatar-boldshift.jpg";

/* ---------------- foundation icons (inline, currentColor) ---------------- */

const rawIcons = import.meta.glob("../../foundations/icons-2026/svg/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const iconSvg = (name: string) => rawIcons[`../../foundations/icons-2026/svg/${name}.svg`] ?? "";

export function Icon({ name, size = 24, color, style }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", width: size, height: size, flexShrink: 0, color, ...style }}
      dangerouslySetInnerHTML={{ __html: iconSvg(name).replace("<svg ", `<svg style="width:100%;height:100%" `) }}
    />
  );
}

/* ---------------- dimensions with no foundation token (yet) ---------------- */

export const dim = {
  sidebarW: 260,
  navItemH: 44,
  navSubIndent: "var(--spacing-5xl)", // 40px — sub-item left padding IS on the spacing scale
  iconMd: 24,
  iconSm: 20,
  iconXs: 16,
  avatar: 40,
  logoW: 150,
  logoH: 32,
} as const;

const w = {
  regular: "var(--font-weight-regular)",
  medium: "var(--font-weight-medium)",
  semibold: "var(--font-weight-semibold)",
} as const;

/** Nav row typography — h4 (16/24) per the May 2026 nav spec. */
const navFont: React.CSSProperties = {
  fontFamily: "var(--font-family-base)",
  fontSize: "var(--font-size-text-md)",
  lineHeight: "var(--line-height-text-md)",
  fontWeight: w.medium as unknown as number,
};

/* ---------------- sidebar ---------------- */

function SectionLabel({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div style={{ padding: `${first ? s.md : s["2xl"]} ${s.lg} 0` }}>
      <span style={{ ...font.caption, color: c.textQuaternary }}>{children}</span>
    </div>
  );
}

function NavItem({ icon, label, chevron, active = false, sub = false }: { icon?: string; label: string; chevron?: "down" | "up" | "right"; active?: boolean; sub?: boolean }) {
  return (
    <div style={{ height: dim.navItemH, padding: `${s.xxs} 0`, width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: s.lg,
          height: "100%",
          boxSizing: "border-box",
          padding: `${s.md} ${s.lg}`,
          paddingLeft: sub ? dim.navSubIndent : s.lg,
          borderRadius: r.sm,
          background: active ? c.bgPrimary : "transparent",
          cursor: "pointer",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: s.md, flex: 1, minWidth: 0 }}>
          {icon && <Icon name={icon} size={dim.iconMd} color={c.textSecondary} />}
          <span style={{ ...navFont, color: active ? "var(--text-secondary-hover)" : c.textSecondary, whiteSpace: "nowrap" }}>{label}</span>
        </span>
        {chevron && (
          <Icon
            name={chevron === "right" ? "keyboard-arrow-right" : "keyboard-arrow-down"}
            size={dim.iconSm}
            color={c.textSecondary}
            style={chevron === "up" ? { transform: "rotate(180deg)" } : undefined}
          />
        )}
      </div>
    </div>
  );
}

function AccountCard() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: s.md,
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: s.lg,
        background: c.bgPrimary,
        border: `1px solid ${c.borderDefault}`,
        borderRadius: r.xl,
        cursor: "pointer",
      }}
    >
      <img
        src={avatarUrl}
        alt="Boldshift"
        style={{ width: dim.avatar, height: dim.avatar, borderRadius: r.full, objectFit: "cover", boxShadow: `inset 0 0 0 1px ${c.borderLight}` }}
      />
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ ...font.bodyMd, fontWeight: w.semibold as unknown as number, color: c.textPrimary }}>Boldshift</span>
        <span style={{ ...font.body, color: c.textTertiary }}>240998CGSF2026</span>
      </span>
      <span style={{ position: "absolute", top: s.sm, right: s.sm, display: "flex", padding: s.sm, borderRadius: r.sm }}>
        <Icon name="unfold-more" size={dim.iconSm} color={c.textQuaternary} />
      </span>
    </div>
  );
}

/** Sub-pages under Account → Application (May 2026 nav). */
const APPLICATION_PAGES = ["Credentials", "Webhooks", "Team Members", "Audit Logs", "Plans & Billing", "Settings"];

export function Sidebar({ active, expanded = "chats" }: { active: string; expanded?: "chats" | "application" }) {
  const chatsOpen = expanded === "chats";
  const appOpen = expanded === "application";
  const item = (icon: string | undefined, label: string, chevron?: "down" | "up" | "right", sub = false) => (
    <NavItem key={label + (sub ? "-sub" : "")} icon={icon} label={label} chevron={chevron} sub={sub} active={label === active} />
  );
  return (
    <aside style={{ width: dim.sidebarW, flexShrink: 0, display: "flex", flexDirection: "column", background: c.bgTertiary, height: "100%", boxSizing: "border-box" }}>
      <div style={{ padding: `${s.xl} ${s["3xl"]}` }}>
        <img src={logoUrl} alt="CometChat" style={{ width: dim.logoW, height: dim.logoH, display: "block" }} />
      </div>
      <nav style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: `0 ${s.lg} ${s["5xl"]}` }}>
        <SectionLabel first>GENERAL</SectionLabel>
        {item("space-dashboard", "Overview")}
        {item("group", "User & Groups", "down")}
        <SectionLabel>PRODUCTS</SectionLabel>
        {item("chat", "Chats", chatsOpen ? "up" : "down")}
        {chatsOpen && item(undefined, "Get Started", undefined, true)}
        {chatsOpen && item(undefined, "Logs", undefined, true)}
        {chatsOpen && item(undefined, "Conversation Explorer", undefined, true)}
        {chatsOpen && item(undefined, "Features", undefined, true)}
        {chatsOpen && item(undefined, "Moderation", undefined, true)}
        {chatsOpen && item(undefined, "Insights", undefined, true)}
        {chatsOpen && item(undefined, "Settings", undefined, true)}
        {chatsOpen && item(undefined, "Widgets", undefined, true)}
        {item("call", "Voice & Video", "down")}
        {item("stars-s", "AI Agents", "down")}
        {item("graph-2", "BYO Agents", "down")}
        <SectionLabel>FEATURES</SectionLabel>
        {item("verified-user", "Moderation", "down")}
        {item("notifications", "Notifications", "down")}
        {item("insert-chart", "Insights")}
        <SectionLabel>ACCOUNT</SectionLabel>
        {item("grid-view", "Application", appOpen ? "up" : "down")}
        {appOpen && APPLICATION_PAGES.map((label) => item(undefined, label, undefined, true))}
        {item("account-circle", "Profile", "right")}
        {item("import-contacts", "Resources", "right")}
      </nav>
      <div style={{ padding: `0 ${s.xl} ${s.xl}` }}>
        <AccountCard />
      </div>
    </aside>
  );
}

/* ---------------- page shell ---------------- */

/** The full dashboard frame: gray canvas, sidebar left, white page container. */
export function DashboardFrame({ active, expanded, children }: { active: string; expanded?: "chats" | "application"; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", minHeight: 720, background: c.bgTertiary, fontFamily: "var(--font-family-base)", overflow: "hidden" }}>
      <Sidebar active={active} expanded={expanded} />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          marginTop: s.md,
          background: c.bgPrimary,
          border: `1px solid ${c.borderDefault}`,
          borderRight: "none",
          borderBottom: "none",
          borderTopLeftRadius: r.xl,
          padding: `${s.xl} ${s["2xl"]}`,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
