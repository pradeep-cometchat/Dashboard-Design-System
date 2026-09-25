import type { Meta, StoryObj } from "@storybook/react-vite";
import UserAuditScreen from "./UserAudit";

/** The signed-in person's own history — GET /me/audit-logs (ENG-36975): their changes across all their apps, plus account sign-ins. */
const meta: Meta<typeof UserAuditScreen> = {
  title: "Screens/Audit Logs/User Audit",
  component: UserAuditScreen,
  parameters: { layout: "fullscreen", fullBleed: true, options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof UserAuditScreen>;

export const Enterprise: Story = {};
