// Colors — "❖ Dashboard – Design System (May 2026)" (Figma file OIMLZzuzLmG7mdPKYJyglX)
// Pulled via Figma MCP variable definitions from:
//   • node 18498-484479 (primitive ramps)
//   • node 6472-97620  (semantic colors)
// `maps` is the equivalent token name in the CURRENT foundations (design-tokens.scss),
// used to compute the change summary. `null` = no current equivalent (new token).

export const SOURCE = {
  file: "❖ Dashboard – Design System (May 2026)",
  fileKey: "OIMLZzuzLmG7mdPKYJyglX",
  nodes: [
    { id: "18498-484479", label: "Primitive ramps" },
    { id: "6472-97620", label: "Semantic colors" },
  ],
};

export interface NewToken { name: string; value: string; maps: string | null }

export const base2026: NewToken[] = [
  { name: "Base/white", value: "#ffffff", maps: "base-white" },
  { name: "Base/black", value: "#000000", maps: "base-black" },
];

/** Primitive ramps. Key = May-2026 family name; `maps` = current family in tokens.primitives. */
export const ramps2026: { family: string; maps: string; steps: { step: string; value: string }[] }[] = [
  { family: "Brand", maps: "primary", steps: [
    { step: "25", value: "#f7f9fe" }, { step: "50", value: "#f0f2fd" }, { step: "100", value: "#e3e6fc" },
    { step: "200", value: "#ccd0f9" }, { step: "300", value: "#adb1f4" }, { step: "400", value: "#8e8ced" },
    { step: "500", value: "#7a70e4" }, { step: "600", value: "#6852d6" }, { step: "700", value: "#5b45bd" },
    { step: "800", value: "#4a3a99" }, { step: "900", value: "#403679" }, { step: "950", value: "#261f47" },
  ] },
  { family: "Neutral (light mode)", maps: "neutral (light)", steps: [
    { step: "25", value: "#fdfdfd" }, { step: "50", value: "#fafafa" }, { step: "100", value: "#f5f5f5" },
    { step: "200", value: "#e9eaeb" }, { step: "300", value: "#d5d7da" }, { step: "400", value: "#a4a7ae" },
    { step: "500", value: "#717680" }, { step: "600", value: "#535862" }, { step: "700", value: "#414651" },
    { step: "800", value: "#252b37" }, { step: "900", value: "#181d27" }, { step: "950", value: "#0a0d12" },
  ] },
  { family: "Neutral (dark mode)", maps: "neutral (dark)", steps: [
    { step: "25", value: "#fafafa" }, { step: "50", value: "#f7f7f7" }, { step: "100", value: "#f0f0f1" },
    { step: "200", value: "#ececed" }, { step: "300", value: "#cecfd2" }, { step: "400", value: "#94979c" },
    { step: "500", value: "#85888e" }, { step: "600", value: "#61656c" }, { step: "700", value: "#373a41" },
    { step: "800", value: "#22262f" }, { step: "900", value: "#13161b" }, { step: "950", value: "#0c0e12" },
  ] },
  { family: "Error", maps: "error", steps: [
    { step: "25", value: "#fffbfa" }, { step: "50", value: "#fef3f2" }, { step: "100", value: "#fee4e2" },
    { step: "200", value: "#fecdca" }, { step: "300", value: "#fda29b" }, { step: "400", value: "#f97066" },
    { step: "500", value: "#f04438" }, { step: "600", value: "#d92d20" }, { step: "700", value: "#b42318" },
    { step: "800", value: "#912018" }, { step: "900", value: "#7a271a" }, { step: "950", value: "#55160c" },
  ] },
  { family: "Warning", maps: "warning", steps: [
    { step: "25", value: "#fffcf5" }, { step: "50", value: "#fffaeb" }, { step: "100", value: "#fef0c7" },
    { step: "200", value: "#fedf89" }, { step: "300", value: "#fec84b" }, { step: "400", value: "#fdb022" },
    { step: "500", value: "#f79009" }, { step: "600", value: "#dc6803" }, { step: "700", value: "#b54708" },
    { step: "800", value: "#93370d" }, { step: "900", value: "#7a2e0e" }, { step: "950", value: "#4e1d09" },
  ] },
  { family: "Success", maps: "success", steps: [
    { step: "25", value: "#f6fef9" }, { step: "50", value: "#ecfdf3" }, { step: "100", value: "#dcfae6" },
    { step: "200", value: "#abefc6" }, { step: "300", value: "#75e0a7" }, { step: "400", value: "#47cd89" },
    { step: "500", value: "#17b26a" }, { step: "600", value: "#079455" }, { step: "700", value: "#067647" },
    { step: "800", value: "#085d3a" }, { step: "900", value: "#074d31" }, { step: "950", value: "#053321" },
  ] },
  { family: "Info", maps: "info", steps: [
    { step: "25", value: "#f5faff" }, { step: "50", value: "#eff8ff" }, { step: "100", value: "#d1e9ff" },
    { step: "200", value: "#b2ddff" }, { step: "300", value: "#84caff" }, { step: "400", value: "#53b1fd" },
    { step: "500", value: "#2e90fa" }, { step: "600", value: "#1570ef" }, { step: "700", value: "#175cd3" },
    { step: "800", value: "#1849a9" }, { step: "900", value: "#194185" }, { step: "950", value: "#102a56" },
  ] },
];

export const semantic2026: Record<"text" | "border" | "foreground" | "background", NewToken[]> = {
  text: [
    { name: "Text Primary", value: "#181d27", maps: "text-primary" },
    { name: "Text Secondary", value: "#414651", maps: "text-secondary" },
    { name: "Text Secondary Hover", value: "#252b37", maps: "text-secondary-hover" },
    { name: "Text Tertiary", value: "#535862", maps: "text-tertiary" },
    { name: "Text Tertiary Hover", value: "#414651", maps: "text-tertiary-hover" },
    { name: "Text Quaternary", value: "#717680", maps: "text-quaternary" },
    { name: "Text White (Same)", value: "#ffffff", maps: "text-white" },
    { name: "Text Disabled", value: "#717680", maps: "text-disabled" },
    { name: "Text Placeholder", value: "#717680", maps: "text-placeholder" },
    { name: "Text Placeholder Subtle", value: "#d5d7da", maps: "text-placeholder-subtle" },
    { name: "Text Brand", value: "#403679", maps: "text-brand-primary" },
    { name: "Text Brand Hover", value: "#5b45bd", maps: null },
    { name: "Text Error", value: "#d92d20", maps: "text-error" },
    { name: "Text Warning", value: "#dc6803", maps: "text-warning" },
    { name: "Text Success", value: "#079455", maps: "text-success" },
    { name: "Text Info", value: "#1570ef", maps: null },
  ],
  border: [
    { name: "Border Light", value: "#f5f5f5", maps: "border-light" },
    { name: "Border Default", value: "#e9eaeb", maps: "border-default" },
    { name: "Border Default Hover", value: "#d5d7da", maps: "border-default-hover" },
    { name: "Border Dark", value: "#d5d7da", maps: "border-dark" },
    { name: "Border Disabled", value: "#d5d7da", maps: "border-disabled" },
    { name: "Border Disabled Subtle", value: "#e9eaeb", maps: "border-disabled-subtle" },
    { name: "Border Brand", value: "#7a70e4", maps: "border-brand" },
    { name: "Border Error", value: "#f04438", maps: "border-error" },
    { name: "Border Error Subtle", value: "#fda29b", maps: "border-error-subtle" },
  ],
  foreground: [
    { name: "FG Primary", value: "#181d27", maps: "fg-primary" },
    { name: "FG Secondary", value: "#414651", maps: "fg-secondary" },
    { name: "FG Secondary Hover", value: "#252b37", maps: "fg-secondary-hover" },
    { name: "FG Tertiary", value: "#535862", maps: "fg-tertiary" },
    { name: "FG Tertiary Hover", value: "#414651", maps: "fg-tertiary-hover" },
    { name: "FG Quaternary", value: "#a4a7ae", maps: "fg-quaternary" },
    { name: "FG Quaternary Hover", value: "#717680", maps: "fg-quaternary-hover" },
    { name: "FG White", value: "#ffffff", maps: "fg-white" },
    { name: "FG Disabled", value: "#a4a7ae", maps: "fg-disabled" },
    { name: "FG Disabled Subtle", value: "#d5d7da", maps: "fg-disabled-subtle" },
    { name: "FG Brand Primary", value: "#6852d6", maps: "fg-brand-primary" },
    { name: "FG Brand Primary Alt", value: "#6852d6", maps: "fg-brand-primary-alt" },
    { name: "FG Brand Secondary", value: "#7a70e4", maps: "fg-brand-secondary" },
    { name: "FG Brand Secondary Alt", value: "#7a70e4", maps: "fg-brand-secondary-alt" },
    { name: "FG Error Primary", value: "#d92d20", maps: "fg-error-primary" },
    { name: "FG Error Secondary", value: "#f04438", maps: "fg-error-secondary" },
    { name: "FG Warning Primary", value: "#dc6803", maps: "fg-warning-primary" },
    { name: "FG Warning Secondary", value: "#f79009", maps: "fg-warning-secondary" },
    { name: "FG Success Primary", value: "#079455", maps: "fg-success-primary" },
    { name: "FG Success Secondary", value: "#17b26a", maps: "fg-success-secondary" },
    { name: "FG Info Primary", value: "#1570ef", maps: "fg-info-primary" },
    { name: "FG Info Secondary", value: "#2e90fa", maps: "fg-info-secondary" },
  ],
  background: [
    { name: "BG 01", value: "#ffffff", maps: "bg-primary" },
    { name: "BG 01 Hover", value: "#fafafa", maps: "bg-primary-hover" },
    { name: "BG 01 Solid", value: "#0a0d12", maps: "bg-primary-solid" },
    { name: "BG 02", value: "#fafafa", maps: "bg-secondary" },
    { name: "BG 02 Hover", value: "#f5f5f5", maps: "bg-secondary-hover" },
    { name: "BG 02 Solid", value: "#535862", maps: "bg-secondary-solid" },
    { name: "BG 03", value: "#f5f5f5", maps: "bg-tertiary" },
    { name: "BG 03 Hover", value: "#e9eaeb", maps: "bg-tertiary-hover" },
    { name: "BG 04", value: "#e9eaeb", maps: "bg-quaternary" },
    { name: "BG Active", value: "#fafafa", maps: "bg-active" },
    { name: "BG Black Solid", value: "#0a0d12", maps: null },
    { name: "BG Black Solid Hover", value: "#252b37", maps: null },
    { name: "BG Disabled", value: "#f5f5f5", maps: "bg-disabled" },
    { name: "BG Disabled Subtle", value: "#13161b", maps: "bg-disabled-subtle" },
    { name: "BG Overlay", value: "#0a0d12", maps: "bg-overlay" },
    { name: "BG Brand Primary", value: "#f0f2fd", maps: "bg-brand-primary" },
    { name: "BG Brand Primary Alt", value: "#f0f2fd", maps: "bg-brand-primary-alt" },
    { name: "BG Brand Secondary", value: "#e3e6fc", maps: "bg-brand-secondary" },
    { name: "BG Brand Solid", value: "#6852d6", maps: "bg-brand-solid" },
    { name: "BG Brand Solid Hover", value: "#5b45bd", maps: "bg-brand-solid-hover" },
    { name: "BG Error Primary", value: "#fef3f2", maps: "bg-error-primary" },
    { name: "BG Error Secondary", value: "#fee4e2", maps: "bg-error-secondary" },
    { name: "BG Error Solid", value: "#d92d20", maps: "bg-error-solid" },
    { name: "BG Error Solid Hover", value: "#b42318", maps: "bg-error-solid-hover" },
    { name: "BG Warning Primary", value: "#fffaeb", maps: "bg-warning-primary" },
    { name: "BG Warning Secondary", value: "#fef0c7", maps: "bg-warning-secondary" },
    { name: "BG Warning Solid", value: "#dc6803", maps: "bg-warning-solid" },
    { name: "BG Success Primary", value: "#ecfdf3", maps: "bg-success-primary" },
    { name: "BG Success Secondary", value: "#dcfae6", maps: "bg-success-secondary" },
    { name: "BG Success Solid", value: "#079455", maps: "bg-success-solid" },
    { name: "BG Info Primary", value: "#eff8ff", maps: "bg-info-primary" },
    { name: "BG Info Secondary", value: "#d1e9ff", maps: "bg-info-secondary" },
    { name: "BG Info Solid", value: "#1570ef", maps: "bg-info-solid" },
  ],
};
