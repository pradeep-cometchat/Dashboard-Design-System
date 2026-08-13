// Token-driven style helpers for the Conversation Explorer screens.
// Every value resolves to a CSS custom property emitted from design-tokens.scss
// (see src/foundations/tokens.css). Nothing here is a raw color / size literal.
import type { CSSProperties } from "react";

/** Semantic color tokens as `var(--…)` references. */
export const c = {
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textTertiary: "var(--text-tertiary)",
  textQuaternary: "var(--text-quaternary)",
  textPlaceholder: "var(--text-placeholder)",
  textBrand: "var(--text-brand-primary)",
  textError: "var(--text-error)",
  bgPrimary: "var(--bg-primary)",
  bgSecondary: "var(--bg-secondary)",
  bgTertiary: "var(--bg-tertiary)",
  bgActive: "var(--bg-active)",
  bgBrand: "var(--bg-brand-primary)",
  borderLight: "var(--border-light)",
  borderDefault: "var(--border-default)",
  borderDark: "var(--border-dark)",
  brand: "var(--base-brand)",
  online: "var(--success-500)",
  offline: "var(--neutral-lm-300)",
  white: "var(--base-white)",
  // moderation
  flaggedBg: "var(--moderation-flagged-bg)",
  flaggedBorder: "var(--moderation-flagged-border)",
  flaggedBadgeBg: "var(--moderation-flagged-badge-bg)",
  flaggedBadgeText: "var(--moderation-flagged-badge-text)",
  blockedBg: "var(--moderation-blocked-bg)",
  blockedBorder: "var(--moderation-blocked-border)",
  blockedBadgeBg: "var(--moderation-blocked-badge-bg)",
  blockedBadgeText: "var(--moderation-blocked-badge-text)",
} as const;

/** Spacing tokens. */
export const s = {
  xxs: "var(--spacing-xxs)",
  xs: "var(--spacing-xs)",
  sm: "var(--spacing-sm)",
  md: "var(--spacing-md)",
  lg: "var(--spacing-lg)",
  xl: "var(--spacing-xl)",
  "2xl": "var(--spacing-2xl)",
  "3xl": "var(--spacing-3xl)",
  "4xl": "var(--spacing-4xl)",
  "5xl": "var(--spacing-5xl)",
} as const;

/** Radius tokens. */
export const r = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  full: "var(--radius-full)",
} as const;

export const shadow = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
} as const;

/** Lightened skeuomorphic button ring (reduced from the default 0.18 inset to 0.06). */
export const SOFT_RING = "0px 1px 2px 0px rgba(10,13,18,0.05), inset 0px -1px 0px 0px rgba(10,13,18,0.03), inset 0px 0px 0px 1px rgba(10,13,18,0.06)";

const family = "var(--font-family-base)";

/** Typography presets mapped to the design's roles (all sizes/line-heights are tokens). */
export const font: Record<string, CSSProperties> = {
  pageTitle: { fontFamily: family, fontSize: "var(--font-size-display-xs)", lineHeight: "var(--line-height-display-xs)", fontWeight: 600 as const, color: c.textPrimary },
  h2: { fontFamily: family, fontSize: "var(--font-size-text-xl)", lineHeight: "var(--line-height-text-xl)", fontWeight: 600 as const, color: c.textPrimary },
  h4: { fontFamily: family, fontSize: "var(--font-size-text-md)", lineHeight: "var(--line-height-text-md)", fontWeight: 500 as const, color: c.textPrimary },
  bodyMd: { fontFamily: family, fontSize: "var(--font-size-text-sm)", lineHeight: "var(--line-height-text-sm)", fontWeight: 500 as const, color: c.textPrimary },
  body: { fontFamily: family, fontSize: "var(--font-size-text-sm)", lineHeight: "var(--line-height-text-sm)", fontWeight: 400 as const, color: c.textSecondary },
  caption: { fontFamily: family, fontSize: "var(--font-size-text-xs)", lineHeight: "var(--line-height-text-xs)", fontWeight: 500 as const, color: c.textTertiary },
  captionReg: { fontFamily: family, fontSize: "var(--font-size-text-xs)", lineHeight: "var(--line-height-text-xs)", fontWeight: 400 as const, color: c.textTertiary },
};
