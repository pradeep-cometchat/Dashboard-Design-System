import type { Meta, StoryObj } from "@storybook/react-vite";
import { tokens } from "./tokens";
import { Page, Section, Grid, Swatch, Ramp, TokenTable, styles } from "./Foundations";

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj;

function Chip({ value }: { value: string }) {
  return <span style={{ display: "inline-block", width: 20, height: 20, borderRadius: 5, background: value, boxShadow: "inset 0 0 0 1px rgba(10,13,18,0.1)", verticalAlign: "middle" }} />;
}
const Code = ({ children }: { children: string }) => (
  <code style={{ fontFamily: styles.mono, fontSize: 12, color: "#535862" }}>{children}</code>
);

function semanticRows(items: { name: string; ref: string; value: string }[]) {
  return items.map((t) => [<Chip value={t.value} />, <Code>${t.name}</Code>, <Code>{t.ref}</Code>, <Code>{t.value}</Code>]);
}
function SemanticTable({ title, group }: { title: string; group: keyof typeof tokens.semantic }) {
  return (
    <Page title={title} intro="Semantic tokens map primitive colors to a role. Reference the semantic token in components — never a raw primitive — so themes and future changes propagate automatically.">
      <Section title={title}>
        <TokenTable head={["", "Token", "Reference", "Value"]} rows={semanticRows(tokens.semantic[group])} />
      </Section>
    </Page>
  );
}

export const Base: Story = {
  render: () => (
    <Page title="Base Colors" intro="The core brand anchors. $base-primary is CometChat’s purple; white and black bound the neutral range.">
      <Section title="Base">
        <Grid min={160}>
          {tokens.base.map((c) => (
            <Swatch key={c.name} color={c.value} name={`$${c.name}`} sub={c.value} ring={c.value.toLowerCase() === "#ffffff"} />
          ))}
        </Grid>
      </Section>
    </Page>
  ),
};

export const Primitives: Story = {
  name: "Primitive Ramps",
  render: () => (
    <Page title="Primitive Ramps" intro="The full 25→950 tonal ramps. These are raw values — reference them through semantic tokens rather than directly in components.">
      <Section title="Ramps">
        {Object.entries(tokens.primitives).map(([name, steps]) => (
          <Ramp key={name} label={name} steps={steps as { step: string; value: string }[]} />
        ))}
      </Section>
    </Page>
  ),
};

export const Moderation: Story = {
  name: "Semantic · Moderation",
  render: () => (
    <Page title="Semantic · Moderation" intro="Moderation-state tokens used by Conversation Explorer message bubbles and badges. Flagged uses the amber ramp; blocked uses error/red; approved uses success.">
      <Section title="Moderation">
        <TokenTable head={["", "Token", "Reference", "Value"]} rows={semanticRows(tokens.semantic.moderation)} />
      </Section>
    </Page>
  ),
};

export const SemanticText: Story = { name: "Semantic · Text", render: () => <SemanticTable title="Semantic · Text" group="text" /> };
export const SemanticBorder: Story = { name: "Semantic · Border", render: () => <SemanticTable title="Semantic · Border" group="border" /> };
export const SemanticBackground: Story = { name: "Semantic · Background", render: () => <SemanticTable title="Semantic · Background" group="background" /> };
export const SemanticForeground: Story = { name: "Semantic · Foreground", render: () => <SemanticTable title="Semantic · Foreground (Icons)" group="foreground" /> };
