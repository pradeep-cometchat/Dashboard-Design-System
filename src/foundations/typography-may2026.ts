// Typography — "❖ Dashboard – Design System (May 2026)" (Figma file OIMLZzuzLmG7mdPKYJyglX)
// Pulled via Figma MCP variable definitions from node 1023-36826.
//
// IMPORTANT: the Figma file uses **Inter** as a placeholder family. The Dashboard's
// real typeface is **Satoshi** — everything here is documented and rendered as Satoshi.
//
// `maps` is the equivalent size token in the CURRENT foundations (design-tokens.scss).

export const SOURCE = {
  file: "❖ Dashboard – Design System (May 2026)",
  fileKey: "OIMLZzuzLmG7mdPKYJyglX",
  nodes: [{ id: "1023-36826", label: "Typography" }],
};

/** Family roles. In Figma both point at Inter (placeholder); the Dashboard uses Satoshi. */
export const families2026 = [
  { role: "Display", font: "Satoshi", figmaPlaceholder: "Inter", usedBy: "Title, H1, H2, Display XL/LG" },
  { role: "Body", font: "Satoshi", figmaPlaceholder: "Inter", usedBy: "H3, H4, Body, Caption" },
];

export const weights2026 = [
  { name: "Regular", value: 400 },
  { name: "Medium", value: 500 },
  { name: "Semibold", value: 600 },
  { name: "Bold", value: 700 },
];

export interface TypeLevel {
  name: string;
  /** Proposed token name in the current naming convention. The three Display scale
   *  levels renumber as a clean ladder: 32 → display-md, 24 → display-sm, 20 → display-xs. */
  token: string;
  size: number;
  line: number;
  family: "Display" | "Body";
  /** Composed styles defined in Figma (weight variants). Empty = size-only variables. */
  styles: number[];
  /** Equivalent size token in the current foundations (for the change summary). */
  maps: string | null;
  /** True = a documented row on the Figma Typography page. False = size variable only. */
  inScale: boolean;
}

export const scale2026: TypeLevel[] = [
  { name: "Display XL", token: "display-xl", size: 60, line: 72, family: "Display", styles: [], maps: "display-xl", inScale: false },
  { name: "Display LG", token: "display-lg", size: 48, line: 60, family: "Display", styles: [], maps: "display-lg", inScale: false },
  { name: "Title", token: "display-md", size: 32, line: 40, family: "Display", styles: [400, 500, 600, 700], maps: "display-sm", inScale: true },
  { name: "H1", token: "display-sm", size: 24, line: 32, family: "Display", styles: [400, 500, 600, 700], maps: "display-xs", inScale: true },
  { name: "H2", token: "display-xs", size: 20, line: 30, family: "Display", styles: [400, 500, 600, 700], maps: "text-xl", inScale: true },
  { name: "H3", token: "text-lg", size: 18, line: 28, family: "Body", styles: [400, 500, 600, 700], maps: "text-lg", inScale: true },
  { name: "H4", token: "text-md", size: 16, line: 24, family: "Body", styles: [400, 500, 600, 700], maps: "text-md", inScale: true },
  { name: "Body", token: "text-sm", size: 14, line: 20, family: "Body", styles: [400, 500, 600, 700], maps: "text-sm", inScale: true },
  { name: "Caption", token: "text-xs", size: 12, line: 18, family: "Body", styles: [400, 500, 600, 700], maps: "text-xs", inScale: true },
];

/** px → rem string at the 16px root (matches the Figma page's annotations). */
export const rem = (px: number) => `${parseFloat((px / 16).toFixed(4))}rem`;

/** All May-2026 styles have letterSpacing: 0 (the current display sizes use -0.02em). */
export const LETTER_SPACING_2026 = "0";
