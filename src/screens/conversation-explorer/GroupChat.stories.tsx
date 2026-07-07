import type { Meta, StoryObj } from "@storybook/react-vite";
import { Explorer } from "./Explorer";
import { conversations, groupHeader, groupMessages, groupMembers, IMAGE_PREVIEW } from "./data";

const HIDDEN = [
  "conversations", "flowConversationId", "header", "messages", "members", "searchPlaceholder",
  "initialConversationId", "initialMessageId", "initialOverlay", "exportVariant", "receiverType",
].reduce<Record<string, { table: { disable: true } }>>((a, k) => { a[k] = { table: { disable: true } }; return a; }, {});

const meta: Meta<typeof Explorer> = {
  title: "Screens/Conversation Explorer/Group Chat",
  component: Explorer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The **group** Conversation Explorer flow. Adds per-sender **role badges** (Admin / Moderator / Member), a group header with type badge and member/online counts, richer message types (poll, blocked message), and multi-reaction support. Each story below is a distinct UI state.",
      },
      story: { inline: false, height: "680px" },
    },
  },
  argTypes: HIDDEN,
};
export default meta;
type Story = StoryObj<typeof Explorer>;

const base = {
  conversations,
  flowConversationId: "c1",
  header: groupHeader,
  messages: groupMessages,
  members: groupMembers,
  searchPlaceholder: "Search by user or gro...",
};

export const Selected: Story = {
  args: { ...base, initialConversationId: "c1" },
  parameters: { docs: { description: { story: "A group conversation is open. Bubbles show role badges, edited indicators, media, a poll, and flagged / blocked content." } } },
};

export const MessageSelected: Story = {
  args: { ...base, initialConversationId: "c1", initialMessageId: "g4" },
  parameters: { docs: { description: { story: "A group image message is selected; the right panel shows its full details." } } },
};

export const FlaggedMessageSelected: Story = {
  args: { ...base, initialConversationId: "c1", initialMessageId: "g5" },
  parameters: { docs: { description: { story: "A flagged image is selected — the moderation card shows the violation type, reason and reporter, and the reactions card lists each reactor." } } },
};

export const MediaPreview: Story = {
  args: {
    ...base, initialConversationId: "c1", initialMessageId: "g5",
    initialOverlay: { type: "image", src: IMAGE_PREVIEW },
  },
  parameters: { docs: { description: { story: "Media lightbox for a group message, over the dimmed workspace." } } },
};
