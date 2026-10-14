import type { Meta, StoryObj } from "@storybook/react-vite";
import CallSettingsScreen from "./CallSettings";

const meta: Meta<typeof CallSettingsScreen> = {
  title: "Screens/Settings/Call Settings",
  component: CallSettingsScreen,
  parameters: { layout: "fullscreen", fullBleed: true, options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof CallSettingsScreen>;

export const Default: Story = {};
