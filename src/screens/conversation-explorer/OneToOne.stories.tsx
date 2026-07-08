import type { Meta, StoryObj } from "@storybook/react-vite";
import { Explorer } from "./Explorer";
import { conversations, oneToOneHeader, oneToOneMessages, people, VIDEO_PREVIEW } from "./data";

/** Hide the data-plumbing args from the Docs controls table. */
const HIDDEN = [
  "conversations", "flowConversationId", "header", "messages", "members", "searchPlaceholder",
  "initialConversationId", "initialMessageId", "initialOverlay", "exportVariant", "receiverType", "initialSearchOpen", "initialThreadId", "initialFilterOpen",
].reduce<Record<string, { table: { disable: true } }>>((a, k) => { a[k] = { table: { disable: true } }; return a; }, {});

const meta: Meta<typeof Explorer> = {
  title: "Screens/Conversation Explorer/1:1 Chat",
  component: Explorer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The **one-to-one** Conversation Explorer flow. A 3-panel workspace (conversation list · chat bubbles · message details) for reviewing a direct conversation between two users. The header shows a split **dual avatar** of both participants. Each story below is a distinct UI state.",
      },
      story: { inline: false, height: "680px" },
    },
  },
  argTypes: HIDDEN,
};
export default meta;
type Story = StoryObj<typeof Explorer>;

const oneToOneMembers = [{ ...people.olivia }, { ...people.alec }];

const base = {
  conversations,
  flowConversationId: "c4",
  header: oneToOneHeader,
  messages: oneToOneMessages,
  members: oneToOneMembers,
};

export const EmptyState: Story = {
  args: { ...base, initialConversationId: undefined },
  parameters: { docs: { description: { story: "No conversation is selected. Both the center and right panels show featured-icon empty states." } } },
};

export const ConversationSelected: Story = {
  args: { ...base, initialConversationId: "c4" },
  parameters: { docs: { description: { story: "A 1:1 conversation is open in the center panel. The right panel prompts the admin to select a message to inspect." } } },
};

export const MessageSelected: Story = {
  args: { ...base, initialConversationId: "c4", initialMessageId: "m4" },
  parameters: { docs: { description: { story: "A message is selected — the right panel is fully populated with the message overview, members, media preview, reactions, read receipts and moderation cards." } } },
};

export const Search: Story = {
  args: { ...base, initialConversationId: "c4", initialSearchOpen: true },
  parameters: { docs: { description: { story: "Full-text search within the conversation. Clicking the search icon in the chat header swaps it for a search field; typing filters the messages live (close with the ✕)." } } },
};

export const Filters: Story = {
  args: { ...base, initialConversationId: "c4", initialFilterOpen: true },
  parameters: { docs: { description: { story: "Clicking the filter button reveals a filter-chip bar (Type · Moderation · Tags). Each chip opens a dropdown with a search box, a checkbox list of options with counts, and a Clear Filters footer; a Reset clears everything." } } },
};

export const Thread: Story = {
  args: { ...base, initialConversationId: "c4", initialThreadId: "m5", initialMessageId: "m5" },
  parameters: { docs: { description: { story: "Thread view. A message with replies shows a “↳ N Replies” affordance; clicking it opens the thread in the center panel — the parent message, a replies divider, and every reply — with a back arrow to return. Clicking any message in the thread selects it and populates the right-panel details." } } },
};

const imageMsg = oneToOneMessages.find((m) => m.id === "m3")!;
const videoMsg = oneToOneMessages.find((m) => m.id === "m4")!;

export const ImagePreview: Story = {
  args: {
    ...base, initialConversationId: "c4", initialMessageId: "m3",
    initialOverlay: { type: "image", src: imageMsg.media![0].src },
  },
  parameters: { docs: { description: { story: "Image lightbox opened over a dimmed, blurred workspace." } } },
};

export const VideoPreview: Story = {
  args: {
    ...base, initialConversationId: "c4", initialMessageId: "m4", exportVariant: "csv-json",
    initialOverlay: { type: "video", src: VIDEO_PREVIEW, duration: "0:24", thumbnails: videoMsg.media!.map((m) => m.src) },
  },
  parameters: { docs: { description: { story: "Video lightbox with a scrubber and thumbnail strip. The page header switches to CSV / JSON export actions." } } },
};
