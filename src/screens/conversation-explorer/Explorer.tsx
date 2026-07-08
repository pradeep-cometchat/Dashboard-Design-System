import React from "react";
import { Workspace, ConversationEmpty } from "./Workspace";
import { ConversationList } from "./ConversationList";
import { ChatView } from "./ChatView";
import { MessageDetails, DetailsEmpty } from "./DetailsPanel";
import { ImageOverlay, VideoOverlay } from "./Overlays";
import type { Conversation, Message, Person, GroupType } from "./data";

export interface ExplorerProps {
  conversations: Conversation[];
  /** The conversation whose messages/members are wired up in this demo. */
  flowConversationId: string;
  header: { title: string; groupType?: GroupType; members: number; online: number; messages: number; avatar?: string; initials: string };
  messages: Message[];
  members: Person[];
  searchPlaceholder?: string;
  initialConversationId?: string;
  initialMessageId?: string;
  initialOverlay?: { type: "image" | "video"; src: string; duration?: string; thumbnails?: string[] };
  exportVariant?: "single" | "csv-json";
  initialSearchOpen?: boolean;
  initialThreadId?: string;
  initialFilterOpen?: boolean;
}

/** Stateful Conversation Explorer — drives selection + media overlays for the stories. */
export function Explorer(props: ExplorerProps) {
  const [convId, setConvId] = React.useState(props.initialConversationId);
  const [msg, setMsg] = React.useState<Message | undefined>(
    props.messages.find((m) => m.id === props.initialMessageId)
  );
  const [overlay, setOverlay] = React.useState(props.initialOverlay);
  const [thread, setThread] = React.useState<Message | undefined>(
    props.messages.find((m) => m.id === props.initialThreadId)
  );

  const openMedia = (m: Message) => {
    setMsg(m);
    const first = m.media?.[0];
    if (!first) return;
    if (first.kind === "video") {
      setOverlay({ type: "video", src: first.src, duration: first.duration, thumbnails: m.media!.map((x) => x.src) });
    } else {
      setOverlay({ type: "image", src: first.src });
    }
  };

  const active = convId === props.flowConversationId;

  const center = active
    ? <ChatView header={props.header} messages={props.messages} selectedMessageId={msg?.id} onSelectMessage={setMsg} onOpenMedia={openMedia} initialSearchOpen={props.initialSearchOpen} thread={thread} onOpenThread={setThread} onCloseThread={() => setThread(undefined)} />
    : <ConversationEmpty />;

  const right = active && msg
    ? <MessageDetails message={msg} members={props.members} exportVariant={props.exportVariant} onOpenMedia={openMedia} receiverType={props.header.groupType ? "Group" : "User"} />
    : <DetailsEmpty />;

  const overlayNode = overlay
    ? overlay.type === "image"
      ? <ImageOverlay src={overlay.src} onClose={() => setOverlay(undefined)} />
      : <VideoOverlay src={overlay.src} duration={overlay.duration} thumbnails={overlay.thumbnails} onClose={() => setOverlay(undefined)} />
    : undefined;

  return (
    <Workspace
      left={<ConversationList conversations={props.conversations} selectedId={convId} onSelect={setConvId} searchPlaceholder={props.searchPlaceholder} initialFilterOpen={props.initialFilterOpen} />}
      center={center}
      right={right}
      overlay={overlayNode}
    />
  );
}
