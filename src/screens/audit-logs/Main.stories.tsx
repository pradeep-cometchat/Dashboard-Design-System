import type { Meta, StoryObj } from "@storybook/react-vite";
import AuditLogsScreen from "./AuditLogs";

const meta: Meta<typeof AuditLogsScreen> = {
  title: "Screens/Audit Logs/Main",
  component: AuditLogsScreen,
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof AuditLogsScreen>;

export const Empty: Story = { args: { variant: "empty" } };

export const Gated: Story = { args: { variant: "gated" } };

export const Enterprise: Story = { args: { variant: "enterprise" } };
