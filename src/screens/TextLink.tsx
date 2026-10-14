// Text link with an arrow-up-right — shared by the dashboard screens (Audit Logs
// section link, Call Settings migration guide). Body medium (14/20), brand colour,
// underlined; hover and focus states in text-link.scss. With `href` it's an anchor
// that opens in a new tab; otherwise a button.
import React from "react";
import { font } from "./theme";
import { dim } from "./pin/ui";
// Untitled UI "arrow-up-right" — the dashboard's external-link glyph.
import { ArrowUpRight } from "./conversation-explorer/icons";
import "./text-link.scss";

const TYPE: React.CSSProperties = {
  fontFamily: font.bodyMd.fontFamily,
  fontSize: font.bodyMd.fontSize,
  lineHeight: font.bodyMd.lineHeight,
  fontWeight: "var(--font-weight-medium)" as unknown as number,
};

export default function TextLink({ children, href, onClick, ariaLabel }: { children: React.ReactNode; href?: string; onClick?: () => void; ariaLabel?: string }) {
  const content = (
    <>
      {children}
      <ArrowUpRight size={dim.iconSm} />
    </>
  );
  return href ? (
    <a className="cc-text-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} style={TYPE}>
      {content}
    </a>
  ) : (
    <button type="button" className="cc-text-link" onClick={onClick} aria-label={ariaLabel} style={TYPE}>
      {content}
    </button>
  );
}
