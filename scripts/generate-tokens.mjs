// Parses src/assets/design-tokens.scss and emits src/foundations/tokens.ts
// Run: node scripts/generate-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const scss = readFileSync(resolve(root, "src/assets/design-tokens.scss"), "utf8");

// 1. Parse `$name: value;` in order. A MAJOR section header is a comment line
//    sandwiched between `// ====` divider lines (e.g. `// SEMANTIC COLORS (Light Mode)`).
const lines = scss.split("\n");
const isDivider = (l) => /^\/\/\s*=+\s*$/.test(l || "");
const raw = []; // { name, value, section }
let section = "";
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const comment = line.match(/^\/\/\s*(.+?)\s*$/);
  if (comment && !isDivider(line) && isDivider(lines[i - 1])) {
    section = comment[1].trim();
    continue;
  }
  const varMatch = line.match(/^\$([\w-]+):\s*(.+?);\s*$/);
  if (varMatch) raw.push({ name: varMatch[1], value: varMatch[2].trim(), section });
}

// 2. Resolve `$ref` chains to concrete values.
const byName = Object.fromEntries(raw.map((r) => [r.name, r]));
const resolve1 = (val, seen = new Set()) => {
  const m = val.match(/^\$([\w-]+)$/);
  if (m && byName[m[1]] && !seen.has(m[1])) {
    seen.add(m[1]);
    return resolve1(byName[m[1]].value, seen);
  }
  return val;
};
for (const r of raw) r.resolved = resolve1(r.value);

// 3. Group into structured buckets.
const get = (pred) => raw.filter(pred);
const scale = (prefix) =>
  get((r) => r.name.startsWith(prefix + "-")).map((r) => ({
    step: r.name.slice(prefix.length + 1),
    value: r.resolved,
  }));
const semantic = (prefix) =>
  get((r) => r.name.startsWith(prefix + "-") && r.section.startsWith("SEMANTIC")).map((r) => ({
    name: r.name,
    ref: r.value,
    value: r.resolved,
  }));

const data = {
  base: get((r) => r.section === "BASE COLORS").map((r) => ({ name: r.name, value: r.resolved })),
  primitives: {
    primary: scale("primary"),
    "neutral (light)": scale("neutral-lm"),
    "neutral (dark)": scale("neutral-dm"),
    error: scale("error"),
    warning: scale("warning"),
    success: scale("success"),
    info: scale("info"),
    amber: scale("amber"),
  },
  semantic: {
    text: semantic("text"),
    border: semantic("border"),
    background: semantic("bg"),
    foreground: semantic("fg"),
    moderation: semantic("moderation"),
  },
  typography: {
    families: get((r) => r.name.startsWith("font-family-")).map((r) => ({ name: r.name, value: r.resolved })),
    weights: get((r) => r.name.startsWith("font-weight-")).map((r) => ({ name: r.name, value: r.resolved })),
    sizes: get((r) => r.name.startsWith("font-size-")).map((r) => ({
      name: r.name.replace("font-size-", ""),
      size: r.resolved,
      line: (byName["line-height-" + r.name.replace("font-size-", "")] || {}).resolved || "",
      spacing: (byName["letter-spacing-" + r.name.replace("font-size-", "")] || {}).resolved || "normal",
    })),
  },
  spacing: get((r) => r.name.startsWith("spacing-")).map((r) => ({ name: r.name.replace("spacing-", ""), value: r.resolved })),
  radius: get((r) => r.name.startsWith("radius-")).map((r) => ({ name: r.name.replace("radius-", ""), value: r.resolved })),
  shadows: get((r) => r.name.startsWith("shadow-") && !r.name.includes("skeuomorphic")).map((r) => ({ name: r.name, value: r.resolved })),
  focusRings: get((r) => r.name.startsWith("focus-ring")).map((r) => ({ name: r.name, value: r.resolved })),
  blur: get((r) => r.name.startsWith("backdrop-blur-")).map((r) => ({ name: r.name.replace("backdrop-blur-", ""), value: r.resolved })),
};

const out = `// AUTO-GENERATED from src/assets/design-tokens.scss by scripts/generate-tokens.mjs
// Do not edit by hand — run \`node scripts/generate-tokens.mjs\` to regenerate.

export const tokens = ${JSON.stringify(data, null, 2)} as const;

export type Tokens = typeof tokens;
`;

mkdirSync(resolve(root, "src/foundations"), { recursive: true });
writeFileSync(resolve(root, "src/foundations/tokens.ts"), out);
console.log("Wrote src/foundations/tokens.ts");

// Emit a CSS custom-properties layer so composed screens reference `var(--token)`
// instead of hardcoding values. Every resolved SCSS variable becomes a `--name`.
const cssVars = raw
  .map((r) => `  --${r.name}: ${r.resolved};`)
  .join("\n");
const css = `/* AUTO-GENERATED from src/assets/design-tokens.scss by scripts/generate-tokens.mjs */\n/* Do not edit by hand. */\n:root {\n${cssVars}\n}\n`;
writeFileSync(resolve(root, "src/foundations/tokens.css"), css);
console.log(`Wrote src/foundations/tokens.css (${raw.length} custom properties)`);
console.log(
  `  base=${data.base.length} primitives=${Object.values(data.primitives).reduce((a, s) => a + s.length, 0)} ` +
    `semantic=${Object.values(data.semantic).reduce((a, s) => a + s.length, 0)} ` +
    `sizes=${data.typography.sizes.length} spacing=${data.spacing.length} radius=${data.radius.length} shadows=${data.shadows.length}`
);
