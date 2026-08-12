// Spacing & Radius — "❖ Dashboard – Design System (May 2026)" (Figma file OIMLZzuzLmG7mdPKYJyglX)
// Pulled via Figma MCP from the "↳ Spacing & Radius" page (node 5245-372829):
//   • frame 5245:372881 "Spacing" — 14 documented steps (none → 8xl), px + rem
//   • frame 5253:372274 "Radius"  — 11 documented steps (none → full), px + rem
// `maps` is the equivalent token in the CURRENT foundations (design-tokens.scss).

export const SOURCE = {
  file: "❖ Dashboard – Design System (May 2026)",
  fileKey: "OIMLZzuzLmG7mdPKYJyglX",
  nodes: [
    { id: "5245:372881", label: "Spacing" },
    { id: "5253:372274", label: "Radius" },
  ],
};

export interface ScaleToken { name: string; px: number; maps: string | null }

/** The 14 spacing steps documented on the Figma page. Values are identical to current. */
export const spacing2026: ScaleToken[] = [
  { name: "spacing-none", px: 0, maps: "none" },
  { name: "spacing-xxs", px: 2, maps: "xxs" },
  { name: "spacing-xs", px: 4, maps: "xs" },
  { name: "spacing-sm", px: 6, maps: "sm" },
  { name: "spacing-md", px: 8, maps: "md" },
  { name: "spacing-lg", px: 12, maps: "lg" },
  { name: "spacing-xl", px: 16, maps: "xl" },
  { name: "spacing-2xl", px: 20, maps: "2xl" },
  { name: "spacing-3xl", px: 24, maps: "3xl" },
  { name: "spacing-4xl", px: 32, maps: "4xl" },
  { name: "spacing-5xl", px: 40, maps: "5xl" },
  { name: "spacing-6xl", px: 48, maps: "6xl" },
  { name: "spacing-7xl", px: 64, maps: "7xl" },
  { name: "spacing-8xl", px: 80, maps: "8xl" },
];

/** Exists as a variable in the file (used by layouts) but NOT a row in the documented table. */
export const spacingVariableOnly2026: ScaleToken[] = [
  { name: "spacing-10xl", px: 128, maps: "10xl" },
];

/** The 11 radius steps documented on the Figma page. Identical to current. */
export const radius2026: ScaleToken[] = [
  { name: "radius-none", px: 0, maps: "none" },
  { name: "radius-xxs", px: 2, maps: "xxs" },
  { name: "radius-xs", px: 4, maps: "xs" },
  { name: "radius-sm", px: 6, maps: "sm" },
  { name: "radius-md", px: 8, maps: "md" },
  { name: "radius-lg", px: 10, maps: "lg" },
  { name: "radius-xl", px: 12, maps: "xl" },
  { name: "radius-2xl", px: 16, maps: "2xl" },
  { name: "radius-3xl", px: 20, maps: "3xl" },
  { name: "radius-4xl", px: 24, maps: "4xl" },
  { name: "radius-full", px: 9999, maps: "full" },
];

/** New layout variables in May 2026 with no current equivalent. */
export const layout2026: ScaleToken[] = [
  { name: "width-2xl", px: 1024, maps: null },
  { name: "paragraph-max-width", px: 720, maps: null },
];
