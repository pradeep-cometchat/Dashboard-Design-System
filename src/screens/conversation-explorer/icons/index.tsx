// Untitled UI line icons exported from the Figma design (stroke-based).
// Rendered with `stroke="currentColor"` so the parent's text color / token drives them.
import React from "react";

type P = { size?: number; className?: string; style?: React.CSSProperties };
const base = (size: number, style?: React.CSSProperties): React.CSSProperties => ({ display: "block", width: size, height: size, ...style });

export function SearchLg({ size = 20, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterLines({ size = 20, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Lock01({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8.5 5V4C8.5 2.61929 7.38071 1.5 6 1.5C4.61929 1.5 3.5 2.61929 3.5 4V5M6 7.25V8.25M4.4 10.5H7.6C8.44008 10.5 8.86012 10.5 9.18099 10.3365C9.46323 10.1927 9.6927 9.96323 9.83651 9.68099C10 9.36012 10 8.94008 10 8.1V7.4C10 6.55992 10 6.13988 9.83651 5.81901C9.6927 5.53677 9.46323 5.3073 9.18099 5.16349C8.86012 5 8.44008 5 7.6 5H4.4C3.55992 5 3.13988 5 2.81901 5.16349C2.53677 5.3073 2.3073 5.53677 2.16349 5.81901C2 6.13988 2 6.55992 2 7.4V8.1C2 8.94008 2 9.36012 2.16349 9.68099C2.3073 9.96323 2.53677 10.1927 2.81901 10.3365C3.13988 10.5 3.55992 10.5 4.4 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Globe02({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 1C7.25064 2.36918 7.96138 4.14602 8 6C7.96138 7.85398 7.25064 9.63082 6 11M6 1C4.74936 2.36918 4.03862 4.14602 4 6C4.03862 7.85398 4.74936 9.63082 6 11M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11M6 1C8.76142 1 11 3.23858 11 6C11 8.76142 8.76142 11 6 11M1.25001 4.5H10.75M1.25 7.5H10.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Shield01({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5.65101 10.8074C5.7617 10.872 5.81705 10.9043 5.89516 10.9211C5.95578 10.9341 6.04422 10.9341 6.10484 10.9211C6.18295 10.9043 6.2383 10.872 6.349 10.8074C7.32302 10.2392 10 8.45422 10 6V3.6088C10 3.20904 10 3.00917 9.93462 2.83735C9.87686 2.68557 9.78301 2.55014 9.66117 2.44277C9.52325 2.32122 9.3361 2.25104 8.9618 2.11067L6.2809 1.10534C6.17695 1.06636 6.12498 1.04687 6.07151 1.03914C6.02408 1.03229 5.97592 1.03229 5.92849 1.03914C5.87502 1.04687 5.82305 1.06636 5.7191 1.10534L3.0382 2.11067C2.6639 2.25104 2.47675 2.32122 2.33883 2.44277C2.21699 2.55014 2.12314 2.68557 2.06538 2.83735C2 3.00917 2 3.20904 2 3.6088V6C2 8.45422 4.67698 10.2392 5.65101 10.8074Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusCircle({ size = 16, style }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 5.333V10.667M5.333 8H10.667M14.667 8C14.667 11.682 11.682 14.667 8 14.667C4.318 14.667 1.333 11.682 1.333 8C1.333 4.318 4.318 1.333 8 1.333C11.682 1.333 14.667 4.318 14.667 8Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XClose({ size = 16, style }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CornerDownRight({ size = 16, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 5v3.5A2.5 2.5 0 0 0 7.5 11H15m0 0l-3.333-3.333M15 11l-3.333 3.333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Flag02({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M2 7.5C2 7.5 2.5 7 4 7C5.5 7 6.5 8 8 8C9.5 8 10 7.5 10 7.5V2C10 2 9.5 2.5 8 2.5C6.5 2.5 5.5 1.5 4 1.5C2.5 1.5 2 2 2 2M2 11L2 1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageTextCircle02({ size = 24, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 9.5H12M8 13H15M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.1971 3.23374 14.3397 3.65806 15.3845C3.73927 15.5845 3.77988 15.6845 3.798 15.7653C3.81572 15.8443 3.8222 15.9028 3.82221 15.9839C3.82222 16.0667 3.80718 16.1569 3.77711 16.3374L3.18413 19.8952C3.12203 20.2678 3.09098 20.4541 3.14876 20.5888C3.19933 20.7067 3.29328 20.8007 3.41118 20.8512C3.54589 20.909 3.73218 20.878 4.10476 20.8159L7.66265 20.2229C7.84309 20.1928 7.9333 20.1778 8.01613 20.1778C8.09715 20.1778 8.15566 20.1843 8.23472 20.202C8.31554 20.2201 8.41552 20.2607 8.61549 20.3419C9.6603 20.7663 10.8029 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Database01({ size = 24, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5M21 5C21 3.34315 16.9706 2 12 2C7.02944 2 3 3.34315 3 5M21 5V19C21 20.66 17 22 12 22C7 22 3 20.66 3 19V5M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Copy06({ size = 14, style }: P) {
  return (
    <svg viewBox="0 0 14 14" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4.375 1.75H8.51667C9.82346 1.75 10.4768 1.75 10.976 2.00432C11.415 2.22802 11.772 2.58498 11.9957 3.02402C12.25 3.52315 12.25 4.17654 12.25 5.48333V9.625M3.61667 12.25H8.34167C8.99506 12.25 9.32176 12.25 9.57132 12.1228C9.79084 12.011 9.96932 11.8325 10.0812 11.613C10.2083 11.3634 10.2083 11.0367 10.2083 10.3833V5.65833C10.2083 5.00494 10.2083 4.67824 10.0812 4.42868C9.96932 4.20916 9.79084 4.03068 9.57132 3.91883C9.32176 3.79167 8.99506 3.79167 8.34167 3.79167H3.61667C2.96327 3.79167 2.63657 3.79167 2.38701 3.91883C2.16749 4.03068 1.98901 4.20916 1.87716 4.42868C1.75 4.67824 1.75 5.00494 1.75 5.65833V10.3833C1.75 11.0367 1.75 11.3634 1.87716 11.613C1.98901 11.8325 2.16749 12.011 2.38701 12.1228C2.63657 12.25 2.96327 12.25 3.61667 12.25Z" stroke="currentColor" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Image01({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8.1 10.5H3.46569C3.16278 10.5 3.01132 10.5 2.94119 10.4401C2.88034 10.3881 2.84805 10.3102 2.85432 10.2304C2.86156 10.1384 2.96865 10.0313 3.18284 9.81716L7.43431 5.56569C7.63232 5.36768 7.73133 5.26867 7.84549 5.23158C7.94591 5.19895 8.05409 5.19895 8.15451 5.23158C8.26867 5.26867 8.36768 5.36768 8.56568 5.56568L10.5 7.5V8.1M8.1 10.5C8.94008 10.5 9.36012 10.5 9.68099 10.3365C9.96323 10.1927 10.1927 9.96323 10.3365 9.68099C10.5 9.36012 10.5 8.94008 10.5 8.1M8.1 10.5H3.9C3.05992 10.5 2.63988 10.5 2.31901 10.3365C2.03677 10.1927 1.8073 9.96323 1.66349 9.68099C1.5 9.36012 1.5 8.94008 1.5 8.1V3.9C1.5 3.05992 1.5 2.63988 1.66349 2.31901C1.8073 2.03677 2.03677 1.8073 2.31901 1.66349C2.63988 1.5 3.05992 1.5 3.9 1.5H8.1C8.94008 1.5 9.36012 1.5 9.68099 1.66349C9.96323 1.8073 10.1927 2.03677 10.3365 2.31901C10.5 2.63988 10.5 3.05992 10.5 3.9V8.1M5.25 4.25C5.25 4.80228 4.80228 5.25 4.25 5.25C3.69772 5.25 3.25 4.80228 3.25 4.25C3.25 3.69772 3.69772 3.25 4.25 3.25C4.80228 3.25 5.25 3.69772 5.25 4.25Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarCheck02({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10.5 5H1.5M10.5 6.25V4.4C10.5 3.55992 10.5 3.13988 10.3365 2.81901C10.1927 2.53677 9.96323 2.3073 9.68099 2.16349C9.36012 2 8.94008 2 8.1 2H3.9C3.05992 2 2.63988 2 2.31901 2.16349C2.03677 2.3073 1.8073 2.53677 1.66349 2.81901C1.5 3.13988 1.5 3.55992 1.5 4.4V8.6C1.5 9.44008 1.5 9.86012 1.66349 10.181C1.8073 10.4632 2.03677 10.6927 2.31901 10.8365C2.63988 11 3.05992 11 3.9 11H6M8 1V3M4 1V3M7.25 9.5L8.25 10.5L10.5 8.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Clock({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Expand01({ size = 20, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M11.6667 8.33333L17.5 2.5M17.5 7.5V2.5H12.5M8.33333 11.6667L2.5 17.5M2.5 12.5L2.5 17.5H7.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ size = 20, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 15L15 5M15 11.6667V5H8.33333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUp({ size = 24, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ size = 24, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Download01({ size = 20, style }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Untitled UI "featured icon" — 48px white rounded box, border-dark + shadow-xs + skeuomorphic inset. */
export function FeaturedIcon({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      width: 48, height: 48, display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius-lg)", background: "var(--bg-primary)", border: "1px solid var(--border-dark)",
      color: "var(--text-secondary)",
      boxShadow: "var(--shadow-xs), inset 0px -2px 0px 0px rgba(10,13,18,0.05), inset 0px 0px 0px 1px rgba(10,13,18,0.18)",
    }}>
      {children}
    </span>
  );
}

export function Users03({ size = 12, style }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={base(size, style)} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9 7.91844C9.72795 8.28413 10.3521 8.87098 10.8076 9.60481C10.8978 9.75014 10.9429 9.8228 10.9585 9.92342C10.9902 10.1279 10.8504 10.3793 10.66 10.4602C10.5663 10.5 10.4608 10.5 10.25 10.5M8 5.76612C8.74086 5.39794 9.25 4.63343 9.25 3.75C9.25 2.86657 8.74086 2.10206 8 1.73388M7 3.75C7 4.99264 5.99264 6 4.75 6C3.50736 6 2.5 4.99264 2.5 3.75C2.5 2.50736 3.50736 1.5 4.75 1.5C5.99264 1.5 7 2.50736 7 3.75ZM1.27962 9.46917C2.07677 8.27228 3.33469 7.5 4.75 7.5C6.16531 7.5 7.42323 8.27228 8.22038 9.46917C8.39502 9.73138 8.48234 9.86248 8.47228 10.03C8.46446 10.1604 8.37898 10.32 8.27478 10.3988C8.14096 10.5 7.95691 10.5 7.58882 10.5H1.91118C1.54309 10.5 1.35904 10.5 1.22522 10.3988C1.12102 10.32 1.03554 10.1604 1.02772 10.03C1.01766 9.86248 1.10498 9.73138 1.27962 9.46917Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
