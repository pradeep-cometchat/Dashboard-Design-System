// Misc icons — "❖ Dashboard – Design System (May 2026)" (Figma file OIMLZzuzLmG7mdPKYJyglX)
// Pulled via Figma MCP from the "↳ Misc icons" page (node 1025-31781).
//
// Unlike the Material Symbols set, these are FULL-COLOUR brand/marketing marks:
// they are never recoloured, so they ship as static assets (URL imports, <img>)
// rather than inlined currentColor SVGs.

export const SOURCE = {
  file: "❖ Dashboard – Design System (May 2026)",
  fileKey: "OIMLZzuzLmG7mdPKYJyglX",
  page: { id: "1025:31781", label: "Misc icons" },
};

export type FamilyKey = "social" | "payment" | "file-type" | "tech" | "emoji" | "folder";

export interface Family {
  key: FamilyKey;
  label: string;
  /** Figma component-set node id. */
  node: string;
  /** Which variant of the set was exported. */
  variant: string;
  /** Total variants in the Figma set (context for the export selection). */
  totalVariants: number;
  /** Intrinsic artboard size in Figma. */
  size: string;
  /** True = Figma exports these as an SVG wrapping a base64 raster. */
  raster?: boolean;
  desc: string;
}

export const families: Family[] = [
  { key: "social", label: "Social", node: "1457:244804", variant: "Style=Brand, State=Default", totalVariants: 108, size: "24×24", desc: "Platform marks in brand colour. The Figma set also carries Gray styles and Hover states." },
  { key: "payment", label: "Payment method", node: "1142:83268", variant: "Size=md", totalVariants: 117, size: "46×32", desc: "Card and wallet marks as rounded cards. Also available in sm and lg." },
  { key: "file-type", label: "File type", node: "4916:411695", variant: "Type=Default", totalVariants: 153, size: "40×40", desc: "Document, media, design and code file badges. Also available in Gray and Solid styles." },
  { key: "tech", label: "Tech", node: "18605:100430", variant: "all", totalVariants: 27, size: "32×32", raster: true, desc: "Language, framework and vendor logos used across integrations." },
  { key: "emoji", label: "Emoji", node: "1244:296", variant: "all", totalVariants: 18, size: "16×16", raster: true, desc: "The emoji set used in reactions and inline copy." },
  { key: "folder", label: "Folder", node: "7585:9240", variant: "all", totalVariants: 6, size: "48×48", desc: "Folder badges in brand and neutral treatments, open and closed." },
];

/** Documented in Figma but intentionally not vendored — see the Overview page for rationale. */
export const notVendored = [
  { name: "Country icons", count: "234 flags", note: "Frame 1107:70094 — a full ISO flag set; add on request." },
  { name: "Integration icons", count: "~200 across 11 categories", note: "Frame 6452:229238 — Browsers, Messengers, Coding, Productivity, Design…" },
  { name: "Featured icon", count: "80 variants", note: "Size × Colour × Type — a component, belongs in Base Components." },
  { name: "Featured icon outline", count: "24 variants", note: "Size × Colour — component, not a flat icon." },
  { name: "Check icon / Check item text", count: "36 + 36", note: "Composite components with size/colour/breakpoint props." },
  { name: "Star icon", count: "22 variants", note: "Fill percentage × colour — a rating component." },
  { name: "_Dot / _Tech Icon", count: "6 + 21", note: "Internal base primitives (underscore-prefixed in Figma)." },
];
