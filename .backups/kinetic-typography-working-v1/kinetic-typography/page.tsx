"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

// --- Palettes Definition (Faithful to Reference) ---
interface Palette {
  name: string;
  bg: string;
  patternColor: string;
  colors: string[];
  swatches: string[];
}

const PALETTES: Record<string, Palette> = {
  fiesta: {
    name: "Fiesta Retro",
    bg: "#FAF5E8",
    patternColor: "#F0E7D1",
    colors: ["#F22815", "#155FCC", "#11A253", "#FCA4D2", "#FDC700", "#FA6400", "#8F53D3", "#155FCC"],
    swatches: ["#FDEDD4", "#F22815", "#11A253", "#FCA4D2", "#155FCC"],
  },
  bubblegum: {
    name: "Bubblegum Pop",
    bg: "#FFF0F5",
    patternColor: "#FCE0EC",
    colors: ["#FF2A6D", "#05D9E8", "#FFD166", "#06D6A0", "#7209B7", "#FF70A6", "#4361EE"],
    swatches: ["#FFF0F5", "#FF2A6D", "#05D9E8", "#FFD166", "#7209B7"],
  },
  citrus: {
    name: "Citrus Splash",
    bg: "#FEFCE8",
    patternColor: "#F5EFC2",
    colors: ["#FF6B35", "#2EC4B6", "#E71D36", "#FF9F1C", "#011627", "#20BF55"],
    swatches: ["#FEFCE8", "#FF6B35", "#2EC4B6", "#FF9F1C", "#E71D36"],
  },
  groovyNight: {
    name: "Midnight Neon",
    bg: "#141624",
    patternColor: "#1E2238",
    colors: ["#FF3366", "#00F0FF", "#FFE600", "#B026FF", "#00FF66", "#FF9900"],
    swatches: ["#141624", "#FF3366", "#00F0FF", "#FFE600", "#B026FF"],
  },
};

// --- Procedural Sound Effects Synthesizer (Web Audio API) ---
class SoundFX {
  private ctx: AudioContext | null = null;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPop(freq = 440, muted = false) {
    if (muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.5, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.12);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playBoing(muted = false) {
    if (muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(360, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.28);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playChime(note = 587.33, muted = false) {
    if (muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.42);
  }
}

// --- Letter Node Physics Object ---
interface LetterNodeData {
  id: string;
  char: string;
  wordIndex: number;
  charIndexInWord: number;
  globalIndex: number;
  total: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  vScaleX: number;
  vScaleY: number;
  rotation: number;
  vRotation: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  color: string;
}

// --- Sticker Node Physics Object ---
interface StickerNodeData {
  id: string;
  type: "star-smile" | "flower" | "spiky-star" | "ribbon" | "palette-card";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  scale: number;
  vScale: number;
  rotation: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

// --- Particle Item ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  type: "star" | "circle";
}

// Layout Calculation Helper
function applyTargets(
  items: LetterNodeData[],
  layoutMode: string,
  spacingMult: number,
  w: number,
  h: number
) {
  if (items.length === 0) return;

  const wordsMap = new Map<number, LetterNodeData[]>();
  items.forEach((l) => {
    if (!wordsMap.has(l.wordIndex)) {
      wordsMap.set(l.wordIndex, []);
    }
    wordsMap.get(l.wordIndex)!.push(l);
  });
  const wordGroups = Array.from(wordsMap.values());

  if (layoutMode === "stacked") {
    let lines: LetterNodeData[][] = [];
    if (wordGroups.length > 1) {
      lines = wordGroups;
    } else {
      const count = items.length;
      if (count <= 5) {
        lines.push(items);
      } else if (count <= 8) {
        const mid = Math.ceil(count / 2);
        lines.push(items.slice(0, mid));
        lines.push(items.slice(mid));
      } else {
        const chunkSize = Math.ceil(count / 3);
        lines.push(items.slice(0, chunkSize));
        lines.push(items.slice(chunkSize, chunkSize * 2));
        lines.push(items.slice(chunkSize * 2));
      }
    }

    const maxLineChars = Math.max(...lines.map((l) => l.length), 1);
    const maxAllowedWidth = Math.min(w * 0.82, 1100);
    const baseSpacing = 105 * spacingMult;
    const letterSpacing = Math.min(baseSpacing, maxAllowedWidth / Math.max(maxLineChars, 1));
    const lineHeight = 160;
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = h * 0.42 - totalHeight / 2;

    lines.forEach((lineChars, lineIdx) => {
      const totalLineWidth = (lineChars.length - 1) * letterSpacing;
      const startX = w * 0.5 - totalLineWidth / 2;
      const y = startY + lineIdx * lineHeight;

      lineChars.forEach((l, idx) => {
        l.targetX = startX + idx * letterSpacing;
        l.targetY = y;
      });
    });
  } else if (layoutMode === "single") {
    const maxAllowedWidth = Math.min(w * 0.88, 1200);
    const baseSpacing = 105 * spacingMult;
    const wordGap = baseSpacing * 0.7;
    const estimatedTotal = (items.length - 1) * baseSpacing + (wordGroups.length - 1) * wordGap;
    const scaleFactor = estimatedTotal > maxAllowedWidth ? maxAllowedWidth / estimatedTotal : 1;
    const letterSpacing = baseSpacing * scaleFactor;
    const effectiveWordGap = wordGap * scaleFactor;

    let currentX = 0;
    const xPositions: number[] = [];
    items.forEach((l, idx) => {
      xPositions.push(currentX);
      const next = items[idx + 1];
      if (next) {
        if (next.wordIndex !== l.wordIndex) {
          currentX += letterSpacing + effectiveWordGap;
        } else {
          currentX += letterSpacing;
        }
      }
    });

    const totalWidth = currentX;
    const startX = w * 0.5 - totalWidth / 2;
    const y = h * 0.42;

    items.forEach((l, idx) => {
      l.targetX = startX + xPositions[idx];
      l.targetY = y;
    });
  } else if (layoutMode === "wave") {
    const maxAllowedWidth = Math.min(w * 0.88, 1200);
    const baseSpacing = 105 * spacingMult;
    const wordGap = baseSpacing * 0.7;
    const estimatedTotal = (items.length - 1) * baseSpacing + (wordGroups.length - 1) * wordGap;
    const scaleFactor = estimatedTotal > maxAllowedWidth ? maxAllowedWidth / estimatedTotal : 1;
    const letterSpacing = baseSpacing * scaleFactor;
    const effectiveWordGap = wordGap * scaleFactor;

    let currentX = 0;
    const xPositions: number[] = [];
    items.forEach((l, idx) => {
      xPositions.push(currentX);
      const next = items[idx + 1];
      if (next) {
        if (next.wordIndex !== l.wordIndex) {
          currentX += letterSpacing + effectiveWordGap;
        } else {
          currentX += letterSpacing;
        }
      }
    });

    const totalWidth = currentX;
    const startX = w * 0.5 - totalWidth / 2;
    const baseY = h * 0.42;

    items.forEach((l, idx) => {
      const progress = idx / (items.length - 1 || 1);
      l.targetX = startX + xPositions[idx];
      l.targetY = baseY + Math.sin(progress * Math.PI) * -80;
    });
  } else if (layoutMode === "scatter") {
    const radius = Math.min(w, h) * 0.28;
    const cx = w * 0.5;
    const cy = h * 0.42;
    const count = items.length;

    items.forEach((l, idx) => {
      const angle = (idx / count) * Math.PI * 2 - Math.PI * 0.5;
      l.targetX = cx + Math.cos(angle) * radius;
      l.targetY = cy + Math.sin(angle) * radius;
    });
  }
}

// Build Letter Objects Function
function buildLetters(
  rawText: string,
  paletteKey: string,
  layoutMode: string,
  spacingMult: number,
  w: number,
  h: number,
  prevLetters?: LetterNodeData[]
): LetterNodeData[] {
  const words = rawText.trim() ? rawText.split(/\s+/).filter(Boolean) : [];
  const visibleChars: {
    char: string;
    wordIndex: number;
    charIndexInWord: number;
    globalIndex: number;
  }[] = [];

  let gIdx = 0;
  words.forEach((word, wIdx) => {
    for (let cIdx = 0; cIdx < word.length; cIdx++) {
      visibleChars.push({
        char: word[cIdx],
        wordIndex: wIdx,
        charIndexInWord: cIdx,
        globalIndex: gIdx++,
      });
    }
  });

  const pal = PALETTES[paletteKey] || PALETTES.fiesta;

  const items: LetterNodeData[] = visibleChars.map((item, idx) => {
    const existing = prevLetters ? prevLetters[idx] : undefined;
    return {
      id: `char-${idx}-${item.char}`,
      char: item.char,
      wordIndex: item.wordIndex,
      charIndexInWord: item.charIndexInWord,
      globalIndex: item.globalIndex,
      total: visibleChars.length,
      targetX: 0,
      targetY: 0,
      x: existing ? existing.x : 0,
      y: existing ? existing.y : 0,
      vx: existing ? existing.vx : 0,
      vy: existing ? existing.vy : 0,
      scaleX: existing ? existing.scaleX : 1,
      scaleY: existing ? existing.scaleY : 1,
      vScaleX: 0,
      vScaleY: 0,
      rotation: existing ? existing.rotation : 0,
      vRotation: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      color: pal.colors[idx % pal.colors.length],
    };
  });

  applyTargets(items, layoutMode, spacingMult, w, h);

  items.forEach((l) => {
    if (l.x === 0 && l.y === 0) {
      l.x = l.targetX;
      l.y = l.targetY;
    }
  });

  return items;
}

// Initial default stickers
const DEFAULT_STICKERS: StickerNodeData[] = [
  { id: "s1", type: "star-smile", x: 980, y: 220, targetX: 980, targetY: 220, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.1, isDragging: false, dragStartX: 0, dragStartY: 0 },
  { id: "s2", type: "flower", x: 220, y: 210, targetX: 220, targetY: 210, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: -0.15, isDragging: false, dragStartX: 0, dragStartY: 0 },
  { id: "s3", type: "spiky-star", x: 190, y: 510, targetX: 190, targetY: 510, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.2, isDragging: false, dragStartX: 0, dragStartY: 0 },
  { id: "s4", type: "ribbon", x: 940, y: 550, targetX: 940, targetY: 550, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: -0.05, isDragging: false, dragStartX: 0, dragStartY: 0 },
  { id: "s5", type: "palette-card", x: 1040, y: 410, targetX: 1040, targetY: 410, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.08, isDragging: false, dragStartX: 0, dragStartY: 0 },
];

export default function KineticTypographyPrototype() {
  // Application State
  const [text, setText] = useState<string>("TYPE IS ALIVE");
  const [layout, setLayout] = useState<string>("stacked"); // 'single', 'stacked', 'wave', 'scatter'
  const [motionMode, setMotionMode] = useState<string>("liquid"); // 'liquid', 'jelly', 'magnetic', 'wave'
  const [gooeyAmount, setGooeyAmount] = useState<number>(8);
  const [wobbleAmount, setWobbleAmount] = useState<number>(10);
  const [bounce, setBounce] = useState<number>(0.75);
  const [spacing, setSpacing] = useState<number>(1.05);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activePaletteKey, setActivePaletteKey] = useState<string>("fiesta");
  const [bgPattern, setBgPattern] = useState<string>("sunburst");
  const [audioMuted, setAudioMuted] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("motion");

  // React State Initialized with "TYPE IS ALIVE" Immediately
  const [letters, setLetters] = useState<LetterNodeData[]>(() =>
    buildLetters("TYPE IS ALIVE", "fiesta", "stacked", 1.05, 1200, 800)
  );
  const [stickers, setStickers] = useState<StickerNodeData[]>(DEFAULT_STICKERS);

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Mutable Physics Refs for 60fps Animation Loop
  const lettersRef = useRef<LetterNodeData[]>(letters);
  const stickersRef = useRef<StickerNodeData[]>(DEFAULT_STICKERS);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 600, y: 400 });
  const sfxRef = useRef<SoundFX>(new SoundFX());
  const animFrameRef = useRef<number | null>(null);

  // Active palette helper
  const palette = PALETTES[activePaletteKey] || PALETTES.fiesta;

  // Sound FX Helper
  const playPop = useCallback(
    (freq = 440) => {
      sfxRef.current.playPop(freq, audioMuted);
    },
    [audioMuted]
  );

  const playBoing = useCallback(() => {
    sfxRef.current.playBoing(audioMuted);
  }, [audioMuted]);

  const playChime = useCallback(
    (note = 587.33) => {
      sfxRef.current.playChime(note, audioMuted);
    },
    [audioMuted]
  );

  // Burst Particles Fountain
  const spawnBurst = useCallback(
    (x: number, y: number, count = 18) => {
      const pal = PALETTES[activePaletteKey] || PALETTES.fiesta;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        const color = pal.colors[Math.floor(Math.random() * pal.colors.length)];
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1.5,
          size: 5 + Math.random() * 8,
          color,
          alpha: 1.0,
          decay: 0.02 + Math.random() * 0.03,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          type: Math.random() > 0.4 ? "star" : "circle",
        });
      }
      playPop(520 + Math.random() * 200);
    },
    [activePaletteKey, playPop]
  );

  // Coordinate conversion helper
  const getSvgCoordinates = useCallback((e: MouseEvent | TouchEvent | React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    if ("touches" in e && e.touches.length > 0) {
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else if ("clientX" in e) {
      pt.x = e.clientX;
      pt.y = e.clientY;
    }
    const screenCTM = svg.getScreenCTM();
    if (screenCTM) {
      return pt.matrixTransform(screenCTM.inverse());
    }
    return pt;
  }, []);

  // Sync letter positions with actual window dimensions and user text
  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;

    const updated = buildLetters(
      text,
      activePaletteKey,
      layout,
      spacing,
      w,
      h,
      lettersRef.current
    );

    lettersRef.current = updated;
    setLetters(updated);
  }, [text, activePaletteKey, layout, spacing]);

  // Adjust sticker targets on mount/resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const positionedStickers: StickerNodeData[] = [
      { id: "s1", type: "star-smile", x: w * 0.82, y: h * 0.28, targetX: w * 0.82, targetY: h * 0.28, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.1, isDragging: false, dragStartX: 0, dragStartY: 0 },
      { id: "s2", type: "flower", x: w * 0.16, y: h * 0.26, targetX: w * 0.16, targetY: h * 0.26, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: -0.15, isDragging: false, dragStartX: 0, dragStartY: 0 },
      { id: "s3", type: "spiky-star", x: w * 0.14, y: h * 0.62, targetX: w * 0.14, targetY: h * 0.62, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.2, isDragging: false, dragStartX: 0, dragStartY: 0 },
      { id: "s4", type: "ribbon", x: w * 0.80, y: h * 0.68, targetX: w * 0.80, targetY: h * 0.68, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: -0.05, isDragging: false, dragStartX: 0, dragStartY: 0 },
      { id: "s5", type: "palette-card", x: w * 0.88, y: h * 0.50, targetX: w * 0.88, targetY: h * 0.50, vx: 0, vy: 0, scale: 1, vScale: 0, rotation: 0.08, isDragging: false, dragStartX: 0, dragStartY: 0 },
    ];

    stickersRef.current = positionedStickers;
    setStickers(positionedStickers);
  }, []);

  // Add a newly spawned sticker
  const addSticker = useCallback(
    (type: StickerNodeData["type"]) => {
      const w = typeof window !== "undefined" ? window.innerWidth : 800;
      const h = typeof window !== "undefined" ? window.innerHeight : 600;
      const x = w * 0.35 + (Math.random() - 0.5) * (w * 0.4);
      const y = h * 0.35 + (Math.random() - 0.5) * (h * 0.3);

      const newSticker: StickerNodeData = {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        x,
        y,
        targetX: x,
        targetY: y,
        vx: 0,
        vy: 0,
        scale: 1.25,
        vScale: 0,
        rotation: (Math.random() - 0.5) * 0.4,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
      };

      const updated = [...stickersRef.current, newSticker];
      stickersRef.current = updated;
      setStickers(updated);
      playChime(659.25);
      spawnBurst(x, y, 12);
    },
    [playChime, spawnBurst]
  );

  // Main 60 FPS Physics & Canvas Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const handleResize = () => {
      if (bgCanvasRef.current && particlesCanvasRef.current) {
        bgCanvasRef.current.width = window.innerWidth;
        bgCanvasRef.current.height = window.innerHeight;
        particlesCanvasRef.current.width = window.innerWidth;
        particlesCanvasRef.current.height = window.innerHeight;
      }
      applyTargets(lettersRef.current, layout, spacing, window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const t = (now / 1000) * speed;

      // 1. Draw Background Patterns
      const bgCanvas = bgCanvasRef.current;
      if (bgCanvas) {
        const bgCtx = bgCanvas.getContext("2d");
        if (bgCtx) {
          const w = bgCanvas.width;
          const h = bgCanvas.height;
          bgCtx.clearRect(0, 0, w, h);
          const pal = PALETTES[activePaletteKey] || PALETTES.fiesta;

          bgCtx.fillStyle = pal.bg;
          bgCtx.fillRect(0, 0, w, h);

          if (bgPattern === "sunburst") {
            const cx = w * 0.72;
            const cy = h * 0.48;
            const rays = 24;
            const maxRadius = Math.hypot(w, h) * 0.9;
            const rot = t * 0.04;

            for (let i = 0; i < rays; i++) {
              const a1 = rot + (i / rays) * Math.PI * 2;
              const a2 = rot + ((i + 0.5) / rays) * Math.PI * 2;
              bgCtx.beginPath();
              bgCtx.moveTo(cx, cy);
              bgCtx.arc(cx, cy, maxRadius, a1, a2);
              bgCtx.closePath();
              bgCtx.fillStyle =
                i % 2 === 0 ? (activePaletteKey === "fiesta" ? "#F7385918" : "#FFFFFF20") : "transparent";
              bgCtx.fill();
            }
          } else if (bgPattern === "waves") {
            const rowHeight = 44;
            const waveWidth = 80;
            const rows = Math.ceil(h / rowHeight) + 2;
            const cols = Math.ceil(w / waveWidth) + 2;
            const waveOffset = Math.sin(t * 0.8) * 6;

            bgCtx.save();
            bgCtx.fillStyle = activePaletteKey === "fiesta" ? "#11A25318" : "#4361EE18";
            for (let r = 0; r < rows; r++) {
              bgCtx.beginPath();
              const y = r * rowHeight;
              bgCtx.moveTo(0, y);
              for (let c = 0; c < cols; c++) {
                const x = c * waveWidth;
                const cpX1 = x + waveWidth * 0.25;
                const cpY1 = y - 14 + (r % 2 === 0 ? waveOffset : -waveOffset);
                const cpX2 = x + waveWidth * 0.75;
                const cpY2 = y + 14 + (r % 2 === 0 ? waveOffset : -waveOffset);
                bgCtx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x + waveWidth, y);
              }
              bgCtx.lineTo(w, h);
              bgCtx.lineTo(0, h);
              bgCtx.closePath();
              bgCtx.lineWidth = 4;
              bgCtx.strokeStyle = activePaletteKey === "fiesta" ? "#11A25325" : "#4361EE25";
              bgCtx.stroke();
            }
            bgCtx.restore();
          } else if (bgPattern === "dots") {
            const spacingPx = 32;
            bgCtx.fillStyle = activePaletteKey === "groovyNight" ? "#FFFFFF10" : "#0000000B";
            for (let x = 16; x < w; x += spacingPx) {
              for (let y = 16; y < h; y += spacingPx) {
                const r = 2.5 + Math.sin(t + (x + y) * 0.01) * 1;
                bgCtx.beginPath();
                bgCtx.arc(x, y, Math.max(1, r), 0, Math.PI * 2);
                bgCtx.fill();
              }
            }
          }
        }
      }

      // 2. Draw Particles
      const pCanvas = particlesCanvasRef.current;
      if (pCanvas) {
        const pCtx = pCanvas.getContext("2d");
        if (pCtx) {
          pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
          const parts = particlesRef.current;
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.vx *= 0.98;
            p.rotation += p.vRot;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              parts.splice(i, 1);
              continue;
            }

            pCtx.save();
            pCtx.translate(p.x, p.y);
            pCtx.rotate(p.rotation);
            pCtx.globalAlpha = Math.max(0, p.alpha);
            pCtx.fillStyle = p.color;

            if (p.type === "star") {
              const r1 = p.size;
              const r2 = p.size * 0.35;
              pCtx.beginPath();
              for (let s = 0; s < 8; s++) {
                const a = (s * Math.PI) / 4;
                const r = s % 2 === 0 ? r1 : r2;
                const sx = Math.cos(a) * r;
                const sy = Math.sin(a) * r;
                if (s === 0) pCtx.moveTo(sx, sy);
                else pCtx.lineTo(sx, sy);
              }
              pCtx.closePath();
              pCtx.fill();
            } else {
              pCtx.beginPath();
              pCtx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
              pCtx.fill();
            }
            pCtx.restore();
          }
        }
      }

      // 3. Physics & Transform Updates for Letters
      const mouse = mouseRef.current;
      lettersRef.current.forEach((l, idx) => {
        if (l.isDragging) {
          const destX = mouse.x - l.dragStartX;
          const destY = mouse.y - l.dragStartY;
          l.vx = (destX - l.x) * 0.45;
          l.vy = (destY - l.y) * 0.45;
          l.x += l.vx;
          l.y += l.vy;
        } else {
          const stiffness = 0.08 * (1 - bounce * 0.4);
          const damping = 0.76 + bounce * 0.16;

          let fx = (l.targetX - l.x) * stiffness;
          let fy = (l.targetY - l.y) * stiffness;

          if (motionMode === "magnetic" || motionMode === "liquid") {
            const dx = mouse.x - l.x;
            const dy = mouse.y - l.y;
            const dist = Math.hypot(dx, dy);
            const maxInfluence = 220;

            if (dist < maxInfluence && dist > 1) {
              const normDist = dist / maxInfluence;
              const influence = (1 - normDist) * (1 - normDist);

              if (motionMode === "liquid") {
                fx += (dx / dist) * influence * 35;
                fy += (dy / dist) * influence * 35;
                l.scaleX += (dx / dist) * influence * 0.08;
                l.scaleY -= (dy / dist) * influence * 0.08;
              } else {
                const angle = Math.atan2(dy, dx) + Math.PI * 0.5;
                fx -= (dx / dist) * influence * 50;
                fy -= (dy / dist) * influence * 50;
                fx += Math.cos(angle) * influence * 30;
                fy += Math.sin(angle) * influence * 30;
                l.rotation += influence * 0.08;
              }
            }
          }

          const wobbleSpeed = 2.5 * speed;
          const wobbleAmp = wobbleAmount * 0.8;
          const phase = idx * 0.85;

          if (motionMode === "wave") {
            fy += Math.sin(t * 3.5 + phase) * 18;
            l.rotation += Math.cos(t * 3.5 + phase) * 0.05;
          } else {
            fx += Math.sin(t * wobbleSpeed + phase) * (wobbleAmp * 0.4);
            fy += Math.cos(t * wobbleSpeed + phase * 1.2) * (wobbleAmp * 0.7);
          }

          l.vx = (l.vx + fx) * damping;
          l.vy = (l.vy + fy) * damping;
          l.x += l.vx;
          l.y += l.vy;
        }

        const scaleDamping = 0.82;
        const scaleStiffness = 0.12;
        l.vScaleX += (1 - l.scaleX) * scaleStiffness;
        l.vScaleY += (1 - l.scaleY) * scaleStiffness;
        l.vScaleX *= scaleDamping;
        l.vScaleY *= scaleDamping;
        l.scaleX += l.vScaleX;
        l.scaleY += l.vScaleY;

        const rotDamping = 0.88;
        l.vRotation += (0 - l.rotation) * 0.08;
        l.vRotation *= rotDamping;
        l.rotation += l.vRotation;

        const g = document.getElementById(`letter-node-${idx}`);
        if (g) {
          const tr = `translate(${l.x.toFixed(2)}, ${l.y.toFixed(2)}) rotate(${(
            l.rotation *
            (180 / Math.PI)
          ).toFixed(1)}) scale(${l.scaleX.toFixed(3)}, ${l.scaleY.toFixed(3)})`;
          g.setAttribute("transform", tr);
        }
      });

      // 4. Physics & Transform Updates for Stickers
      stickersRef.current.forEach((s) => {
        if (s.isDragging) {
          s.vx = (mouse.x - s.dragStartX - s.x) * 0.4;
          s.vy = (mouse.y - s.dragStartY - s.y) * 0.4;
          s.x += s.vx;
          s.y += s.vy;
          s.targetX = s.x;
          s.targetY = s.y;
        } else {
          const drift = Math.sin(t * 1.5 + s.x * 0.01) * 0.8;
          s.y += drift;
        }

        s.vScale += (1 - s.scale) * 0.15;
        s.vScale *= 0.8;
        s.scale += s.vScale;

        const el = document.getElementById(`sticker-node-${s.id}`);
        if (el) {
          const tr = `translate(${s.x.toFixed(1)}, ${s.y.toFixed(1)}) rotate(${(
            s.rotation *
            (180 / Math.PI)
          ).toFixed(1)}) scale(${s.scale.toFixed(3)})`;
          el.setAttribute("transform", tr);
        }
      });

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activePaletteKey, bgPattern, bounce, motionMode, speed, wobbleAmount]);

  // Pointer Interaction Handlers
  const handlePointerMove = (e: React.PointerEvent) => {
    const pt = getSvgCoordinates(e);
    mouseRef.current = { x: pt.x, y: pt.y };
  };

  const handlePointerUp = () => {
    lettersRef.current.forEach((l) => {
      if (l.isDragging) {
        l.isDragging = false;
        l.vScaleX = 0.3;
        l.vScaleY = -0.3;
        playBoing();
      }
    });
    stickersRef.current.forEach((s) => {
      s.isDragging = false;
    });
  };

  const handleCanvasClick = (e: React.PointerEvent) => {
    const pt = getSvgCoordinates(e);
    spawnBurst(pt.x, pt.y, 14);
  };

  // Drag Start for Letters
  const handleLetterPointerDown = (idx: number, e: React.PointerEvent) => {
    const l = lettersRef.current[idx];
    if (!l) return;
    l.isDragging = true;
    const pt = getSvgCoordinates(e);
    l.dragStartX = pt.x - l.x;
    l.dragStartY = pt.y - l.y;
    l.scaleX = 1.35;
    l.scaleY = 0.85;
    playBoing();
    spawnBurst(l.x, l.y, 8);
    e.stopPropagation();
  };

  // Drag Start for Stickers
  const handleStickerPointerDown = (s: StickerNodeData, e: React.PointerEvent) => {
    s.isDragging = true;
    const pt = getSvgCoordinates(e);
    s.dragStartX = pt.x - s.x;
    s.dragStartY = pt.y - s.y;
    s.scale = 1.25;
    playPop(480);
    spawnBurst(s.x, s.y, 6);
    e.stopPropagation();
  };

  // Export High-Res Poster
  const exportPoster = () => {
    if (!svgRef.current || !bgCanvasRef.current) return;
    const svgEl = svgRef.current;
    const bg = bgCanvasRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = w * 2;
    exportCanvas.height = h * 2;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);

    ctx.drawImage(bg, 0, 0, w, h);

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);

    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = `kinetic-typography-${text.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
      playChime(783.99);
    };
    img.src = url;
  };

  // Render Individual Handcrafted Vector Glyphs
  const renderGlyphInner = (char: string, color: string, index: number) => {
    const c = char.toUpperCase();
    const accent = palette.colors[(index + 2) % palette.colors.length];
    const secondary = palette.colors[(index + 4) % palette.colors.length];

    switch (c) {
      case "T":
        return (
          <>
            <rect x="-48" y="-76" width="96" height="28" rx="14" fill={color} />
            <rect x="-14" y="-52" width="28" height="130" rx="14" fill={color} />
            <circle cx="0" cy="-62" r="6" fill="#FFFFFF" />
          </>
        );
      case "Y":
        return (
          <>
            <path d="M-44 -76 L-10 -14 L-10 76 L16 76 L16 -14 L46 -76 L16 -76 L3 -36 L-12 -76 Z" fill={color} />
            <circle cx="3" cy="-44" r="8" fill={accent} />
          </>
        );
      case "P":
        return (
          <>
            <rect x="-42" y="-76" width="28" height="154" rx="14" fill={color} />
            <path d="M-18 -76 L16 -76 C46 -76 56 -56 56 -30 C56 -4 46 16 16 16 L-18 16 Z" fill={color} />
            <circle cx="14" cy="-30" r="14" fill={palette.bg} />
          </>
        );
      case "E":
        return (
          <>
            <rect x="-42" y="-76" width="28" height="154" rx="14" fill={color} />
            <rect x="-24" y="-76" width="68" height="26" rx="13" fill={color} />
            <rect x="-24" y="-13" width="54" height="24" rx="12" fill={color} />
            <rect x="-24" y="52" width="70" height="26" rx="13" fill={color} />
            <circle cx="28" cy="0" r="5" fill="#FFFFFF" />
          </>
        );
      case "I":
        return (
          <>
            <path d="M-22 -70 Q-32 0 -18 70 Q0 80 18 70 Q32 0 22 -70 Q0 -80 -22 -70 Z" fill={color} />
            <circle cx="0" cy="-40" r="7" fill="#FFFFFF" />
            <circle cx="0" cy="40" r="7" fill="#FFFFFF" />
          </>
        );
      case "S":
        return (
          <path
            d="M38 -44 C34 -66 12 -76 -12 -76 C-36 -76 -46 -58 -46 -38 C-46 -10 -16 6 12 18 C38 28 46 44 46 60 C46 80 26 92 -6 92 C-34 92 -48 74 -50 52 L-24 50 C-22 62 -12 70 2 70 C16 70 24 62 24 50 C24 34 -4 20 -28 10 C-46 2 -52 -16 -52 -34 C-52 -62 -28 -96 14 -96 C42 -96 60 -72 62 -42 Z"
            fill={color}
          />
        );
      case "A":
        return (
          <>
            <path d="M-45 80 L-15 -75 Q0 -88 15 -75 L45 80 Q30 82 18 80 L10 40 L-10 40 L-18 80 Z" fill={color} />
            <path d="M-10 16 L10 16 L0 -24 Z" fill={palette.bg} />
            <path d="M0 -5 L3 0 L8 3 L3 6 L0 11 L-3 6 L-8 3 L-3 0 Z" fill={accent} />
          </>
        );
      case "L":
        return (
          <>
            <rect x="-42" y="-76" width="28" height="154" rx="14" fill={color} />
            <rect x="-42" y="50" width="84" height="28" rx="14" fill={color} />
            <circle cx="26" cy="64" r="7" fill="#FFFFFF" />
          </>
        );
      case "V":
        return (
          <>
            <path d="M-46 -76 L-8 76 L8 76 L46 -76 L18 -76 L0 24 L-18 -76 Z" fill={color} />
            <circle cx="0" cy="-26" r="6" fill={accent} />
          </>
        );
      case "F":
        return (
          <>
            <rect x="-14" y="-30" width="28" height="110" rx="14" fill={color} />
            <rect x="-14" y="-30" width="70" height="26" rx="13" fill={color} />
            <rect x="-14" y="0" width="56" height="24" rx="12" fill={color} />
            <circle cx="56" cy="-44" r="26" fill={accent} />
            <circle cx="56" cy="-44" r="14" fill="#FFFFFF" />
            <circle cx="56" cy="-44" r="8" fill={secondary} />
          </>
        );
      case "Q":
        return (
          <>
            <ellipse cx="0" cy="-10" rx="46" ry="54" fill={color} />
            <ellipse cx="0" cy="-10" rx="22" ry="28" fill={palette.bg} />
            <rect x="12" y="16" width="40" height="24" rx="12" transform="rotate(32 20 20)" fill={color} />
            <line x1="22" y1="20" x2="38" y2="40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case "U":
        return (
          <>
            <path d="M-44 -70 L-16 -70 L-16 20 C-16 42 16 42 16 20 L16 -70 L44 -70 L44 24 C44 72 -44 72 -44 24 Z" fill={color} />
            <path d="M-30 -50 L-30 20 C-30 32 -18 32 -18 32" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
          </>
        );
      case "O":
        return (
          <>
            <circle cx="0" cy="0" r="54" fill={color} />
            <circle cx="0" cy="0" r="26" fill={palette.bg} />
            <line x1="-36" y1="36" x2="36" y2="-36" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case "R":
        return (
          <>
            <rect x="-42" y="-76" width="28" height="154" rx="14" fill={color} />
            <path d="M-18 -76 L16 -76 C46 -76 56 -56 56 -30 C56 -6 42 12 16 12 L-18 12 Z" fill={color} />
            <circle cx="12" cy="-32" r="13" fill={palette.bg} />
            <path d="M-4 6 L32 78 Q44 78 38 64 L12 6 Z" fill={color} />
          </>
        );
      case "M":
        return (
          <>
            <path d="M-52 78 L-52 -68 L-22 -68 L0 0 L22 -68 L52 -68 L52 78 L26 78 L26 -8 L9 46 L-9 46 L-26 -8 L-26 78 Z" fill={color} />
            <circle cx="0" cy="-28" r="6" fill={accent} />
          </>
        );
      case "N":
        return (
          <>
            <rect x="-46" y="-76" width="28" height="154" rx="14" fill={color} />
            <rect x="18" y="-76" width="28" height="154" rx="14" fill={color} />
            <path d="M-22 -66 L30 60 L14 74 L-38 -52 Z" fill={color} />
          </>
        );
      case "C":
        return (
          <path d="M36 -46 C24 -68 -2 -76 -20 -76 C-52 -76 -64 -40 -64 0 C-64 40 -52 76 -20 76 C-2 76 24 68 36 46 L14 30 C6 46 -6 52 -18 52 C-38 52 -42 28 -42 0 C-42 -28 -38 -52 -18 -52 C-6 -52 6 -46 14 -30 Z" fill={color} />
        );
      case "B":
        return (
          <>
            <rect x="-42" y="-76" width="28" height="154" rx="14" fill={color} />
            <path d="M-18 -76 L12 -76 C36 -76 48 -58 48 -38 C48 -20 38 -6 18 -6 L-18 -6 Z" fill={color} />
            <path d="M-18 -10 L16 -10 C42 -10 54 8 54 32 C54 58 40 76 12 76 L-18 76 Z" fill={color} />
            <circle cx="12" cy="-38" r="10" fill={palette.bg} />
            <circle cx="14" cy="32" r="11" fill={palette.bg} />
          </>
        );
      case "G":
        return (
          <>
            <circle cx="0" cy="0" r="54" fill={color} />
            <circle cx="0" cy="0" r="26" fill={palette.bg} />
            <rect x="4" y="0" width="38" height="24" rx="10" fill={color} />
            <rect x="22" y="0" width="22" height="42" rx="10" fill={color} />
          </>
        );
      case "H":
        return (
          <>
            <rect x="-44" y="-76" width="28" height="154" rx="14" fill={color} />
            <rect x="16" y="-76" width="28" height="154" rx="14" fill={color} />
            <rect x="-24" y="-12" width="48" height="24" rx="12" fill={color} />
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          </>
        );
      case "W":
        return (
          <>
            <path d="M-54 -76 L-32 78 L-14 78 L0 6 L14 78 L32 78 L54 -76 L28 -76 L18 10 L6 -54 L-6 -54 L-18 10 L-28 -76 Z" fill={color} />
            <circle cx="0" cy="30" r="6" fill={accent} />
          </>
        );
      default:
        return (
          <>
            <text
              x="0"
              y="44"
              textAnchor="middle"
              fontSize="124"
              fontWeight="900"
              fill={color}
              style={{ fontFamily: "Impact, system-ui, sans-serif" }}
            >
              {c}
            </text>
            <circle cx="22" cy="-44" r="7" fill={accent} />
          </>
        );
    }
  };

  // Render Sticker Graphic Elements
  const renderStickerInner = (type: StickerNodeData["type"]) => {
    switch (type) {
      case "star-smile":
        return (
          <g transform="scale(0.85)">
            <polygon
              points="0,-50 14,-20 46,-36 26,-8 50,14 18,22 18,52 -6,28 -34,44 -26,14 -52,-2 -22,-14"
              fill={palette.colors[1] || "#FA6400"}
              stroke="#18181B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M-16 -8 L-8 -2 L-16 4" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M16 -8 L8 -2 L16 4" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M-10 12 Q0 24 10 12" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case "flower":
        return (
          <g transform="scale(0.9)">
            <circle cx="0" cy="0" r="48" fill="#FFFFFF" />
            <g fill={palette.colors[2] || "#11A253"}>
              <circle cx="0" cy="-30" r="16" />
              <circle cx="22" cy="-22" r="16" />
              <circle cx="30" cy="0" r="16" />
              <circle cx="22" cy="22" r="16" />
              <circle cx="0" cy="30" r="16" />
              <circle cx="-22" cy="22" r="16" />
              <circle cx="-30" cy="0" r="16" />
              <circle cx="-22" cy="-22" r="16" />
              <circle cx="0" cy="0" r="22" />
            </g>
            <circle cx="0" cy="0" r="16" fill={palette.colors[3] || "#FCA4D2"} stroke="#18181B" strokeWidth="2" />
          </g>
        );
      case "spiky-star":
        return (
          <g transform="scale(0.85)">
            <polygon
              points="0,-48 11,-24 34,-40 26,-12 48,0 26,12 34,40 11,24 0,48 -11,24 -34,40 -26,12 -48,0 -26,-12 -34,-40 -11,-24"
              fill={palette.colors[0] || "#F22815"}
              stroke="#18181B"
              strokeWidth="2.5"
            />
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
          </g>
        );
      case "ribbon":
        return (
          <g transform="scale(0.9)">
            <path d="M-40 -16 Q-20 -36 0 -16 T40 -16" stroke={palette.colors[4] || "#FDC700"} strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M-40 6 Q-20 -14 0 6 T40 6" stroke={palette.colors[3] || "#FCA4D2"} strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M-40 28 Q-20 8 0 28 T40 28" stroke={palette.colors[1] || "#155FCC"} strokeWidth="12" strokeLinecap="round" fill="none" />
          </g>
        );
      case "palette-card":
        return (
          <g transform="scale(0.85)">
            <rect x="-70" y="-85" width="140" height="170" rx="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" filter="drop-shadow(3px 3px 0px #18181B)" />
            <text x="-56" y="-62" fontFamily="sans-serif" fontSize="7.5" fontWeight="800" fill="#18181B" letterSpacing="0.5">PALETAS DE COLORES</text>
            <text x="44" y="-62" fontFamily="sans-serif" fontSize="8" fontWeight="700" fill="#94A3B8">02</text>
            <rect x="-56" y="-48" width="24" height="74" rx="12" fill={palette.colors[0]} />
            <rect x="-26" y="-48" width="24" height="74" rx="12" fill={palette.colors[1]} />
            <rect x="4" y="-48" width="24" height="74" rx="12" fill={palette.colors[2]} />
            <rect x="34" y="-48" width="24" height="74" rx="12" fill={palette.colors[3]} />
            <circle cx="-44" cy="48" r="8" fill={palette.colors[0]} stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="-14" cy="48" r="8" fill={palette.colors[1]} stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="16" cy="48" r="8" fill={palette.colors[2]} stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="46" cy="48" r="8" fill={palette.colors[3]} stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );
    }
  };

  const funWords = [
    "TYPE IS ALIVE",
    "FAQUITO",
    "PROMISE",
    "NICE",
    "BOUNCE",
    "WOBBLY",
    "GROOVY",
    "MAGIC",
    "BUBBLE",
    "JELLY",
    "SUNSHINE",
  ];

  const handleShuffle = () => {
    const nextWord = funWords[Math.floor(Math.random() * funWords.length)];
    setText(nextWord);
    const pKeys = Object.keys(PALETTES);
    setActivePaletteKey(pKeys[Math.floor(Math.random() * pKeys.length)]);
    playChime(523.25);
  };

  const containerDynamicStyle = {
    "--bg-color": palette.bg,
  } as React.CSSProperties;

  return (
    <div
      className={styles.container}
      style={containerDynamicStyle}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Background Canvas */}
      <canvas className={styles.bgCanvas} ref={bgCanvasRef} />

      {/* SVG Kinetic Typography Playground Stage */}
      <div className={styles.playground} onPointerDown={handleCanvasClick}>
        <svg className={styles.svgStage} ref={svgRef} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="kinetic-gooey-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={motionMode === "liquid" ? gooeyAmount : 0} result="blur" />
              <feColorMatrix in="blur" type="matrix" values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>

          {/* Draggable Stickers Layer */}
          <g>
            {stickers.map((s) => (
              <g
                key={s.id}
                id={`sticker-node-${s.id}`}
                transform={`translate(${s.x}, ${s.y}) rotate(${(s.rotation * (180 / Math.PI)).toFixed(1)}) scale(${s.scale})`}
                style={{ cursor: "grab" }}
                onPointerDown={(e) => handleStickerPointerDown(s, e)}
              >
                {renderStickerInner(s.type)}
              </g>
            ))}
          </g>

          {/* Main Kinetic Typography Letters Layer */}
          <g filter={motionMode === "liquid" && gooeyAmount > 0 ? "url(#kinetic-gooey-filter)" : undefined}>
            {letters.map((l, idx) => (
              <g
                key={l.id}
                id={`letter-node-${idx}`}
                transform={`translate(${l.x || l.targetX}, ${l.y || l.targetY}) rotate(${(l.rotation * (180 / Math.PI)).toFixed(1)}) scale(${l.scaleX}, ${l.scaleY})`}
                style={{ cursor: "grab" }}
                onPointerDown={(e) => handleLetterPointerDown(idx, e)}
              >
                {/* Visual shadow layer */}
                <g opacity="0.15" transform="translate(4, 6)">
                  {renderGlyphInner(l.char, l.color, idx)}
                </g>
                {/* Main letterform */}
                {renderGlyphInner(l.char, l.color, idx)}
              </g>
            ))}
          </g>

          {/* Friendly prompt if text is cleared */}
          {letters.length === 0 && (
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="24"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              Type your text in the box below to bring it to life! ✨
            </text>
          )}
        </svg>
      </div>

      {/* Sparks Particle Canvas */}
      <canvas className={styles.particlesCanvas} ref={particlesCanvasRef} />

      {/* Top Header Navigation */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.backButton}>
            ← Desktop
          </Link>
          <div className={styles.brandBadge}>
            <div className={styles.brandIcon}>★</div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Typo•Lab</span>
              <span className={styles.brandSubtitle}>Kinetic Experiment 01</span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btnPill} ${!audioMuted ? styles.btnAccent : ""}`}
            onClick={() => {
              sfxRef.current.init();
              setAudioMuted(!audioMuted);
              if (audioMuted) playChime(659.25);
            }}
          >
            {audioMuted ? "🔇 Sound Off" : "🔊 Sound On"}
          </button>
          <button
            type="button"
            className={`${styles.btnPill} ${styles.btnAccent}`}
            onClick={handleShuffle}
          >
            🎲 Shuffle
          </button>
          <button
            type="button"
            className={`${styles.btnPill} ${styles.btnRed}`}
            onClick={exportPoster}
          >
            📸 Export Poster
          </button>
        </div>
      </header>

      {/* Dictionary Card (from reference) */}
      <div
        className={styles.dictCard}
        onClick={() => {
          setText("TYPE IS ALIVE");
          playBoing();
        }}
        title="Click to reset to TYPE IS ALIVE"
      >
        <div className={styles.dictWord}>TYPE • IS • ALIVE</div>
        <div className={styles.dictDesc}>Dynamic kinetic letterforms that pulse, stretch, and react to your touch.</div>
      </div>

      {/* Interactive Hint Pill */}
      <div className={styles.hintPill}>
        <span>✨ Drag & fling letters, or type custom text below</span>
      </div>

      {/* Floating Bottom Control Panel */}
      <div className={styles.bottomDock}>
        <div className={styles.inputBar}>
          <input
            type="text"
            className={styles.textInputField}
            value={text}
            maxLength={36}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => {
              setText(e.target.value.toUpperCase().slice(0, 36));
            }}
            placeholder="TYPE ANY WORD OR PHRASE..."
          />
          <div className={styles.quickWords}>
            {["TYPE IS ALIVE", "FAQUITO", "PROMISE", "NICE", "BOUNCE", "GROOVY", "WOBBLE"].map((w) => (
              <button
                key={w}
                type="button"
                className={`${styles.wordChip} ${text === w ? styles.wordChipActive : ""}`}
                onClick={() => {
                  setText(w);
                  playBoing();
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {panelOpen && (
          <div className={styles.dockPanel}>
            <div className={styles.dockTabs}>
              <div className={styles.tabNav}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "motion" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("motion")}
                >
                  Motion & Fluidity
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "layout" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("layout")}
                >
                  Style & Layout
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "palettes" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("palettes")}
                >
                  Colors & Background
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "stickers" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("stickers")}
                >
                  Stickers (+)
                </button>
              </div>
              <button
                type="button"
                className={styles.panelToggleBtn}
                onClick={() => setPanelOpen(false)}
              >
                Hide ▾
              </button>
            </div>

            {/* Tab 1: Motion */}
            {activeTab === "motion" && (
              <div className={styles.tabContent}>
                <div className={styles.controlsRow}>
                  <div className={styles.chipGroup}>
                    {[
                      { id: "liquid", label: "💧 Liquid Metaball" },
                      { id: "jelly", label: "🍮 Jelly Spring" },
                      { id: "magnetic", label: "🧲 Magnetic Orbit" },
                      { id: "wave", label: "〰️ Kinetic Wave" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`${styles.modeChip} ${motionMode === m.id ? styles.modeChipActive : ""}`}
                        onClick={() => {
                          setMotionMode(m.id);
                          playBoing();
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.controlsRow}>
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Gooey Viscosity</span>
                      <span className={styles.sliderVal}>{gooeyAmount}</span>
                    </div>
                    <input
                      type="range"
                      className={styles.slider}
                      min="0"
                      max="24"
                      step="1"
                      value={gooeyAmount}
                      onChange={(e) => setGooeyAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Pulse Wobble</span>
                      <span className={styles.sliderVal}>{wobbleAmount}</span>
                    </div>
                    <input
                      type="range"
                      className={styles.slider}
                      min="0"
                      max="24"
                      step="1"
                      value={wobbleAmount}
                      onChange={(e) => setWobbleAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Spring Bounce</span>
                      <span className={styles.sliderVal}>{bounce}</span>
                    </div>
                    <input
                      type="range"
                      className={styles.slider}
                      min="0.2"
                      max="0.95"
                      step="0.05"
                      value={bounce}
                      onChange={(e) => setBounce(Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Speed</span>
                      <span className={styles.sliderVal}>{speed.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      className={styles.slider}
                      min="0.2"
                      max="2.5"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Layout */}
            {activeTab === "layout" && (
              <div className={styles.tabContent}>
                <div className={styles.controlsRow}>
                  <div className={styles.chipGroup}>
                    {[
                      { id: "stacked", label: "📚 Stacked Words" },
                      { id: "single", label: "📏 Single Line" },
                      { id: "wave", label: "🌊 Arched Curve" },
                      { id: "scatter", label: "⭕ Radial Orbit" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        className={`${styles.modeChip} ${layout === l.id ? styles.modeChipActive : ""}`}
                        onClick={() => {
                          setLayout(l.id);
                          playPop(440);
                        }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <div className={styles.sliderGroup} style={{ maxWidth: "220px" }}>
                    <div className={styles.sliderHeader}>
                      <span>Letter Kerning</span>
                      <span className={styles.sliderVal}>{spacing.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      className={styles.slider}
                      min="0.6"
                      max="1.8"
                      step="0.05"
                      value={spacing}
                      onChange={(e) => setSpacing(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Palettes & Background */}
            {activeTab === "palettes" && (
              <div className={styles.tabContent}>
                <div className={styles.controlsRow}>
                  <div className={styles.paletteContainer}>
                    {Object.entries(PALETTES).map(([key, pal]) => (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.paletteBtn} ${activePaletteKey === key ? styles.paletteBtnActive : ""}`}
                        onClick={() => {
                          setActivePaletteKey(key);
                          playBoing();
                        }}
                      >
                        <span className={styles.paletteDot} style={{ background: pal.colors[0] }} />
                        <span className={styles.paletteDot} style={{ background: pal.colors[1] }} />
                        <span className={styles.paletteDot} style={{ background: pal.colors[2] }} />
                        <span className={styles.paletteName}>{pal.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className={styles.chipGroup}>
                    {[
                      { id: "sunburst", label: "☀️ Sunburst Rays" },
                      { id: "waves", label: "〰️ Scallop Waves" },
                      { id: "dots", label: "⚪ Halftone Dots" },
                      { id: "plain", label: "🧈 Clean Paper" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`${styles.modeChip} ${bgPattern === p.id ? styles.modeChipActive : ""}`}
                        onClick={() => {
                          setBgPattern(p.id);
                          playPop(480);
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Stickers */}
            {activeTab === "stickers" && (
              <div className={styles.tabContent}>
                <div className={styles.controlsRow}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>
                    Click to Stamp Stickers to Canvas:
                  </span>
                  <div className={styles.stickerPalette}>
                    <button
                      type="button"
                      className={styles.stickerSpawnBtn}
                      onClick={() => addSticker("star-smile")}
                      title="Add Smiling Star"
                    >
                      <svg viewBox="0 0 100 100" className={styles.stickerIconSvg}>
                        <polygon
                          points="50,6 64,36 96,20 76,48 100,70 68,78 68,108 44,84 16,100 24,70 -2,54 28,42"
                          fill="#FA6400"
                          stroke="#18181B"
                          strokeWidth="4"
                        />
                        <path d="M34 42 L42 48 L34 54" stroke="#18181B" strokeWidth="4" strokeLinecap="round" fill="none" />
                        <path d="M66 42 L58 48 L66 54" stroke="#18181B" strokeWidth="4" strokeLinecap="round" fill="none" />
                        <path d="M40 62 Q50 74 60 62" stroke="#18181B" strokeWidth="4" strokeLinecap="round" fill="none" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={styles.stickerSpawnBtn}
                      onClick={() => addSticker("flower")}
                      title="Add Scalloped Daisy"
                    >
                      <svg viewBox="0 0 100 100" className={styles.stickerIconSvg}>
                        <circle cx="50" cy="50" r="46" fill="#FFFFFF" />
                        <circle cx="50" cy="20" r="16" fill="#11A253" />
                        <circle cx="72" cy="28" r="16" fill="#11A253" />
                        <circle cx="80" cy="50" r="16" fill="#11A253" />
                        <circle cx="72" cy="72" r="16" fill="#11A253" />
                        <circle cx="50" cy="80" r="16" fill="#11A253" />
                        <circle cx="28" cy="72" r="16" fill="#11A253" />
                        <circle cx="20" cy="50" r="16" fill="#11A253" />
                        <circle cx="28" cy="28" r="16" fill="#11A253" />
                        <circle cx="50" cy="50" r="18" fill="#FCA4D2" stroke="#18181B" strokeWidth="3" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={styles.stickerSpawnBtn}
                      onClick={() => addSticker("spiky-star")}
                      title="Add Spiky Starburst"
                    >
                      <svg viewBox="0 0 100 100" className={styles.stickerIconSvg}>
                        <polygon
                          points="50,2 61,26 84,10 76,38 98,50 76,62 84,90 61,74 50,98 39,74 16,90 24,62 2,50 24,38 16,10 39,26"
                          fill="#F22815"
                          stroke="#18181B"
                          strokeWidth="3"
                        />
                        <circle cx="50" cy="50" r="12" fill="#FFFFFF" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={styles.stickerSpawnBtn}
                      onClick={() => addSticker("ribbon")}
                      title="Add Wavy Ribbon"
                    >
                      <svg viewBox="0 0 100 100" className={styles.stickerIconSvg}>
                        <path d="M10 34 Q30 14 50 34 T90 34" stroke="#FDC700" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <path d="M10 54 Q30 34 50 54 T90 54" stroke="#FCA4D2" strokeWidth="12" strokeLinecap="round" fill="none" />
                        <path d="M10 74 Q30 54 50 74 T90 74" stroke="#155FCC" strokeWidth="12" strokeLinecap="round" fill="none" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={styles.stickerSpawnBtn}
                      onClick={() => addSticker("palette-card")}
                      title="Add Palette Card"
                    >
                      <svg viewBox="0 0 100 120" className={styles.stickerIconSvg}>
                        <rect x="10" y="10" width="80" height="100" rx="8" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
                        <rect x="18" y="24" width="12" height="46" rx="6" fill="#F22815" />
                        <rect x="36" y="24" width="12" height="46" rx="6" fill="#11A253" />
                        <rect x="54" y="24" width="12" height="46" rx="6" fill="#FCA4D2" />
                        <rect x="72" y="24" width="12" height="46" rx="6" fill="#155FCC" />
                        <circle cx="24" cy="85" r="5" fill="#F22815" />
                        <circle cx="42" cy="85" r="5" fill="#11A253" />
                        <circle cx="60" cy="85" r="5" fill="#FCA4D2" />
                        <circle cx="78" cy="85" r="5" fill="#155FCC" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!panelOpen && (
          <button
            type="button"
            className={styles.btnPill}
            onClick={() => setPanelOpen(true)}
          >
            Controls ▴
          </button>
        )}
      </div>
    </div>
  );
}
