import React from "react";

interface DoodleProps {
  size?: number;
  className?: string;
}

/**
 * 🍓 Strawberry Doodle (Mac OS Apple / System Logo)
 */
export function DoodleStrawberry({ size = 20, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Strawberry Body */}
      <path
        d="M12 21.5 C7 21 3.5 15.5 4.5 10.5 C5.2 6.8 8.5 5.8 12 6.2 C15.5 5.8 18.8 6.8 19.5 10.5 C20.5 15.5 17 21 12 21.5 Z"
        fill="#ff7597"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Green Stem and Leaf Calyx */}
      <path
        d="M12 6.2 C12 3.8 12.8 1.8 13.5 1.5"
        stroke="#27ae60"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.5 4.8 C10 6.5 12 6.8 12 6.8 C12 6.8 14 6.5 15.5 4.8 C17 6.8 18.5 6.8 18.5 6.8 C16.5 8.5 14 8.5 12 8.5 C10 8.5 7.5 8.5 5.5 6.8 C5.5 6.8 7 6.8 8.5 4.8 Z"
        fill="#6ee7b7"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Kawaii Face */}
      <circle cx="9" cy="12.5" r="1.1" fill="#3d324c" />
      <circle cx="15" cy="12.5" r="1.1" fill="#3d324c" />
      <path
        d="M11 14.5 C11.5 15.3 12.5 15.3 13 14.5"
        stroke="#3d324c"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Blushing Cheeks */}
      <circle cx="7.2" cy="13.5" r="1.2" fill="#ff4d79" />
      <circle cx="16.8" cy="13.5" r="1.2" fill="#ff4d79" />
      {/* Seeds */}
      <ellipse cx="12" cy="10.5" rx="0.6" ry="0.9" fill="#fff5b8" />
      <ellipse cx="9.5" cy="17.5" rx="0.6" ry="0.9" fill="#fff5b8" />
      <ellipse cx="14.5" cy="17.5" rx="0.6" ry="0.9" fill="#fff5b8" />
      <ellipse cx="12" cy="19" rx="0.5" ry="0.8" fill="#fff5b8" />
    </svg>
  );
}

/**
 * ✨ Sparkles Doodle (Magic Glitter / Starbursts)
 */
export function DoodleSparkles({ size = 18, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Big Center Sparkle */}
      <path
        d="M13 2.5 C13 7.5 16.5 8.8 20.5 9 C16.5 9.2 13 10.5 13 15.5 C13 10.5 9.5 9.2 5.5 9 C9.5 8.8 13 7.5 13 2.5 Z"
        fill="#ffd166"
        stroke="#3d324c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Small Secondary Sparkle */}
      <path
        d="M6 14.5 C6 17 7.8 17.6 9.8 17.8 C7.8 18 6 18.6 6 21 C6 18.6 4.2 18 2.2 17.8 C4.2 17.6 6 17 6 14.5 Z"
        fill="#ff9ebb"
        stroke="#3d324c"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Star Cross & Dot Details */}
      <circle cx="19" cy="18" r="1.3" fill="#a0e7e5" stroke="#3d324c" strokeWidth="1" />
      <line x1="19" y1="15" x2="19" y2="21" stroke="#3d324c" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="18" x2="22" y2="18" stroke="#3d324c" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.2" fill="#ffd166" />
    </svg>
  );
}

/**
 * 🎀 Bow Ribbon Doodle (Kawaii Ribbon)
 */
export function DoodleBow({ size = 16, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Left Loop */}
      <path
        d="M10.5 10.5 C8 7 3.5 6.5 2.6 10 C1.8 13.5 6.2 14.2 9.8 12.2 Z"
        fill="#ffb4d6"
        stroke="#3d324c"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Right Loop */}
      <path
        d="M13.5 10.5 C16 7 20.5 6.5 21.4 10 C22.2 13.5 17.8 14.2 14.2 12.2 Z"
        fill="#ffb4d6"
        stroke="#3d324c"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Left Tail */}
      <path
        d="M10 13 C8.8 16.2 6.8 19.5 4.8 21.5 C7 19.8 8.8 20 10.6 20.2 C11.2 17.8 11.6 15.2 11.6 13.5 Z"
        fill="#ffa0cb"
        stroke="#3d324c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Right Tail */}
      <path
        d="M14 13 C15.2 16.2 17.2 19.5 19.2 21.5 C17 19.8 15.2 20 13.4 20.2 C12.8 17.8 12.4 15.2 12.4 13.5 Z"
        fill="#ffa0cb"
        stroke="#3d324c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Center Knot */}
      <ellipse
        cx="12"
        cy="11.5"
        rx="2.5"
        ry="2.2"
        fill="#ff82b8"
        stroke="#3d324c"
        strokeWidth="1.7"
      />
      {/* Inner Ribbon Folds */}
      <path d="M5.5 9.5 C7 10.5 8.5 11 10 11" stroke="#ff6b9d" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18.5 9.5 C17 10.5 15.5 11 14 11" stroke="#ff6b9d" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 🌸 Sakura Blossom Doodle (Cherry Blossom)
 */
export function DoodleBlossom({ size = 18, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* 5 Petals */}
      {/* Top Petal */}
      <path
        d="M10.2 9.5 C9 6 9.6 3.8 11.2 3.2 C11.8 3.7 12 4.2 12 4.2 C12 4.2 12.2 3.7 12.8 3.2 C14.4 3.8 15 6 13.8 9.5 Z"
        fill="#ffcae3"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Top Right Petal */}
      <path
        d="M13.5 10.5 C16.5 8.5 18.8 8.2 19.8 9.6 C19.5 10.3 19.1 10.6 19.1 10.6 C19.1 10.6 19.6 10.9 20.1 11.4 C19.8 13.1 17.8 14.2 14.2 13.5 Z"
        fill="#ffd4e9"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Bottom Right Petal */}
      <path
        d="M13.2 13.8 C15 16.8 15.8 19 14.5 20.2 C13.7 19.8 13.3 19.4 13.3 19.4 C13.3 19.4 13.1 19.9 12.5 20.4 C11 19.8 10.2 17.8 11.5 14.2 Z"
        fill="#ffcae3"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Bottom Left Petal */}
      <path
        d="M10.8 13.8 C9 16.8 7.2 18.2 5.8 17.2 C6.2 16.5 6.5 16.2 6.5 16.2 C6.5 16.2 6 15.8 5.4 15.4 C5.5 13.8 7.2 12.5 10.5 13 Z"
        fill="#ffd4e9"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Top Left Petal */}
      <path
        d="M10.5 10.5 C7.5 8.5 5.2 8.2 4.2 9.6 C4.5 10.3 4.9 10.6 4.9 10.6 C4.9 10.6 4.4 10.9 3.9 11.4 C4.2 13.1 6.2 14.2 9.8 13.5 Z"
        fill="#ffcae3"
        stroke="#3d324c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Center Pistil with Cute Kawaii Face */}
      <circle cx="12" cy="12" r="3.2" fill="#ffeaa7" stroke="#3d324c" strokeWidth="1.5" />
      <circle cx="11" cy="11.5" r="0.6" fill="#3d324c" />
      <circle cx="13" cy="11.5" r="0.6" fill="#3d324c" />
      <path d="M11.5 12.8 C11.8 13.3 12.2 13.3 12.5 12.8" stroke="#3d324c" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="10" cy="12.2" r="0.5" fill="#ff7675" />
      <circle cx="14" cy="12.2" r="0.5" fill="#ff7675" />
    </svg>
  );
}

/**
 * ♡ Heart Doodle (Window Close Button)
 */
export function DoodleHeart({ size = 14, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M12 21 C11 20 3.5 14.5 3 9.5 C2.4 5.5 5.5 2.8 9 3.5 C10.6 3.8 11.5 5 12 6 C12.5 5 13.4 3.8 15 3.5 C18.5 2.8 21.6 5.5 21 9.5 C20.5 14.5 13 20 12 21 Z"
        fill="#ff7ba5"
        stroke="#3d324c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight Shine */}
      <path
        d="M6.2 7.5 C6.8 5.6 8.2 4.8 9.8 5"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * + Zoom Plus Doodle (Window Zoom Button)
 */
export function DoodleZoomPlus({ size = 12, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M12 5.5 L12 18.5 M5.5 12 L18.5 12"
        stroke="#3d324c"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 🎉 Party Popper Doodle (Confetti Button Prototype Icon)
 */
export function DoodlePopper({ size = 26, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Cone Body */}
      <path
        d="M4.5 20.5 L2.5 18.5 C3.5 16 6.8 9.5 8.5 8.5 L15.5 15.5 C14.5 17.2 8 20.5 4.5 20.5 Z"
        fill="#fed330"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Cone Striped Pattern */}
      <path d="M5.5 15.5 L11.5 12" stroke="#ff6b81" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M9 19 L14 15.5" stroke="#2ed573" strokeWidth="2.5" strokeLinecap="round" />
      {/* Confetti Blasting Out */}
      <rect
        x="18"
        y="4"
        width="3"
        height="3"
        rx="0.5"
        fill="#ff6b81"
        stroke="#3d324c"
        strokeWidth="1.1"
        transform="rotate(25 19.5 5.5)"
      />
      <rect
        x="12"
        y="2.5"
        width="2.8"
        height="2.8"
        rx="0.5"
        fill="#70a1ff"
        stroke="#3d324c"
        strokeWidth="1.1"
        transform="rotate(-15 13.4 3.9)"
      />
      <circle cx="21.5" cy="11.5" r="1.5" fill="#ffa502" stroke="#3d324c" strokeWidth="1.1" />
      <circle cx="10" cy="4.5" r="1.3" fill="#a29bfe" stroke="#3d324c" strokeWidth="1" />
      {/* Streamer Ribbons */}
      <path
        d="M12 8 C14 6 16 8 18 6 C19.5 4.8 20.8 5 21.8 3.5"
        stroke="#ff4757"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 13 C17 13 18.2 15 20 15 C21 15 21.8 14.2 22.8 13.5"
        stroke="#2ed573"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Tiny Gold Star */}
      <path
        d="M15.5 1.5 L16 3 L17.5 3.5 L16 4 L15.5 5.5 L15 4 L13.5 3.5 L15 3 Z"
        fill="#ffd32a"
        stroke="#3d324c"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/**
 * 📁 Folder Doodle (Masters Work / File Prototype Icon)
 */
export function DoodleFolder({ size = 26, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Back Folder with Tab */}
      <path
        d="M2.5 6 C2.5 4.6 3.6 3.5 5 3.5 L9 3.5 C10 3.5 10.8 4.2 11.4 5.1 L12.2 6.5 L19 6.5 C20.4 6.5 21.5 7.6 21.5 9 L21.5 18 C21.5 19.4 20.4 20.5 19 20.5 L5 20.5 C3.6 20.5 2.5 19.4 2.5 18 Z"
        fill="#e6d5f7"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* White Sheet of Paper Peeking Out */}
      <path
        d="M5.5 6.8 L18.5 6.8 C19 6.8 19.5 7.3 19.5 7.8 L19.5 12 L4.5 12 L4.5 7.8 C4.5 7.3 5 6.8 5.5 6.8 Z"
        fill="#ffffff"
        stroke="#3d324c"
        strokeWidth="1.4"
      />
      {/* Front Folder Flap */}
      <path
        d="M2.5 10 C2.5 8.9 3.4 8 4.5 8 L19.5 8 C20.6 8 21.5 8.9 21.5 10 L21.5 18 C21.5 19.4 20.4 20.5 19 20.5 L5 20.5 C3.6 20.5 2.5 19.4 2.5 18 Z"
        fill="#d2b8f3"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Kawaii Face on Folder */}
      <circle cx="9" cy="14" r="1.2" fill="#3d324c" />
      <circle cx="15" cy="14" r="1.2" fill="#3d324c" />
      <path
        d="M11 15.6 C11.5 16.4 12.5 16.4 13 15.6"
        stroke="#3d324c"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Blushing Cheeks */}
      <circle cx="7.2" cy="14.8" r="1.1" fill="#ff8cb9" />
      <circle cx="16.8" cy="14.8" r="1.1" fill="#ff8cb9" />
    </svg>
  );
}

/**
 * 💾 Floppy Disk Doodle (Kawaii Macintosh HD)
 */
export function DoodleFloppy({ size = 28, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Disk Body with Corner Bevel */}
      <path
        d="M3.5 3 C3.5 2.2 4.2 1.5 5 1.5 L17.5 1.5 L21.5 5.5 L21.5 21 C21.5 21.8 20.8 22.5 20 22.5 L4 22.5 C3.2 22.5 2.5 21.8 2.5 21 Z"
        fill="#b8ebd8"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Metal Shutter at Top */}
      <rect
        x="7"
        y="1.5"
        width="10"
        height="7.5"
        rx="1"
        fill="#ffffff"
        stroke="#3d324c"
        strokeWidth="1.5"
      />
      <rect x="9.5" y="3" width="2" height="4.5" rx="0.5" fill="#3d324c" />
      {/* Paper Label Sticker */}
      <rect
        x="5.5"
        y="11"
        width="13"
        height="9"
        rx="1.5"
        fill="#fff7fa"
        stroke="#3d324c"
        strokeWidth="1.5"
      />
      {/* Pastel Handwritten Lines on Label */}
      <line x1="8" y1="13.5" x2="16" y2="13.5" stroke="#ff8cb9" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="16.5" x2="13.5" y2="16.5" stroke="#7ac4ae" strokeWidth="1.5" strokeLinecap="round" />
      {/* Write-protect Notch */}
      <rect x="4.5" y="19" width="1.6" height="1.6" rx="0.4" fill="#3d324c" />
    </svg>
  );
}

/**
 * 🗑️ Trash Can Doodle (Classic Mac Desktop Trash)
 */
export function DoodleTrash({ size = 28, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Lid Handle */}
      <path
        d="M10 3.5 C10 2.2 14 2.2 14 3.5"
        stroke="#3d324c"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Lid Rim */}
      <path
        d="M4.5 5.5 C4.5 4.8 5.5 4.2 7 4.2 L17 4.2 C18.5 4.2 19.5 4.8 19.5 5.5 L19.5 6.5 C19.5 7.2 18.5 7.8 17 7.8 L7 7.8 C5.5 7.8 4.5 7.2 4.5 6.5 Z"
        fill="#fbe5b2"
        stroke="#3d324c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Can Body (Tapered) */}
      <path
        d="M5.5 7.8 L7.2 20 C7.4 21.2 8.6 22 10.2 22 L13.8 22 C15.4 22 16.6 21.2 16.8 20 L18.5 7.8 Z"
        fill="#fff2cc"
        stroke="#3d324c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Corrugated Vertical Ribs */}
      <line x1="9" y1="9.5" x2="9.8" y2="19.5" stroke="#e6c986" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="9.5" x2="12" y2="19.5" stroke="#e6c986" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="15" y1="9.5" x2="14.2" y2="19.5" stroke="#e6c986" strokeWidth="1.4" strokeLinecap="round" />
      {/* Kawaii Face on Trash Can */}
      <circle cx="10" cy="14" r="1.1" fill="#3d324c" />
      <circle cx="14" cy="14" r="1.1" fill="#3d324c" />
      <path
        d="M11.2 16 C11.6 16.6 12.4 16.6 12.8 16"
        stroke="#3d324c"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Cheeks */}
      <circle cx="8.6" cy="14.8" r="0.9" fill="#ff8cb9" />
      <circle cx="15.4" cy="14.8" r="0.9" fill="#ff8cb9" />
    </svg>
  );
}

/**
 * 📍 Push Pin Doodle (Sticky Note Pin)
 */
export function DoodlePushPin({ size = 20, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Plastic Head Upper Knob */}
      <circle cx="12" cy="4" r="2.4" fill="#ff7da7" stroke="#3d324c" strokeWidth="1.5" />
      {/* Head Top Rim */}
      <ellipse cx="12" cy="6.5" rx="5" ry="2.6" fill="#ff6091" stroke="#3d324c" strokeWidth="1.6" />
      {/* Tapered Body */}
      <path
        d="M9.2 6.5 C9.2 9.5 10.5 11.5 11 12.5 L13 12.5 C13.5 11.5 14.8 9.5 14.8 6.5 Z"
        fill="#e63e72"
        stroke="#3d324c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Base Collar */}
      <ellipse cx="12" cy="13" rx="2.5" ry="1.2" fill="#d12e61" stroke="#3d324c" strokeWidth="1.3" />
      {/* Sharp Metal Needle */}
      <line x1="12" y1="14.2" x2="12" y2="21.5" stroke="#3d324c" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cute White Highlight */}
      <path d="M10 5.2 C11 4.5 12.8 4.5 13.8 5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Dynamic Doodle Icon Mapper
 * Handles both emoji symbols and text names gracefully!
 */
export function DoodleIcon({
  name,
  size = 24,
  className,
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  switch (name) {
    case "🌸":
    case "blossom":
    case "sakura":
    case "flower":
      return <DoodleBlossom size={size} className={className} />;
    case "🎉":
    case "popper":
    case "confetti":
    case "celebrate":
      return <DoodlePopper size={size} className={className} />;
    case "🍓":
    case "strawberry":
    case "apple":
      return <DoodleStrawberry size={size} className={className} />;
    case "✨":
    case "sparkle":
    case "sparkles":
    case "star":
      return <DoodleSparkles size={size} className={className} />;
    case "🎀":
    case "bow":
    case "ribbon":
      return <DoodleBow size={size} className={className} />;
    case "💾":
    case "floppy":
    case "disk":
    case "hd":
      return <DoodleFloppy size={size} className={className} />;
    case "🗑️":
    case "trash":
    case "bin":
      return <DoodleTrash size={size} className={className} />;
    case "📍":
    case "pin":
    case "pushpin":
      return <DoodlePushPin size={size} className={className} />;
    case "♡":
    case "heart":
      return <DoodleHeart size={size} className={className} />;
    case "+":
    case "plus":
    case "zoom":
      return <DoodleZoomPlus size={size} className={className} />;
    case "📁":
    case "folder":
    default:
      return <DoodleFolder size={size} className={className} />;
  }
}
