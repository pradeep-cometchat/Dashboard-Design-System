import type { Meta, StoryObj } from "@storybook/react-vite";
import NotificationSettingsScreen from "./NotificationSettings";

const meta: Meta<typeof NotificationSettingsScreen> = {
  title: "Screens/Settings/Notification Settings",
  component: NotificationSettingsScreen,
  parameters: { layout: "fullscreen", fullBleed: true, options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof NotificationSettingsScreen>;

export const Default: Story = {};
