import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "./tokens";
import { Page, Section, TokenTable, styles } from "./Foundations";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

const Code = ({ children }: { children: string }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: "#535862" }}>{children}</code>
);

export const Families: Story = {
  name: "Font Families",
  render: () => (
    <Page title="Font Families" intro="Satoshi is the Dashboard typeface. Medium is the primary UI weight; Regular is used for longer-form body copy.">
      <Section title="Families">
        <TokenTable
          head={["Token", "Value"]}
          rows={tokens.typography.families.map((f) => [<Code>${f.name}</Code>, <Code>{f.value}</Code>])}
        />
      </Section>
    </Page>
  ),
};

export const Weights: Story = {
  name: "Font Weights",
  render: () => (
    <Page title="Font Weights" intro="Four weights cover the system, from regular body text to bold emphasis.">
      <Section title="Weights">
        <TokenTable
          head={["Token", "Value", "Sample"]}
          rows={tokens.typography.weights.map((w) => [
            <Code>${w.name}</Code>,
            <Code>{w.value}</Code>,
            <span style={{ fontWeight: Number(w.value), fontSize: 16 }}>Send a message</span>,
          ])}
        />
      </Section>
    </Page>
  ),
};

export const Scale: Story = {
  name: "Type Scale",
  render: () => (
    <Page title="Type Scale" intro="Display sizes are for headings and hero text; text sizes cover body and UI copy. Each row shows the token, its size / line-height, and a live sample.">
      <Section title="Scale">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tokens.typography.sizes.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "12px 14px", borderBottom: "1px solid #f0f0f1" }}>
              <div style={{ width: 96, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontFamily: styles.mono, fontSize: 11, color: "#717680" }}>{s.size} / {s.line}</div>
              </div>
              <div style={{ fontSize: parseInt(s.size, 10), lineHeight: 1.1, letterSpacing: s.spacing, fontWeight: s.name.startsWith("display") ? 600 : 400, color: "#181d27", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                The quick brown fox
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
