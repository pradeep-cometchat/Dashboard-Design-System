import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import SettingsScreen from "./Settings";

const meta: Meta<typeof SettingsScreen> = {
  title: "Screens/Pin/Settings",
  component: SettingsScreen,
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};
export default meta;
type Story = StoryObj<typeof SettingsScreen>;

export const Default: Story = {};
