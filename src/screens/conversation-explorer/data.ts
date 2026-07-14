// Mock data for the Conversation Explorer screens — mirrors the Figma reference.
export type Role = "Owner" | "Admin" | "Moderator" | "Member";
export type GroupType = "Private" | "Public" | "Protected";
export type ModStatus = "approved" | "flagged" | "blocked";

export interface Person {
  uid: string;
  name: string;
  initials: string;
  avatar?: string;
  role?: Role;
  online?: boolean;
  lastSeen?: string;
}

export interface MediaItem {
  kind: "image" | "video";
  src: string;
  duration?: string;
}

export interface PollOption { label: string; voters: string[]; extra?: number; checked?: boolean; percent: number }
export interface Poll { question: string; options: PollOption[]; totalVotes: number }

export interface Message {
  id: string;
  sender: Person;
  text?: string;
  time: string;
  edited?: boolean;
  editedTime?: string;
  type?: "text" | "image" | "video" | "file" | "audio" | "poll";
  media?: MediaItem[];
  reactions?: { emoji: string; count: number }[];
  reactors?: { person: Person; emoji: string }[];
  moderation?: { status: ModStatus; violationType?: string; reasonLabel?: string; reason?: string; reportedBy?: string };
  poll?: Poll;
  replies?: Message[]; // thread replies — surfaces a "↳ N Replies" affordance and opens a thread view
  divider?: string; // day divider rendered before this message (e.g. "Yesterday", "Today")
  detail?: MessageDetail;
}

export interface MessageDetail {
  messageId: string;
  category: string;
  type: string;
  receiverType?: string;
  delivery: string;
  sentAt: { date: string; time: string };
  updatedAt: { date: string; time: string };
}

export interface Conversation {
  id: string;
  kind: "user" | "group";
  title: string;
  avatar?: string;
  avatarB?: string; // second member's avatar → renders a split dual-avatar (1:1)
  initials: string;
  groupType?: GroupType;
  memberCount?: number;
  onlineCount?: number;
  unread?: number;
  lastSenderName: string;
  lastPreview: string;
  time: string;
  tags?: string[];
  online?: boolean;
}

const A = {
  olivia: { uid: "cometchat-uid-2", name: "Olivia Rhye", initials: "OR", avatar: "https://i.pravatar.cc/96?img=47", online: true, lastSeen: "Today at 12:13 pm" },
  alec: { uid: "cometchat-uid-1", name: "Alec Whitten", initials: "AW", avatar: "https://i.pravatar.cc/96?img=12", online: false, lastSeen: "Today at 12:13 pm" },
  george: { uid: "cometchat-uid-3", name: "George Alan", initials: "GA", avatar: "https://i.pravatar.cc/96?img=15", online: true, lastSeen: "Today at 11:02 am" },
  phoenix: { uid: "cometchat-uid-4", name: "Phoenix Baker", initials: "PB", avatar: "https://i.pravatar.cc/96?img=33", online: false, lastSeen: "Yesterday at 6:40 pm" },
  lana: { uid: "cometchat-uid-5", name: "Lana Steiner", initials: "LS", avatar: "https://i.pravatar.cc/96?img=5", online: false, lastSeen: "Yesterday at 9:15 pm" },
  andi: { uid: "cometchat-uid-7", name: "Andi Lane", initials: "AL", avatar: "https://i.pravatar.cc/96?img=64", online: false, lastSeen: "Today at 8:30 am" },
} satisfies Record<string, Person>;

const WATCH = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
const WATCH2 = "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80";
const BEACH = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";

export const conversations: Conversation[] = [
  { id: "c1", kind: "group", title: "Hiking Group", initials: "HG", avatar: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=96&q=80", groupType: "Private", memberCount: 5, onlineCount: 2, unread: 24, lastSenderName: "Jason Roy", lastPreview: "Lorem ipsum do...", time: "4:30 PM", tags: ["support", "priority"], online: true },
  { id: "c2", kind: "group", title: "Road Trip", initials: "RT", avatar: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=96&q=80", groupType: "Public", memberCount: 12, lastSenderName: "Sam", lastPreview: "Lorem ipsum dolor sit amet...", time: "4:30 PM" },
  { id: "c3", kind: "group", title: "Epic Game", initials: "EG", avatar: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=96&q=80", groupType: "Protected", memberCount: 8, lastSenderName: "John Paul", lastPreview: "Lorem ipsum dolor sit...", time: "4:30 PM" },
  { id: "c4", kind: "user", title: "Olivia Rhye & Alec Whitten", initials: "OA", avatar: A.olivia.avatar, avatarB: A.alec.avatar, lastSenderName: "Melisa Paul", lastPreview: "Lorem ipsum...", time: "4:30 PM" },
];

export const people = A;

// ---- 1:1 conversation (Olivia & Alec) ----
export const oneToOneHeader = { title: "Olivia Rhye & Alec Whitten", members: 2, online: 1, messages: 4, avatar: A.olivia.avatar, avatarB: A.alec.avatar, initials: "OA" };

export interface ConversationDetail {
  conversationId: string;
  conversationType: "user" | "group";
  groupName?: string;
  groupType?: GroupType;
  owner?: string;
  members: number;
  messages: number;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const oneToOneConversationDetail: ConversationDetail = {
  conversationId: "conv-4", conversationType: "user",
  members: 2, messages: 5, unreadCount: 0,
  createdAt: "4 Dec 2025, 15:30", updatedAt: "10 Mar 2026, 20:02",
  tags: ["support", "priority"],
};

export const groupConversationDetail: ConversationDetail = {
  conversationId: "conv-1", conversationType: "group",
  groupName: "Hiking Group", groupType: "Private", owner: "Alec Whitten",
  members: 5, messages: 8, unreadCount: 24,
  createdAt: "20 Nov 2025, 14:30", updatedAt: "10 Mar 2026, 16:45",
  tags: ["recreation", "weekend"],
};

const textDetail = (id: string, time: string, date = "2026-05-04"): MessageDetail => ({
  messageId: id, category: "Message", type: "Text", delivery: "Delivered",
  sentAt: { date, time }, updatedAt: { date, time },
});

export const oneToOneMessages: Message[] = [
  { id: "m1", sender: A.olivia, divider: "Yesterday", text: "Sharing the latest mocks here so everyone has context.", time: "5:00 pm", type: "text", detail: textDetail("msg_01HP4F3Z10", "17:00") },
  { id: "m2", sender: A.alec, text: "Okay", time: "5:20 pm", type: "text", detail: textDetail("msg_01HP4F3Z11", "17:20") },
  {
    id: "m3", sender: A.olivia, time: "6:00 pm", type: "image",
    media: [{ kind: "image", src: WATCH }],
    reactions: [{ emoji: "😍", count: 1 }],
    detail: { messageId: "msg_01HP4F3Z2K", category: "Message", type: "Image", delivery: "Delivered", sentAt: { date: "2026-05-04", time: "18:12" }, updatedAt: { date: "2026-05-04", time: "18:12" } },
  },
  {
    id: "m5", sender: A.olivia, text: "It's ₹7,999", time: "4:56 pm", type: "text", detail: textDetail("msg_01HP4F3Z15", "16:56"),
    replies: [
      { id: "m5r1", sender: A.alec, text: "That's a great price for it.", time: "4:57 pm", type: "text", detail: textDetail("msg_01HP4F3Z16", "16:57") },
      { id: "m5r2", sender: A.olivia, text: "Right? I'm grabbing one now.", time: "4:58 pm", type: "text", detail: textDetail("msg_01HP4F3Z17", "16:58") },
      { id: "m5r3", sender: A.alec, text: "Send me the link when you can.", time: "5:00 pm", type: "text", detail: textDetail("msg_01HP4F3Z18", "17:00") },
      { id: "m5r4", sender: A.olivia, text: "Sent 👍", time: "5:01 pm", type: "text", detail: textDetail("msg_01HP4F3Z19", "17:01") },
    ],
  },
  {
    id: "m4", sender: A.alec, time: "6:05 pm", type: "video",
    media: [{ kind: "video", src: WATCH, duration: "0:24" }, { kind: "video", src: WATCH2, duration: "0:18" }],
    moderation: { status: "flagged", violationType: "profanity-filter", reasonLabel: "Sexual Content", reason: "Potentially sensitive media", reportedBy: "auto-moderator" },
    detail: { messageId: "msg_01HP4F3Z3B", category: "Message", type: "Video", delivery: "Delivered", sentAt: { date: "2026-05-04", time: "18:15" }, updatedAt: { date: "2026-05-04", time: "18:15" } },
  },
];

// ---- Group conversation (Hiking Group) ----
export const groupHeader = { title: "Hiking Group", groupType: "Private" as GroupType, members: 5, online: 2, messages: 7, avatar: conversations[0].avatar, initials: "HG" };

const gGeorge: Person = { ...A.george, role: "Admin" };
const gOlivia: Person = { ...A.olivia, role: "Moderator" };
const gPhoenix: Person = { ...A.phoenix, role: "Member" };
const gLana: Person = { ...A.lana, role: "Member" };
const gAndi: Person = { ...A.andi, role: "Member" };

const V1 = "https://i.pravatar.cc/40?img=8";
const V2 = "https://i.pravatar.cc/40?img=52";
const V3 = "https://i.pravatar.cc/40?img=25";

export const groupMessages: Message[] = [
  { id: "g1", sender: gGeorge, divider: "Yesterday", text: "Morning team — quick design review at 11. I want to walk through the empty state for the new analytics dashboard before it ships.", time: "4:56 pm", edited: true, editedTime: "4:56 pm", type: "text", detail: { messageId: "msg_01HP4F3Z20", category: "Message", type: "Text", delivery: "Delivered", sentAt: { date: "2026-05-04", time: "16:52" }, updatedAt: { date: "2026-05-04", time: "16:56" } } },
  { id: "g2", sender: gOlivia, text: "Sharing the latest mocks here so everyone has context.", time: "5:00 pm", type: "text", detail: textDetail("msg_01HP4F3Z21", "17:00") },
  { id: "g3", sender: gPhoenix, text: "Okay", time: "5:20 pm", type: "text", detail: textDetail("msg_01HP4F3Z22", "17:20") },
  {
    id: "g4", sender: gOlivia, time: "6:00 pm", type: "image",
    media: [{ kind: "image", src: WATCH }],
    detail: { messageId: "msg_01HP4F3Z2K", category: "Message", type: "Image", delivery: "Delivered", sentAt: { date: "2026-05-04", time: "18:12" }, updatedAt: { date: "2026-05-04", time: "18:12" } },
  },
  {
    id: "g5", sender: gLana, time: "6:12 pm", type: "image",
    media: [{ kind: "image", src: BEACH }],
    reactions: [{ emoji: "😍", count: 2 }, { emoji: "🔥", count: 1 }, { emoji: "👍", count: 1 }],
    reactors: [
      { person: gGeorge, emoji: "😍" },
      { person: gOlivia, emoji: "🔥" },
      { person: gAndi, emoji: "👍" },
    ],
    moderation: { status: "flagged", violationType: "image-moderation", reasonLabel: "Sexual Content", reason: "Flagged by image moderation", reportedBy: "auto-moderator" },
    detail: { messageId: "msg_01HP4F3Z9Q", category: "Message", type: "Image", delivery: "Delivered", sentAt: { date: "2026-05-04", time: "18:20" }, updatedAt: { date: "2026-05-04", time: "18:20" } },
  },
  {
    id: "g6", sender: gAndi, time: "5:20 pm", type: "text", text: "Hate speech content will come here.",
    moderation: { status: "blocked", violationType: "hate-speech", reasonLabel: "Hate Message", reason: "Hate speech detected", reportedBy: "auto-moderator" },
    detail: { messageId: "msg_01HP4F3ZA1", category: "Message", type: "Text", delivery: "Delivered", sentAt: { date: "2026-05-05", time: "17:20" }, updatedAt: { date: "2026-05-05", time: "17:20" } },
  },
  {
    id: "g7", sender: gLana, divider: "Today", time: "13:12 pm", type: "poll",
    poll: {
      question: "How do you prefer to shop?",
      totalVotes: 7,
      options: [
        { label: "Online", voters: [V1, V2, V3], percent: 43, checked: false },
        { label: "In-store", voters: [V2, V3, V1], extra: 4, percent: 57, checked: true },
      ],
    },
    detail: { messageId: "msg_01HP4F3ZB2", category: "Message", type: "Poll", delivery: "Delivered", sentAt: { date: "2026-05-05", time: "13:12" }, updatedAt: { date: "2026-05-05", time: "13:12" } },
  },
  {
    id: "g8", sender: gLana, text: "Anyone up for the summit hike this weekend?", time: "1:20 pm", type: "text", detail: textDetail("msg_01HP4F3ZC0", "13:20", "2026-05-05"),
    replies: [
      { id: "g8r1", sender: gGeorge, text: "I'm in! 🥾", time: "1:22 pm", type: "text", detail: textDetail("msg_01HP4F3ZC1", "13:22", "2026-05-05") },
      { id: "g8r2", sender: gOlivia, text: "Same here — what time are we starting?", time: "1:23 pm", type: "text", detail: textDetail("msg_01HP4F3ZC2", "13:23", "2026-05-05") },
      { id: "g8r3", sender: gPhoenix, text: "7am at the trailhead works for me.", time: "1:25 pm", type: "text", detail: textDetail("msg_01HP4F3ZC3", "13:25", "2026-05-05") },
    ],
  },
];

export const groupMembers: Person[] = [
  { ...A.alec, role: "Owner", online: true },
  { ...A.george, role: "Admin", online: false },
  { ...A.olivia, role: "Moderator", online: true },
  { ...A.andi, role: "Member" },
  { ...A.lana, role: "Member" },
];

export const IMAGE_PREVIEW = BEACH.replace("w=600", "w=1000");
export const VIDEO_PREVIEW = WATCH.replace("w=400", "w=900");
