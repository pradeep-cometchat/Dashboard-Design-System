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

/** Next iteration of the screen: the Pin section drops the enable-toggle header. */
export const V2: Story = { name: "V2", args: { pinEnableToggle: false, pinLabelOutside: true } };
