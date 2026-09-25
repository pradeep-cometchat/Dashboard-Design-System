import type { Meta, StoryObj } from "@storybook/react-vite";
import AuditLogsScreen from "./AuditLogs";

const meta: Meta<typeof AuditLogsScreen> = {
  title: "Screens/Audit Logs/App Audit",
  component: AuditLogsScreen,
  parameters: { layout: "fullscreen", fullBleed: true, options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof AuditLogsScreen>;

export const Empty: Story = { args: { variant: "empty" } };

/**
 * Plan-gated: blurred sample table + upgrade card. Switch **viewerRole** to "admin" to see the
 * admin copy (Plans & Billing is owner-only, so admins are asked to contact the owner).
 */
export const Gated: Story = {
  args: { variant: "gated", viewerRole: "owner" },
  argTypes: { viewerRole: { control: "inline-radio", options: ["owner", "admin"] } },
  parameters: { options: { showPanel: true }, controls: { include: ["viewerRole"] } },
};

export const Enterprise: Story = { args: { variant: "enterprise" } };
