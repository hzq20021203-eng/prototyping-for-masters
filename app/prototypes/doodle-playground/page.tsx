"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

// ========================================================
// 1. Procedural Web Audio Engine (Web Audio API)
// ========================================================
class DoodleAudio {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  pop(freq = 480, pitchMod = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const startFreq = freq * pitchMod;
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, t + 0.04);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.3, t + 0.09);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // Audio fallback
    }
  }

  sparkle(noteIndex = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
      const freq = pentatonic[noteIndex % pentatonic.length];
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.12);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Audio fallback
    }
  }

  snap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.exponentialRampToValueAtTime(350, t + 0.06);

      oscGain.gain.setValueAtTime(0.2, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      // Audio fallback
    }
  }

  boing(intensity = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const baseFreq = 260 + intensity * 120;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, t + 0.22);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // Audio fallback
    }
  }

  assembleSnap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Audio fallback
    }
  }

  chime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        try {
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.14, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.32);
        } catch {
          // Audio fallback
        }
      }, idx * 65);
    });
  }
}

const doodleAudio = new DoodleAudio();

// ========================================================
// 2. Types & Interfaces
// ========================================================
interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  type: "star" | "bubble" | "heart" | "sparkle";
  life: number;
  decay: number;
  wobble: number;
}

interface SpruePartItem {
  id: string;
  name: string;
  category: "hair" | "mind" | "face" | "glasses" | "top" | "bottom" | "shoes" | "accessory";
  x: number;
  y: number;
  w: number;
  h: number;
  snapped: boolean;
  svg: string;
}

interface LivingPet {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  bounceTimer: number;
  blinkTimer: number;
  isBlinking: boolean;
  legPhase: number;
}

interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
}

// Preset model kit parts (Wen Hsiu starter pack inspiration)
const INITIAL_SPRUE_PARTS: SpruePartItem[] = [
  {
    id: "hair",
    name: "Hair Bangs",
    category: "hair",
    x: 170,
    y: 75,
    w: 90,
    h: 50,
    snapped: false,
    svg: `<g>
      <path d="M 5 45 C 5 15, 30 5, 45 5 C 60 5, 85 15, 85 45 C 80 40, 70 38, 55 42 C 45 35, 35 35, 25 42 C 15 38, 10 42, 5 45 Z" fill="#2D2B2A" stroke="#3A2319" stroke-width="2.8"/>
      <path d="M 40 10 C 45 10, 50 14, 52 20" stroke="#4A4543" stroke-width="2" stroke-linecap="round" fill="none"/>
    </g>`,
  },
  {
    id: "mind",
    name: "Idea & Heart Mind",
    category: "mind",
    x: 170,
    y: 135,
    w: 90,
    h: 54,
    snapped: false,
    svg: `<g>
      <rect x="5" y="5" width="80" height="44" rx="8" fill="#FDF4FF" stroke="#3A2319" stroke-width="2.5"/>
      <circle cx="28" cy="24" r="10" fill="#FEF08A" stroke="#EAB308" stroke-width="1.8"/>
      <rect x="25" y="32" width="6" height="4" fill="#CA8A04" stroke="#3A2319" stroke-width="1.2"/>
      <line x1="28" y1="9" x2="28" y2="5" stroke="#EAB308" stroke-width="2" stroke-linecap="round"/>
      <line x1="17" y1="14" x2="13" y2="11" stroke="#EAB308" stroke-width="2" stroke-linecap="round"/>
      <line x1="39" y1="14" x2="43" y2="11" stroke="#EAB308" stroke-width="2" stroke-linecap="round"/>
      <path d="M 60 27 C 60 21, 52 17, 52 23 C 52 20, 44 21, 44 27 C 44 33, 52 38, 52 38 C 52 38, 60 33, 60 27 Z" fill="#FF5DB3" stroke="#3A2319" stroke-width="1.8"/>
    </g>`,
  },
  {
    id: "face",
    name: "Smiling Face",
    category: "face",
    x: 170,
    y: 200,
    w: 90,
    h: 65,
    snapped: false,
    svg: `<g>
      <path d="M 12 10 C 12 38, 20 55, 45 55 C 70 55, 78 38, 78 10 Z" fill="#FCD3B5" stroke="#3A2319" stroke-width="2.8"/>
      <ellipse cx="23" cy="35" rx="5" ry="3" fill="#FB7185" opacity="0.6"/>
      <ellipse cx="67" cy="35" rx="5" ry="3" fill="#FB7185" opacity="0.6"/>
      <circle class="dollEye" data-orig-x="30" data-orig-y="26" cx="30" cy="26" r="3.5" fill="#3A2319"/>
      <circle class="dollEye" data-orig-x="60" data-orig-y="26" cx="60" cy="26" r="3.5" fill="#3A2319"/>
      <circle cx="29" cy="25" r="1.1" fill="#FFFFFF"/>
      <circle cx="59" cy="25" r="1.1" fill="#FFFFFF"/>
      <path d="M 40 38 Q 45 43 50 38" stroke="#3A2319" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="22" cy="31" r="0.8" fill="#B45309"/>
      <circle cx="25" cy="32" r="0.8" fill="#B45309"/>
      <circle cx="68" cy="31" r="0.8" fill="#B45309"/>
      <circle cx="65" cy="32" r="0.8" fill="#B45309"/>
    </g>`,
  },
  {
    id: "glasses",
    name: "Round Glasses",
    category: "glasses",
    x: 145,
    y: 25,
    w: 75,
    h: 35,
    snapped: false,
    svg: `<g>
      <circle cx="24" cy="18" r="14" fill="none" stroke="#78350F" stroke-width="3"/>
      <circle cx="51" cy="18" r="14" fill="none" stroke="#78350F" stroke-width="3"/>
      <path d="M 38 18 Q 45 15 51 18" stroke="#78350F" stroke-width="3" fill="none"/>
      <line x1="10" y1="18" x2="3" y2="15" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="65" y1="18" x2="72" y2="15" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: "top",
    name: "Crop White Tee",
    category: "top",
    x: 25,
    y: 70,
    w: 110,
    h: 70,
    snapped: false,
    svg: `<g>
      <path d="M 35 15 C 45 22, 65 22, 75 15 L 105 28 L 92 48 L 78 40 L 78 62 L 32 62 L 32 40 L 18 48 L 5 28 Z" fill="#FFFFFF" stroke="#3A2319" stroke-width="2.8" stroke-linejoin="round"/>
      <line x1="32" y1="56" x2="78" y2="56" stroke="#D1D5DB" stroke-width="1.8" stroke-dasharray="3,2"/>
    </g>`,
  },
  {
    id: "bottom",
    name: "Denim Pants",
    category: "bottom",
    x: 25,
    y: 155,
    w: 95,
    h: 125,
    snapped: false,
    svg: `<g>
      <path d="M 12 18 L 82 18 L 84 98 L 56 98 L 47 42 L 38 98 L 10 98 Z" fill="#60A5FA" stroke="#3A2319" stroke-width="2.8" stroke-linejoin="round"/>
      <rect x="12" y="14" width="70" height="9" fill="#1E3A8A" stroke="#3A2319" stroke-width="1.8"/>
      <circle cx="47" cy="18.5" r="4.5" fill="#FBBF24" stroke="#3A2319" stroke-width="1.5"/>
      <rect x="10" y="94" width="28" height="12" rx="2" fill="#BFDBFE" stroke="#3A2319" stroke-width="2"/>
      <rect x="56" y="94" width="28" height="12" rx="2" fill="#BFDBFE" stroke="#3A2319" stroke-width="2"/>
      <path d="M 18 24 Q 28 32 34 24" fill="none" stroke="#FDE047" stroke-width="1.2"/>
      <path d="M 76 24 Q 66 32 60 24" fill="none" stroke="#FDE047" stroke-width="1.2"/>
    </g>`,
  },
  {
    id: "shoes",
    name: "Chuck High Tops",
    category: "shoes",
    x: 275,
    y: 155,
    w: 80,
    h: 125,
    snapped: false,
    svg: `<g>
      <rect x="12" y="15" width="22" height="70" fill="#FCD3B5" stroke="#3A2319" stroke-width="2.5"/>
      <rect x="46" y="15" width="22" height="70" fill="#FCD3B5" stroke="#3A2319" stroke-width="2.5"/>
      <rect x="12" y="65" width="22" height="20" fill="#EF4444" stroke="#3A2319" stroke-width="2"/>
      <line x1="12" y1="72" x2="34" y2="72" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="12" y1="78" x2="34" y2="78" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="46" y="65" width="22" height="20" fill="#EF4444" stroke="#3A2319" stroke-width="2"/>
      <line x1="46" y1="72" x2="68" y2="72" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="46" y1="78" x2="68" y2="78" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M 4 100 L 12 82 L 34 82 L 34 100 L 40 102 L 38 112 L 4 112 Z" fill="#1F2937" stroke="#3A2319" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 4 100 Q 14 102 14 112 L 4 112 Z" fill="#FFFFFF" stroke="#3A2319" stroke-width="1.8"/>
      <path d="M 44 82 L 66 82 L 74 100 L 74 112 L 40 112 L 38 102 L 44 100 Z" fill="#1F2937" stroke="#3A2319" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 74 100 Q 64 102 64 112 L 74 112 Z" fill="#FFFFFF" stroke="#3A2319" stroke-width="1.8"/>
    </g>`,
  },
  {
    id: "accessory",
    name: "V60 Coffee Dripper",
    category: "accessory",
    x: 130,
    y: 275,
    w: 65,
    h: 65,
    snapped: false,
    svg: `<g>
      <polygon points="12,14 52,14 40,32 24,32" fill="#2563EB" stroke="#3A2319" stroke-width="2.2"/>
      <path d="M 22 34 L 42 34 L 50 56 L 14 56 Z" fill="#E0F2FE" stroke="#3A2319" stroke-width="2"/>
      <path d="M 18 48 L 46 48 L 49 55 L 15 55 Z" fill="#78350F"/>
      <path d="M 46 38 C 58 38, 58 50, 48 52" fill="none" stroke="#3A2319" stroke-width="2.2" stroke-linecap="round"/>
    </g>`,
  },
];

// ========================================================
// 3. Main Prototype Component
// ========================================================
export default function DoodlePlaygroundPage() {
  const [activeMode, setActiveMode] = useState<"desktop" | "modelkit" | "paint">("desktop");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [worldProgress, setWorldProgress] = useState(24);
  const [assembledSlots, setAssembledSlots] = useState<Record<string, SpruePartItem | null>>({
    hair: null,
    mind: null,
    face: null,
    glasses: null,
    top: null,
    bottom: null,
    shoes: null,
    accessory: null,
  });
  const [sprueParts, setSprueParts] = useState<SpruePartItem[]>(INITIAL_SPRUE_PARTS);
  const [activePaintTool, setActivePaintTool] = useState<"rainbow" | "living" | "stickers">("rainbow");
  const [activeColor, setActiveColor] = useState("#FF8A8A");
  const [chaosPopups, setChaosPopups] = useState<Array<{ id: number; title: string; text: string; x: number; y: number }>>([]);
  const [isCheering, setIsCheering] = useState(false);

  // References
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const livingPetsRef = useRef<LivingPet[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, speed: 0, angle: 0, lastTime: 0 });
  const isPaintingRef = useRef(false);
  const lastPaintPosRef = useRef({ x: 0, y: 0 });
  const currentStrokeRef = useRef<Array<{ x: number; y: number }>>([]);
  const draggingPartRef = useRef<{ part: SpruePartItem; ox: number; oy: number } | null>(null);

  // Windows State
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    modelkit: {
      id: "modelkit",
      title: "Wen Hsiu Starter Pack • Plastic Runner",
      icon: "✂",
      x: 160,
      y: 50,
      width: 420,
      zIndex: 10,
      isOpen: true,
      isMinimized: false,
    },
    assembly: {
      id: "assembly",
      title: "Doll Assembly Stand • Wen Hsiu",
      icon: "🧍",
      x: 595,
      y: 50,
      width: 320,
      zIndex: 12,
      isOpen: true,
      isMinimized: false,
    },
    doodlepaint: {
      id: "doodlepaint",
      title: "Doodle Studio • Wen Hsiu Palette",
      icon: "🎨",
      x: 480,
      y: 280,
      width: 490,
      height: 380,
      zIndex: 14,
      isOpen: true,
      isMinimized: false,
    },
    mycomputer: {
      id: "mycomputer",
      title: "Desk Accessories & Tools",
      icon: "💻",
      x: 160,
      y: 420,
      width: 370,
      zIndex: 8,
      isOpen: true,
      isMinimized: false,
    },
    worlddom: {
      id: "worlddom",
      title: "Cuteness Overload Meter",
      icon: "🌍",
      x: 270,
      y: 220,
      width: 340,
      zIndex: 16,
      isOpen: true,
      isMinimized: false,
    },
    error: {
      id: "error",
      title: "Starter Pack Notice",
      icon: "⚠️",
      x: 640,
      y: 170,
      width: 290,
      zIndex: 18,
      isOpen: true,
      isMinimized: false,
    },
  });

  const bringToFront = useCallback((winId: string) => {
    setWindows((prev) => {
      let maxZ = 20;
      Object.values(prev).forEach((w) => {
        if (w.zIndex > maxZ) maxZ = w.zIndex;
      });
      return {
        ...prev,
        [winId]: { ...prev[winId], zIndex: maxZ + 2, isMinimized: false, isOpen: true },
      };
    });
  }, []);

  const spawnBurst = useCallback((x: number, y: number, count = 16, type: SparkleParticle["type"] = "star") => {
    const colors = ["#FF7E9D", "#FFBF3F", "#6EE7B7", "#60A5FA", "#C084FC", "#FFFFFF"];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 70 + Math.random() * 140;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 9,
        baseSize: 8 + Math.random() * 9,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 12,
        color,
        type: Math.random() > 0.4 ? type : "sparkle",
        life: 1.0,
        decay: 0.9 + Math.random() * 0.8,
        wobble: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  // --------------------------------------------------------
  // Particle & Sparkle Loop
  // --------------------------------------------------------
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    let animId: number;
    let lastTime = performance.now();
    let trailTimer = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Mouse trails
      const m = mouseRef.current;
      if (m.speed > 35) {
        trailTimer += dt;
        if (trailTimer > 0.035) {
          const colors = ["#FF7E9D", "#FFBF3F", "#6EE7B7", "#60A5FA", "#C084FC", "#FFFFFF"];
          const count = Math.min(Math.floor(m.speed / 120) + 1, 4);
          for (let i = 0; i < count; i++) {
            const partAngle = m.angle + Math.PI + (Math.random() - 0.5) * 1.2;
            const partSpeed = 20 + Math.random() * (m.speed * 0.15 + 40);
            const size = 6 + Math.random() * 8;
            const types: Array<SparkleParticle["type"]> = ["star", "bubble", "heart", "sparkle"];
            particlesRef.current.push({
              x: m.x + (Math.random() - 0.5) * 10,
              y: m.y + (Math.random() - 0.5) * 10,
              vx: Math.cos(partAngle) * partSpeed,
              vy: Math.sin(partAngle) * partSpeed - (10 + Math.random() * 30),
              size,
              baseSize: size,
              rotation: Math.random() * Math.PI * 2,
              rotSpeed: (Math.random() - 0.5) * 8,
              color: colors[Math.floor(Math.random() * colors.length)],
              type: types[Math.floor(Math.random() * types.length)],
              life: 1.0,
              decay: 0.8 + Math.random() * 0.9,
              wobble: Math.random() * Math.PI * 2,
            });
          }
          trailTimer = 0;

          if (m.speed > 550 && Math.random() < 0.2) {
            doodleAudio.sparkle(Math.floor(Math.random() * 6));
          }
        }
      }

      // Render particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.wobble += dt * 6;
        p.x += (p.vx + Math.sin(p.wobble) * 20) * dt;
        p.y += (p.vy + 20) * dt;
        p.rotation += p.rotSpeed * dt;
        p.size = p.baseSize * Math.max(p.life, 0.1);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(p.life * 1.2, 1);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "#3A2319";
        ctx.lineWidth = 1.6;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        if (p.type === "star") {
          const s = p.size;
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            const a = (j * Math.PI) / 2;
            const inCos = Math.cos(a + Math.PI / 4) * (s * 0.32);
            const inSin = Math.sin(a + Math.PI / 4) * (s * 0.32);
            if (j === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
            else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
            ctx.lineTo(inCos, inSin);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (p.type === "bubble") {
          const r = p.size * 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(-r * 0.35, -r * 0.35, r * 0.28, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "heart") {
          const s = p.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.4);
          ctx.bezierCurveTo(-s * 0.9, -s * 0.4, -s * 0.9, -s * 1.1, 0, -s * 0.6);
          ctx.bezierCurveTo(s * 0.9, -s * 1.1, s * 0.9, -s * 0.4, 0, s * 0.4);
          ctx.fill();
          ctx.stroke();
        } else {
          const s = p.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.45, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.45, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update doll eyes tracking
      const dollEyes = document.querySelectorAll(".dollEye");
      dollEyes.forEach((eye) => {
        const rect = eye.getBoundingClientRect();
        const dx = m.x - (rect.left + rect.width / 2);
        const dy = m.y - (rect.top + rect.height / 2);
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy) * 0.03, 3);
        const ox = parseFloat(eye.getAttribute("data-orig-x") || "0");
        const oy = parseFloat(eye.getAttribute("data-orig-y") || "0");
        eye.setAttribute("cx", String(ox + Math.cos(angle) * dist));
        eye.setAttribute("cy", String(oy + Math.sin(angle) * dist));
      });

      // Update desktop pet pupils
      const petPupils = document.querySelectorAll(".petPupil");
      petPupils.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const dx = m.x - (rect.left + rect.width / 2);
        const dy = m.y - (rect.top + rect.height / 2);
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(Math.hypot(dx, dy) * 0.04, 4.5);
        const ox = parseFloat(p.getAttribute("data-orig-x") || "0");
        const oy = parseFloat(p.getAttribute("data-orig-y") || "0");
        p.setAttribute("cx", String(ox + Math.cos(angle) * dist));
        p.setAttribute("cy", String(oy + Math.sin(angle) * dist));
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --------------------------------------------------------
  // Mouse Velocity Tracker
  // --------------------------------------------------------
  useEffect(() => {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastT = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max((now - lastT) / 1000, 0.001);
      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;
      const speed = Math.hypot(vx, vy);
      const angle = Math.atan2(vy, vx);

      mouseRef.current = { x: e.clientX, y: e.clientY, vx, vy, speed, angle, lastTime: now };
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // --------------------------------------------------------
  // DoodlePaint Canvas Loop (Living ink & rainbow ribbons)
  // --------------------------------------------------------
  useEffect(() => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 460;
    canvas.height = 240;

    let animId: number;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update and draw living creatures
      const pets = livingPetsRef.current;
      pets.forEach((pet) => {
        pet.bounceTimer += dt * 5;
        pet.legPhase += dt * 9;
        pet.x += pet.vx * dt;

        if (pet.x < pet.radius + 10) {
          pet.x = pet.radius + 10;
          pet.vx = Math.abs(pet.vx);
        } else if (pet.x > canvas.width - pet.radius - 10) {
          pet.x = canvas.width - pet.radius - 10;
          pet.vx = -Math.abs(pet.vx);
        }

        pet.blinkTimer += dt;
        if (pet.blinkTimer > 2.5) {
          pet.isBlinking = true;
          if (pet.blinkTimer > 2.7) {
            pet.isBlinking = false;
            pet.blinkTimer = 0;
          }
        }

        const hopY = pet.y + Math.abs(Math.sin(pet.bounceTimer)) * -12;
        ctx.save();
        ctx.translate(pet.x, hopY);

        // Stick legs
        ctx.strokeStyle = "#3A2319";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        const leg1 = Math.sin(pet.legPhase) * 6;
        const leg2 = -Math.sin(pet.legPhase) * 6;
        ctx.beginPath();
        ctx.moveTo(-pet.radius * 0.5, pet.radius * 0.6);
        ctx.lineTo(-pet.radius * 0.5 + leg1, pet.radius + 10);
        ctx.moveTo(pet.radius * 0.5, pet.radius * 0.6);
        ctx.lineTo(pet.radius * 0.5 + leg2, pet.radius + 10);
        ctx.stroke();

        // Blob Body
        ctx.fillStyle = pet.color;
        ctx.strokeStyle = "#3A2319";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, pet.radius * 1.1, pet.radius * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eyes
        if (!pet.isBlinking) {
          ctx.fillStyle = "#3A2319";
          ctx.beginPath();
          ctx.arc(-pet.radius * 0.35, -pet.radius * 0.1, 3.2, 0, Math.PI * 2);
          ctx.arc(pet.radius * 0.35, -pet.radius * 0.1, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(-pet.radius * 0.35 - 1, -pet.radius * 0.1 - 1, 1.2, 0, Math.PI * 2);
          ctx.arc(pet.radius * 0.35 - 1, -pet.radius * 0.1 - 1, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(-pet.radius * 0.45, -pet.radius * 0.1);
          ctx.lineTo(-pet.radius * 0.25, -pet.radius * 0.1);
          ctx.moveTo(pet.radius * 0.25, -pet.radius * 0.1);
          ctx.lineTo(pet.radius * 0.45, -pet.radius * 0.1);
          ctx.stroke();
        }

        // Rosy cheeks
        ctx.fillStyle = "#FB7185";
        ctx.beginPath();
        ctx.ellipse(-pet.radius * 0.5, pet.radius * 0.15, 3.5, 2, 0, 0, Math.PI * 2);
        ctx.ellipse(pet.radius * 0.5, pet.radius * 0.15, 3.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // --------------------------------------------------------
  // Paint Drawing Handlers
  // --------------------------------------------------------
  const handlePaintDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isPaintingRef.current = true;
    lastPaintPosRef.current = { x, y };
    currentStrokeRef.current = [{ x, y }];

    if (activePaintTool === "stickers") {
      stampSticker(x, y);
    }
  };

  const handlePaintMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current) return;
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lastX = lastPaintPosRef.current.x;
    const lastY = lastPaintPosRef.current.y;
    const dist = Math.hypot(x - lastX, y - lastY);

    if (dist < 3) return;

    if (activePaintTool === "rainbow") {
      const rainbowColors = ["#FF8A8A", "#FFA959", "#FFD166", "#7CE5B7", "#60A5FA", "#C084FC"];
      const dx = x - lastX;
      const dy = y - lastY;
      const len = Math.hypot(dx, dy);
      const perpX = -dy / len;
      const perpY = dx / len;
      const bandWidth = 3.2;

      rainbowColors.forEach((color, i) => {
        const offset = (i - (rainbowColors.length - 1) / 2) * bandWidth;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = bandWidth + 0.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(lastX + perpX * offset, lastY + perpY * offset);
        ctx.lineTo(x + perpX * offset, y + perpY * offset);
        ctx.stroke();
      });

      if (Math.random() < 0.25) doodleAudio.pop(620 + Math.random() * 200, 0.8);
    } else if (activePaintTool === "living") {
      ctx.beginPath();
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#3A2319";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      currentStrokeRef.current.push({ x, y });
    } else if (activePaintTool === "stickers" && dist > 28) {
      stampSticker(x, y);
    }

    lastPaintPosRef.current = { x, y };
  };

  const handlePaintUp = () => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;

    if (activePaintTool === "living" && currentStrokeRef.current.length > 5) {
      const points = currentStrokeRef.current;
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      points.forEach((p) => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const radius = Math.max((maxX - minX + maxY - minY) / 4, 18);

      livingPetsRef.current.push({
        x: cx,
        y: cy,
        radius,
        color: activeColor,
        vx: (Math.random() - 0.5) * 60,
        vy: 0,
        bounceTimer: Math.random() * Math.PI,
        blinkTimer: 0,
        isBlinking: false,
        legPhase: 0,
      });

      if (livingPetsRef.current.length > 5) {
        livingPetsRef.current.shift();
      }

      doodleAudio.boing(1.2);
    }

    currentStrokeRef.current = [];
  };

  const stampSticker = (x: number, y: number) => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    doodleAudio.pop(500 + Math.random() * 200);
    ctx.save();
    ctx.translate(x, y);

    // Mini star
    ctx.fillStyle = activeColor;
    ctx.strokeStyle = "#3A2319";
    ctx.lineWidth = 2.0;
    const s = 12;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      const inCos = Math.cos(a + Math.PI / 4) * (s * 0.35);
      const inSin = Math.sin(a + Math.PI / 4) * (s * 0.35);
      if (i === 0) ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s);
      else ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      ctx.lineTo(inCos, inSin);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // --------------------------------------------------------
  // Sprue Runner Snapping & Doll Assembly
  // --------------------------------------------------------
  const handlePartPointerDown = (e: React.PointerEvent<HTMLDivElement>, part: SpruePartItem) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    if (!part.snapped) {
      doodleAudio.snap();
      setSprueParts((prev) =>
        prev.map((p) => (p.id === part.id ? { ...p, snapped: true } : p))
      );
      spawnBurst(e.clientX, e.clientY, 14, "sparkle");
    }

    const rect = e.currentTarget.getBoundingClientRect();
    draggingPartRef.current = {
      part,
      ox: e.clientX - rect.left,
      oy: e.clientY - rect.top,
    };
  };

  const snapPartToSlot = (part: SpruePartItem, slotKey: string) => {
    doodleAudio.assembleSnap();
    setAssembledSlots((prev) => ({
      ...prev,
      [slotKey]: part,
    }));
    setSprueParts((prev) => prev.filter((p) => p.id !== part.id));
    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 20, "star");

    // Check cheer condition
    const currentFilled = Object.values(assembledSlots).filter(Boolean).length + 1;
    if (currentFilled >= 4) {
      setIsCheering(true);
      doodleAudio.chime();
      setTimeout(() => setIsCheering(false), 1400);
    }
  };

  // --------------------------------------------------------
  // Chaos Popups & Fun Actions
  // --------------------------------------------------------
  const triggerChaos = () => {
    doodleAudio.chime();
    const notices = [
      "Warning: Bunny ears too soft!",
      "Overflow: 9000 cute points!",
      "Floppy disk has feelings!",
      "High Cuteness Pressure!",
      "Doodle army ready for nap!",
    ];

    const newPopups = [0, 1, 2].map((i) => ({
      id: Date.now() + i,
      title: "CUTE NOTICE",
      text: notices[(Date.now() + i) % notices.length],
      x: 120 + Math.random() * (window.innerWidth - 400),
      y: 100 + Math.random() * (window.innerHeight - 300),
    }));

    setChaosPopups((prev) => [...prev, ...newPopups]);
  };

  const cleanDesktop = () => {
    setChaosPopups([]);
    const canvas = paintCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    livingPetsRef.current = [];
    doodleAudio.pop(300);
  };

  const restockRunner = () => {
    doodleAudio.chime();
    setSprueParts(INITIAL_SPRUE_PARTS);
    setAssembledSlots({
      hair: null,
      mind: null,
      face: null,
      glasses: null,
      top: null,
      bottom: null,
      shoes: null,
      accessory: null,
    });
  };

  return (
    <div className={styles.container}>
      {/* Full-screen Particle Trail Overlay */}
      <canvas ref={particleCanvasRef} className={styles.particleOverlay} />

      {/* Top Navigation & Menu Bar */}
      <header className={styles.topNav}>
        <div className={styles.navGroup}>
          <Link href="/" className={styles.backButton}>
            ← Prototypes
          </Link>
          <div className={styles.brandBadge}>
            <span className={styles.brandBadgeStamp}>made in TAIWAN</span>
            <span className={styles.brandBadgeTitle}>Wen Hsiu</span>
            <span className={styles.brandBadgeSub}>starter pack</span>
            <span className={styles.brandBadgeSparkle}>✦</span>
          </div>

          <div className={styles.modeGroup}>
            <button
              type="button"
              className={`${styles.modeButton} ${activeMode === "desktop" ? styles.modeButtonActive : ""}`}
              onClick={() => setActiveMode("desktop")}
            >
              🌱 Felt Mat
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${activeMode === "modelkit" ? styles.modeButtonActive : ""}`}
              onClick={() => {
                setActiveMode("modelkit");
                bringToFront("modelkit");
                bringToFront("assembly");
              }}
            >
              ✂️ Plastic Runner
            </button>
            <button
              type="button"
              className={`${styles.modeButton} ${activeMode === "paint" ? styles.modeButtonActive : ""}`}
              onClick={() => {
                setActiveMode("paint");
                bringToFront("doodlepaint");
              }}
            >
              🎨 Doodle Studio
            </button>
          </div>
        </div>

        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${styles.actionButton} ${!isAudioMuted ? styles.actionButtonActive : ""}`}
            onClick={() => {
              const nextMuted = !isAudioMuted;
              doodleAudio.muted = nextMuted;
              setIsAudioMuted(nextMuted);
              if (!nextMuted) doodleAudio.pop(550);
            }}
          >
            {isAudioMuted ? "🔇 Sound: OFF" : "🔊 Sound: ON"}
          </button>
          <button type="button" className={styles.actionButton} onClick={triggerChaos}>
            ✨ Spawn Chaos
          </button>
          <button type="button" className={styles.actionButton} onClick={cleanDesktop}>
            🧹 Clean Desktop
          </button>
        </div>
      </header>

      {/* Main Desktop Workspace */}
      <main className={styles.desktopWorkspace}>
        {/* Desktop Icons Sidebar */}
        <div className={styles.desktopIconGrid}>
          {/* 1. My Computer Monitor Pet */}
          <div
            className={styles.desktopIcon}
            onClick={() => bringToFront("mycomputer")}
            onPointerEnter={() => doodleAudio.boing(0.8)}
          >
            <div className={styles.iconArtwork}>
              <svg className={styles.doodleSvg} viewBox="0 0 64 64" width="56" height="56">
                <path d="M 32 14 L 32 8" stroke="#3A2319" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="32" cy="7" r="3" fill="#FF7E9D" stroke="#3A2319" strokeWidth="2" />
                <rect x="8" y="14" width="48" height="38" rx="8" fill="#E2F5F8" stroke="#3A2319" strokeWidth="2.8" />
                <rect x="13" y="18" width="38" height="28" rx="5" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2" />
                <circle className="petPupil" data-orig-x="22" data-orig-y="28" cx="22" cy="28" r="3.2" fill="#3A2319" />
                <circle className="petPupil" data-orig-x="42" data-orig-y="28" cx="42" cy="28" r="3.2" fill="#3A2319" />
                <circle cx="21" cy="27" r="1.1" fill="#FFFFFF" />
                <circle cx="41" cy="27" r="1.1" fill="#FFFFFF" />
                <ellipse cx="19" cy="33" rx="3.2" ry="2" fill="#FFA5BA" opacity="0.6" />
                <ellipse cx="45" cy="33" rx="3.2" ry="2" fill="#FFA5BA" opacity="0.6" />
                <path d="M 29 32 Q 32 35 35 32" stroke="#3A2319" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 24 52 L 40 52 L 44 58 L 20 58 Z" fill="#D3EBF0" stroke="#3A2319" strokeWidth="2.5" />
              </svg>
            </div>
            <span className={styles.iconLabel}>Accessories</span>
          </div>

          {/* 2. Model Kit Icon */}
          <div
            className={styles.desktopIcon}
            onClick={() => {
              bringToFront("modelkit");
              bringToFront("assembly");
            }}
            onPointerEnter={() => doodleAudio.boing(0.5)}
          >
            <div className={styles.iconArtwork}>
              <svg className={styles.doodleSvg} viewBox="0 0 64 64" width="56" height="56">
                <path d="M 12 10 L 52 10 A 3 3 0 0 1 55 13 L 55 22 L 9 22 L 9 13 A 3 3 0 0 1 12 10 Z" fill="#FF6BB0" stroke="#1E232A" strokeWidth="2.2" />
                <circle cx="32" cy="16" r="3" fill="#FFFFFF" stroke="#1E232A" strokeWidth="1.5" />
                <rect x="9" y="22" width="46" height="38" rx="4" fill="#38BDF8" stroke="#1E232A" strokeWidth="2.5" />
                <rect x="15" y="27" width="34" height="28" rx="3" fill="none" stroke="#FF6BB0" strokeWidth="3" />
                <path d="M 27 34 L 37 34 L 39 37 L 36 38 L 35 44 L 29 44 L 28 38 L 25 37 Z" fill="#FFFFFF" stroke="#1E232A" strokeWidth="1.5" />
              </svg>
            </div>
            <span className={styles.iconLabel}>Wen Hsiu Kit</span>
          </div>

          {/* 3. DoodlePaint Icon (Headphone Bunny) */}
          <div
            className={styles.desktopIcon}
            onClick={() => bringToFront("doodlepaint")}
            onPointerEnter={() => doodleAudio.boing(0.7)}
          >
            <div className={styles.iconArtwork}>
              <svg className={styles.doodleSvg} viewBox="0 0 64 64" width="56" height="56">
                <path d="M 22 24 C 18 10, 24 4, 27 12 C 29 17, 28 22, 27 24" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2.5" />
                <path d="M 37 24 C 36 22, 35 17, 37 12 C 40 4, 46 10, 42 24" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2.5" />
                <path d="M 12 36 A 20 20 0 0 1 52 36" fill="none" stroke="#F69E38" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="32" cy="40" rx="19" ry="17" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2.8" />
                <rect x="8" y="32" width="7" height="15" rx="3.5" fill="#FFC947" stroke="#3A2319" strokeWidth="2" />
                <rect x="49" y="32" width="7" height="15" rx="3.5" fill="#FFC947" stroke="#3A2319" strokeWidth="2" />
                <circle className="petPupil" data-orig-x="25" data-orig-y="39" cx="25" cy="39" r="2.8" fill="#3A2319" />
                <circle className="petPupil" data-orig-x="39" data-orig-y="39" cx="39" cy="39" r="2.8" fill="#3A2319" />
                <ellipse cx="20" cy="43" rx="3" ry="1.8" fill="#FFA5BA" opacity="0.6" />
                <ellipse cx="44" cy="43" rx="3" ry="1.8" fill="#FFA5BA" opacity="0.6" />
                <path d="M 29 42 Q 32 44 32 42 Q 32 44 35 42" stroke="#3A2319" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
            <span className={styles.iconLabel}>Doodle Studio</span>
          </div>

          {/* 4. Cute Pics Dino */}
          <div
            className={styles.desktopIcon}
            onClick={() => bringToFront("mycomputer")}
            onPointerEnter={() => doodleAudio.pop(600)}
          >
            <div className={styles.iconArtwork}>
              <svg className={styles.doodleSvg} viewBox="0 0 64 64" width="56" height="56">
                <path d="M 10 24 L 24 24 L 28 29 L 54 29 A 4 4 0 0 1 58 33 L 58 54 A 4 4 0 0 1 54 58 L 10 58 A 4 4 0 0 1 6 54 L 6 28 A 4 4 0 0 1 10 24 Z" fill="#F4A247" stroke="#3A2319" strokeWidth="2.5" />
                <polygon points="20,18 24,12 28,18" fill="#F87171" stroke="#3A2319" strokeWidth="1.8" />
                <polygon points="28,18 32,10 36,18" fill="#F87171" stroke="#3A2319" strokeWidth="1.8" />
                <path d="M 22 28 C 22 18, 44 14, 46 25 C 47 31, 38 34, 26 34 Z" fill="#8CE196" stroke="#3A2319" strokeWidth="2.5" />
                <circle className="petPupil" data-orig-x="36" data-orig-y="21" cx="36" cy="21" r="2.8" fill="#3A2319" />
                <path d="M 6 36 L 58 36 L 53 58 L 11 58 Z" fill="#FFBD59" stroke="#3A2319" strokeWidth="2.5" />
              </svg>
            </div>
            <span className={styles.iconLabel}>Cute Pics</span>
          </div>

          {/* 5. World Domination */}
          <div
            className={styles.desktopIcon}
            onClick={() => bringToFront("worlddom")}
            onPointerEnter={() => doodleAudio.pop(700)}
          >
            <div className={styles.iconArtwork}>
              <svg className={styles.doodleSvg} viewBox="0 0 64 64" width="56" height="56">
                <circle cx="32" cy="32" r="24" fill="#38BDF8" stroke="#3A2319" strokeWidth="2.8" />
                <ellipse cx="26" cy="28" rx="8" ry="12" fill="#4ADE80" stroke="#3A2319" strokeWidth="1.8" />
                <ellipse cx="44" cy="38" rx="7" ry="8" fill="#4ADE80" stroke="#3A2319" strokeWidth="1.8" />
                <path d="M 24 20 C 26 12, 38 12, 40 20" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2" />
              </svg>
            </div>
            <span className={styles.iconLabel}>World Dom.exe</span>
          </div>
        </div>

        {/* ========================================================
            WINDOW 1: Model Kit Sprue Runner (Reference 2)
            ======================================================== */}
        {windows.modelkit.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.modelkit.zIndex >= 20 ? styles.retroWindowActive : ""} ${
              windows.modelkit.isMinimized ? styles.windowMinimized : ""
            }`}
            style={{
              left: `${windows.modelkit.x}px`,
              top: `${windows.modelkit.y}px`,
              width: `${windows.modelkit.width}px`,
              zIndex: windows.modelkit.zIndex,
            }}
            onPointerDown={() => bringToFront("modelkit")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>✂</span>
                <span className={styles.windowTitle}>{windows.modelkit.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={styles.windowCtrlBtn}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      modelkit: { ...prev.modelkit, isMinimized: !prev.modelkit.isMinimized },
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      modelkit: { ...prev.modelkit, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`${styles.windowBody} ${styles.modelKitBody}`}>
              <div className={styles.modelKitInstructions}>
                ★ Hover parts to wobble • Drag pieces to <strong>SNAP</strong> them off the runner!
              </div>

              <div className={styles.sprueRunnerFrame}>
                <div className={styles.sprueHeaderCard}>
                  <div className={styles.sprueHangHole} />
                  <div className={styles.sprueHeaderContent}>
                    <div className={styles.sprueHeaderLeft}>
                      <svg viewBox="0 0 54 36" width="46" height="30" className={styles.doodleGlassesSvg}>
                        <path d="M 4 20 C 6 8, 18 6, 24 16 C 26 20, 25 24, 24 26" fill="none" stroke="#279655" strokeWidth="2.2" strokeLinecap="round" />
                        <path d="M 26 26 C 28 16, 36 8, 48 18" fill="none" stroke="#279655" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="15" cy="22" r="7.5" fill="none" stroke="#279655" strokeWidth="2.5" />
                        <circle cx="39" cy="22" r="7.5" fill="none" stroke="#279655" strokeWidth="2.5" />
                        <path d="M 22.5 22 Q 27 19.5 31.5 22" fill="none" stroke="#279655" strokeWidth="2.2" />
                      </svg>
                      <span className={styles.sprueTaiwanPill}>made in TAIWAN.</span>
                    </div>

                    <div className={styles.sprueHeaderCenter}>
                      <div className={styles.sprueWenHsiuTitle}>
                        Wen Hsiu <span className={styles.titleSparkle}>✦</span>
                      </div>
                      <div className={styles.sprueStarterSub}>starter pack</div>
                    </div>

                    <div className={styles.sprueHeaderRight}>
                      <div className={styles.sprueRoundStamp}>
                        <span>文秀</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.spruePlasticBoard}>
                  <svg className={styles.spruePipesSvg} viewBox="0 0 380 380">
                    <rect x="8" y="8" width="364" height="364" rx="14" fill="none" stroke="#FF6BB0" strokeWidth="10" />
                    <rect x="8" y="8" width="364" height="364" rx="14" fill="none" stroke="#1E232A" strokeWidth="2.6" />
                    <line x1="140" y1="12" x2="140" y2="368" stroke="#FF6BB0" strokeWidth="7" />
                    <line x1="140" y1="12" x2="140" y2="368" stroke="#1E232A" strokeWidth="2" strokeDasharray="6,8" opacity="0.25" />
                    <line x1="265" y1="12" x2="265" y2="368" stroke="#FF6BB0" strokeWidth="7" />
                    <line x1="265" y1="12" x2="265" y2="368" stroke="#1E232A" strokeWidth="2" strokeDasharray="6,8" opacity="0.25" />
                    <line x1="12" y1="145" x2="368" y2="145" stroke="#FF6BB0" strokeWidth="7" />
                    <line x1="12" y1="275" x2="368" y2="275" stroke="#FF6BB0" strokeWidth="7" />
                  </svg>

                  {sprueParts.map((part) => (
                    <div
                      key={part.id}
                      className={`${styles.spruePart} ${part.snapped ? styles.spruePartSnapped : ""}`}
                      style={{
                        left: `${part.x}px`,
                        top: `${part.y}px`,
                        width: `${part.w}px`,
                        height: `${part.h}px`,
                      }}
                      onPointerDown={(e) => handlePartPointerDown(e, part)}
                      onClick={() => snapPartToSlot(part, part.category)}
                      title={`Click or drag to snap off ${part.name}`}
                    >
                      <div className={`${styles.sprueGate} ${styles.gateLeft}`} />
                      <div
                        className={styles.spruePartInner}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${part.w} ${part.h}" width="${part.w}" height="${part.h}">${part.svg}</svg>`,
                        }}
                      />
                      <div className={`${styles.sprueGate} ${styles.gateRight}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            WINDOW 2: Doll Assembly Stand
            ======================================================== */}
        {windows.assembly.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.assembly.zIndex >= 20 ? styles.retroWindowActive : ""} ${
              windows.assembly.isMinimized ? styles.windowMinimized : ""
            }`}
            style={{
              left: `${windows.assembly.x}px`,
              top: `${windows.assembly.y}px`,
              width: `${windows.assembly.width}px`,
              zIndex: windows.assembly.zIndex,
            }}
            onPointerDown={() => bringToFront("assembly")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>🧍</span>
                <span className={styles.windowTitle}>{windows.assembly.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={styles.windowCtrlBtn}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      assembly: { ...prev.assembly, isMinimized: !prev.assembly.isMinimized },
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      assembly: { ...prev.assembly, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={styles.windowBody}>
              <div className={styles.assemblyStandCard}>
                <div className={styles.assemblyTitle}>Wen Hsiu • Doll Assembly Stand</div>
                <div className={styles.assemblySubtitle}>Click or drop parts from the runner to dress up Wen Hsiu!</div>

                <div className={`${styles.dollStage} ${isCheering ? styles.dollCheering : ""}`}>
                  <div className={styles.dollGuideSilhouette} />

                  {/* Slot Hair */}
                  <div className={`${styles.dollSlot} ${styles.slotHair} ${assembledSlots.hair ? styles.slotFilled : ""}`}>
                    {assembledSlots.hair && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.hair.w} ${assembledSlots.hair.h}" width="100%" height="100%">${assembledSlots.hair.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Mind */}
                  <div className={`${styles.dollSlot} ${styles.slotMind} ${assembledSlots.mind ? styles.slotFilled : ""}`}>
                    {assembledSlots.mind && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.mind.w} ${assembledSlots.mind.h}" width="100%" height="100%">${assembledSlots.mind.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Face */}
                  <div className={`${styles.dollSlot} ${styles.slotFace} ${assembledSlots.face ? styles.slotFilled : ""}`}>
                    {assembledSlots.face && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.face.w} ${assembledSlots.face.h}" width="100%" height="100%">${assembledSlots.face.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Glasses */}
                  <div className={`${styles.dollSlot} ${styles.slotGlasses} ${assembledSlots.glasses ? styles.slotFilled : ""}`}>
                    {assembledSlots.glasses && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.glasses.w} ${assembledSlots.glasses.h}" width="100%" height="100%">${assembledSlots.glasses.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Top */}
                  <div className={`${styles.dollSlot} ${styles.slotTop} ${assembledSlots.top ? styles.slotFilled : ""}`}>
                    {assembledSlots.top && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.top.w} ${assembledSlots.top.h}" width="100%" height="100%">${assembledSlots.top.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Bottom */}
                  <div className={`${styles.dollSlot} ${styles.slotBottom} ${assembledSlots.bottom ? styles.slotFilled : ""}`}>
                    {assembledSlots.bottom && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.bottom.w} ${assembledSlots.bottom.h}" width="100%" height="100%">${assembledSlots.bottom.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Shoes */}
                  <div className={`${styles.dollSlot} ${styles.slotShoes} ${assembledSlots.shoes ? styles.slotFilled : ""}`}>
                    {assembledSlots.shoes && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.shoes.w} ${assembledSlots.shoes.h}" width="100%" height="100%">${assembledSlots.shoes.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>

                  {/* Slot Accessory */}
                  <div className={`${styles.dollSlot} ${styles.slotAccessory} ${assembledSlots.accessory ? styles.slotFilled : ""}`}>
                    {assembledSlots.accessory && (
                      <div
                        className={styles.slottedItem}
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="0 0 ${assembledSlots.accessory.w} ${assembledSlots.accessory.h}" width="100%" height="100%">${assembledSlots.accessory.svg}</svg>`,
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className={styles.assemblyControls}>
                  <button type="button" className={styles.retroBtn} onClick={restockRunner}>
                    ✂ Restock Runner
                  </button>
                  <button
                    type="button"
                    className={`${styles.retroBtn} ${styles.retroBtnPrimary}`}
                    onClick={() => {
                      setIsCheering(true);
                      doodleAudio.chime();
                      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 24, "heart");
                      setTimeout(() => setIsCheering(false), 1400);
                    }}
                  >
                    ★ Cheer!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            WINDOW 3: DoodlePaint 98 (Reference 1)
            ======================================================== */}
        {windows.doodlepaint.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.doodlepaint.zIndex >= 20 ? styles.retroWindowActive : ""} ${
              windows.doodlepaint.isMinimized ? styles.windowMinimized : ""
            }`}
            style={{
              left: `${windows.doodlepaint.x}px`,
              top: `${windows.doodlepaint.y}px`,
              width: `${windows.doodlepaint.width}px`,
              zIndex: windows.doodlepaint.zIndex,
            }}
            onPointerDown={() => bringToFront("doodlepaint")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>🎨</span>
                <span className={styles.windowTitle}>{windows.doodlepaint.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={styles.windowCtrlBtn}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      doodlepaint: { ...prev.doodlepaint, isMinimized: !prev.doodlepaint.isMinimized },
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      doodlepaint: { ...prev.doodlepaint, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`${styles.windowBody} ${styles.paintWindowBody}`}>
              <div className={styles.paintToolbar}>
                <div className={styles.paintToolsGroup}>
                  <button
                    type="button"
                    className={`${styles.paintToolBtn} ${activePaintTool === "rainbow" ? styles.paintToolBtnActive : ""}`}
                    onClick={() => {
                      setActivePaintTool("rainbow");
                      doodleAudio.pop(520);
                    }}
                  >
                    🌈 Ribbon
                  </button>
                  <button
                    type="button"
                    className={`${styles.paintToolBtn} ${activePaintTool === "living" ? styles.paintToolBtnActive : ""}`}
                    onClick={() => {
                      setActivePaintTool("living");
                      doodleAudio.pop(560);
                    }}
                  >
                    🐣 Living Pet
                  </button>
                  <button
                    type="button"
                    className={`${styles.paintToolBtn} ${activePaintTool === "stickers" ? styles.paintToolBtnActive : ""}`}
                    onClick={() => {
                      setActivePaintTool("stickers");
                      doodleAudio.pop(600);
                    }}
                  >
                    ✨ Stickers
                  </button>
                  <button
                    type="button"
                    className={styles.paintToolBtn}
                    onClick={() => {
                      const canvas = paintCanvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext("2d");
                        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                      livingPetsRef.current = [];
                      doodleAudio.pop(220);
                    }}
                  >
                    🧹 Clear
                  </button>
                </div>

                <div className={styles.paintPaletteGroup}>
                  {["#279655", "#FF65A8", "#4A88C5", "#FDE047", "#F6AF88", "#EF4444", "#1E232A", "#FFFFFF"].map((c) => (
                    <div
                      key={c}
                      className={`${styles.paletteSwatch} ${activeColor === c ? styles.paletteSwatchSelected : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        setActiveColor(c);
                        doodleAudio.pop(640);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.paintCanvasWrapper}>
                <canvas
                  ref={paintCanvasRef}
                  className={styles.doodlePaintCanvas}
                  onPointerDown={handlePaintDown}
                  onPointerMove={handlePaintMove}
                  onPointerUp={handlePaintUp}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            WINDOW 4: My Computer (Reference 1)
            ======================================================== */}
        {windows.mycomputer.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.mycomputer.zIndex >= 20 ? styles.retroWindowActive : ""} ${
              windows.mycomputer.isMinimized ? styles.windowMinimized : ""
            }`}
            style={{
              left: `${windows.mycomputer.x}px`,
              top: `${windows.mycomputer.y}px`,
              width: `${windows.mycomputer.width}px`,
              zIndex: windows.mycomputer.zIndex,
            }}
            onPointerDown={() => bringToFront("mycomputer")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>💻</span>
                <span className={styles.windowTitle}>{windows.mycomputer.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={styles.windowCtrlBtn}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      mycomputer: { ...prev.mycomputer, isMinimized: !prev.mycomputer.isMinimized },
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      mycomputer: { ...prev.mycomputer, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`${styles.windowBody} ${styles.myComputerBody}`}>
              <div className={styles.folderItemsGrid}>
                <div className={styles.folderItem} onClick={() => doodleAudio.boing(0.7)}>
                  <div className={styles.folderIcon}>
                    <svg viewBox="0 0 40 40" width="36" height="36">
                      <rect x="6" y="8" width="28" height="24" rx="4" fill="#60A5FA" stroke="#3A2319" strokeWidth="2" />
                      <rect x="10" y="8" width="20" height="10" fill="#FFFFFF" />
                      <circle cx="20" cy="24" r="3.5" fill="#3A2319" />
                    </svg>
                  </div>
                  <span>Floppy 01</span>
                </div>

                <div className={styles.folderItem} onClick={() => doodleAudio.boing(0.7)}>
                  <div className={styles.folderIcon}>
                    <svg viewBox="0 0 40 40" width="36" height="36">
                      <circle cx="20" cy="20" r="16" fill="#F43F5E" stroke="#3A2319" strokeWidth="2" />
                      <circle cx="20" cy="20" r="5" fill="#E2F5F8" stroke="#3A2319" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <span>Disk 01 [D:]</span>
                </div>

                <div className={styles.folderItem} onClick={() => doodleAudio.pop(600)}>
                  <div className={styles.folderIcon}>
                    <svg viewBox="0 0 40 40" width="36" height="36">
                      <polygon points="20,4 18,12 22,12" fill="#FFDC73" stroke="#3A2319" strokeWidth="1.5" />
                      <ellipse cx="20" cy="22" rx="14" ry="11" fill="#8CE1EE" stroke="#3A2319" strokeWidth="2" />
                      <circle cx="16" cy="20" r="2" fill="#3A2319" />
                      <circle cx="24" cy="20" r="2" fill="#3A2319" />
                    </svg>
                  </div>
                  <span>Control Panel</span>
                </div>

                <div className={styles.folderItem} onClick={() => doodleAudio.chime()}>
                  <div className={styles.folderIcon}>
                    <svg viewBox="0 0 40 40" width="36" height="36">
                      <path d="M 12 18 C 10 8, 14 4, 16 10 C 18 14, 17 18, 16 18" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2" />
                      <path d="M 24 18 C 23 18, 22 14, 24 10 C 26 4, 30 8, 28 18" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2" />
                      <ellipse cx="20" cy="26" rx="13" ry="11" fill="#FFFFFF" stroke="#3A2319" strokeWidth="2" />
                      <rect x="6" y="22" width="4" height="9" rx="2" fill="#FFC947" stroke="#3A2319" strokeWidth="1.5" />
                      <rect x="30" y="22" width="4" height="9" rx="2" fill="#FFC947" stroke="#3A2319" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <span>Music Player</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            WINDOW 5: World Domination.exe (Reference 1)
            ======================================================== */}
        {windows.worlddom.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.worlddom.zIndex >= 20 ? styles.retroWindowActive : ""} ${
              windows.worlddom.isMinimized ? styles.windowMinimized : ""
            }`}
            style={{
              left: `${windows.worlddom.x}px`,
              top: `${windows.worlddom.y}px`,
              width: `${windows.worlddom.width}px`,
              zIndex: windows.worlddom.zIndex,
            }}
            onPointerDown={() => bringToFront("worlddom")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>🌍</span>
                <span className={styles.windowTitle}>{windows.worlddom.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={styles.windowCtrlBtn}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      worlddom: { ...prev.worlddom, isMinimized: !prev.worlddom.isMinimized },
                    }))
                  }
                >
                  −
                </button>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      worlddom: { ...prev.worlddom, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`${styles.windowBody} ${styles.progressBody}`}>
              <div className={styles.progressLabel}>
                {worldProgress < 50
                  ? `Estimated time left... ${Math.max(1, Math.round(51 * (1 - worldProgress / 100)))} years`
                  : worldProgress < 99
                  ? `Charging cute energy... ${Math.round(worldProgress)}%`
                  : "WORLD DOMINATION BY CUTENESS: 100%! 🎉"}
              </div>
              <div className={styles.progressInstruction}>Rub mouse over the bar to speed up! ✨</div>
              <div
                className={styles.progressTrack}
                onPointerMove={(e) => {
                  setWorldProgress((prev) => Math.min(prev + 1.2, 100));
                  doodleAudio.pop(320 + worldProgress * 6, 0.7);
                  if (worldProgress >= 99) {
                    spawnBurst(e.clientX, e.clientY, 16, "heart");
                  }
                }}
              >
                <div className={styles.progressFill} style={{ width: `${worldProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            WINDOW 6: NULL MISFIT ERROR (Reference 1)
            ======================================================== */}
        {windows.error.isOpen && (
          <div
            className={`${styles.retroWindow} ${windows.error.zIndex >= 20 ? styles.retroWindowActive : ""}`}
            style={{
              left: `${windows.error.x}px`,
              top: `${windows.error.y}px`,
              width: `${windows.error.width}px`,
              zIndex: windows.error.zIndex,
            }}
            onPointerDown={() => bringToFront("error")}
          >
            <div className={styles.windowTitleBar}>
              <div className={styles.titleLeft}>
                <span className={styles.winMiniIcon}>⚠️</span>
                <span className={styles.windowTitle}>{windows.error.title}</span>
              </div>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                  onClick={() =>
                    setWindows((prev) => ({
                      ...prev,
                      error: { ...prev.error, isOpen: false },
                    }))
                  }
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`${styles.windowBody} ${styles.errorDialogBody}`}>
              <div className={styles.errorIconCircle}>
                <span className={styles.errorX}>✖</span>
              </div>
              <div className={styles.errorMsgArea}>
                <div className={styles.errorTitle}>Cute Overload Warning</div>
                <div className={styles.errorSub}>Doodle levels exceeded threshold. Proceed with snuggle?</div>
                <button
                  type="button"
                  className={`${styles.retroBtn} ${styles.retroBtnOk}`}
                  onClick={() => {
                    doodleAudio.boing(0.9);
                    setWindows((prev) => ({
                      ...prev,
                      error: { ...prev.error, isOpen: false },
                    }));
                    spawnBurst(windows.error.x + 140, windows.error.y + 70, 16, "sparkle");
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transient Chaos Popups */}
        {chaosPopups.map((popup) => (
          <div
            key={popup.id}
            className={`${styles.retroWindow} ${styles.transientPopup}`}
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              width: "240px",
              zIndex: 9000,
            }}
          >
            <div className={styles.windowTitleBar}>
              <span className={styles.windowTitle}>{popup.title}</span>
              <button
                type="button"
                className={`${styles.windowCtrlBtn} ${styles.ctrlClose}`}
                onClick={() => {
                  doodleAudio.pop(300);
                  setChaosPopups((prev) => prev.filter((p) => p.id !== popup.id));
                }}
              >
                ×
              </button>
            </div>
            <div className={styles.windowBody} style={{ textAlign: "center", padding: "14px" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>🐰</div>
              <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "10px" }}>{popup.text}</div>
              <button
                type="button"
                className={`${styles.retroBtn} ${styles.retroBtnPrimary}`}
                onClick={() => {
                  doodleAudio.pop(400);
                  setChaosPopups((prev) => prev.filter((p) => p.id !== popup.id));
                }}
              >
                OK!
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
