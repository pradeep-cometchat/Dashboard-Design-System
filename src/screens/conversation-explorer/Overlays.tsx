import React from "react";
import { CloseOutlined, PlayCircleFilled } from "@ant-design/icons";
import CometChatButton from "components/base/Button/CometChatButton";
import CometChatSlider from "components/base/Slider/CometChatSlider";
import { c, s, r, font } from "./theme";

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      {/* translucent + blurred dim so the workspace shows through behind */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,18,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} onClick={onClose} />
      <span style={{ position: "absolute", top: s.xl, right: s.xl, zIndex: 22 }}>
        <CometChatButton hierarchy="tertiary" iconOnly ariaLabel="Close preview" iconLeading={<CloseOutlined style={{ color: c.white }} />} onClick={onClose} />
      </span>
      <div style={{ position: "relative", zIndex: 21 }}>{children}</div>
    </div>
  );
}

export function ImageOverlay({ src, onClose }: { src: string; onClose?: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <img src={src} alt="" style={{ maxWidth: 640, maxHeight: 640, borderRadius: r.lg, display: "block", objectFit: "cover" }} />
    </Backdrop>
  );
}

export function VideoOverlay({ src, duration = "0:24", thumbnails = [], onClose }: { src: string; duration?: string; thumbnails?: string[]; onClose?: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div style={{ width: 520, borderRadius: r.xl, overflow: "hidden", background: "var(--neutral-lm-950)" }}>
        <div style={{ position: "relative", height: 520 }}>
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlayCircleFilled style={{ fontSize: 56, color: c.white, opacity: 0.95 }} />
          </span>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: s.lg, display: "flex", alignItems: "center", gap: s.md }}>
            <span style={{ ...font.captionReg, color: c.white }}>00:00</span>
            <div style={{ flex: 1 }}><CometChatSlider defaultValue={40} tooltip={{ open: false }} /></div>
            <span style={{ ...font.captionReg, color: c.white }}>{duration}</span>
          </div>
        </div>
      </div>
      {thumbnails.length > 0 && (
        <div style={{ display: "flex", gap: s.sm, justifyContent: "center", marginTop: s.lg }}>
          {thumbnails.map((t, i) => (
            <span key={i} style={{ position: "relative", width: 56, height: 56, borderRadius: r.md, overflow: "hidden", border: `2px solid ${i === 0 ? c.white : "transparent"}` }}>
              <img src={t} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
          ))}
        </div>
      )}
    </Backdrop>
  );
}
