"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Application, Container, Graphics } from "pixi.js";
import styles from "./styles.module.css";

// --- Types & Interfaces ---
type LayoutMode = "staggered" | "grid" | "orbit";
type ColorRole = "primary" | "deep" | "light" | "dark" | "slate";

interface ShapeNode {
  graphics: Graphics;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeRotation: number;
  rotation: number;
  vRot: number;
  baseScale: number;
  homeScale: number;
  vScale: number;
  shapeType: string;
  colorRole: ColorRole;
}

interface RippleWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  intensity: number;
}

// Preset color swatches
const SWATCHES = [
  { name: "Mint Green (Default)", hex: "#10D597" },
  { name: "Electric Cyan", hex: "#06B6D4" },
  { name: "Lime Zing", hex: "#84CC16" },
  { name: "Coral Orange", hex: "#FB923C" },
  { name: "Lavender Purple", hex: "#A855F7" },
  { name: "Sunset Rose", hex: "#F43F5E" },
];

// Color Math & Palette Derivation Helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHexNum(r: number, g: number, b: number): number {
  return (
    ((Math.max(0, Math.min(255, Math.round(r))) << 16) |
      (Math.max(0, Math.min(255, Math.round(g))) << 8) |
      Math.max(0, Math.min(255, Math.round(b)))) >>>
    0
  );
}

function derivePalette(hexStr: string) {
  const { r, g, b } = hexToRgb(hexStr);
  const primary = rgbToHexNum(r, g, b);
  // Deeper shade: 70% luminance
  const deep = rgbToHexNum(r * 0.7, g * 0.7, b * 0.7);
  // Light pastel tint: blend with white
  const light = rgbToHexNum(
    r + (255 - r) * 0.45,
    g + (255 - g) * 0.45,
    b + (255 - b) * 0.45
  );
  return {
    primary,
    deep,
    light,
    dark: 0x22262b, // Crisp charcoal dark gray
    slate: 0x3e4651, // Muted slate gray
  };
}

// Procedural Vector Shape Generators (PixiJS v8 Graphics drawn in white for GPU tinting)
const createCapsule = () => {
  const g = new Graphics();
  g.roundRect(-18, -9, 36, 18, 9).fill(0xffffff);
  return g;
};

const createCircle = () => {
  const g = new Graphics();
  g.circle(0, 0, 11).fill(0xffffff);
  return g;
};

const createRing = () => {
  const g = new Graphics();
  g.circle(0, 0, 11).stroke({ width: 5, color: 0xffffff });
  return g;
};

const createRoundedRect = () => {
  const g = new Graphics();
  g.roundRect(-11, -11, 22, 22, 5).fill(0xffffff);
  return g;
};

const createBlob = () => {
  const g = new Graphics();
  const r = 13;
  g.moveTo(-r * 0.7, -r * 0.3)
    .bezierCurveTo(-r * 0.9, -r * 0.9, -r * 0.15, -r * 1.1, r * 0.55, -r * 0.75)
    .bezierCurveTo(r * 1.1, -r * 0.4, r * 0.95, r * 0.45, r * 0.55, r * 0.8)
    .bezierCurveTo(r * 0.1, r * 1.05, -r * 0.65, r * 0.95, -r * 0.85, r * 0.45)
    .closePath()
    .fill(0xffffff);
  return g;
};

const createCross = () => {
  const g = new Graphics();
  g.roundRect(-12, -4, 24, 8, 3)
    .roundRect(-4, -12, 8, 24, 3)
    .fill(0xffffff);
  return g;
};

const pickColorRole = (index: number): ColorRole => {
  const mod = index % 10;
  if (mod < 4) return "primary"; // 40% main color
  if (mod < 6) return "deep"; // 20% deep tone
  if (mod < 7) return "light"; // 10% soft pastel tint
  if (mod < 9) return "dark"; // 20% charcoal gray
  return "slate"; // 10% slate gray
};

const createShapeNode = (
  i: number,
  palette: ReturnType<typeof derivePalette>,
  currentScaleMultiplier: number
): ShapeNode => {
  const role = pickColorRole(i);
  const typeChoice = i % 6;
  let g: Graphics;
  let shapeType = "circle";

  switch (typeChoice) {
    case 0:
      g = createCapsule();
      shapeType = "capsule";
      break;
    case 1:
      g = createRing();
      shapeType = "ring";
      break;
    case 2:
      g = createRoundedRect();
      shapeType = "roundedRect";
      break;
    case 3:
      g = createBlob();
      shapeType = "blob";
      break;
    case 4:
      g = createCross();
      shapeType = "cross";
      break;
    default:
      g = createCircle();
      shapeType = "circle";
      break;
  }

  // Tint graphics according to role
  g.tint = palette[role];

  const homeRot = ((i * 37) % 360) * (Math.PI / 180);
  const baseScale = 0.88 + ((i * 13) % 25) * 0.01;
  const homeScale = baseScale * currentScaleMultiplier;

  g.rotation = homeRot;
  g.scale.set(homeScale);

  return {
    graphics: g,
    homeX: 0,
    homeY: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    homeRotation: homeRot,
    rotation: homeRot,
    vRot: 0,
    baseScale,
    homeScale,
    vScale: 0,
    shapeType,
    colorRole: role,
  };
};

export default function PatternPlaygroundPrototype() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const patternContainerRef = useRef<Container | null>(null);
  const shapesRef = useRef<ShapeNode[]>([]);
  const ripplesRef = useRef<RippleWave[]>([]);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    speed: 0,
    smoothedSpeed: 0,
    inside: false,
    lastMoveTime: 0,
  });

  // Interactive Control States
  const [mainColor, setMainColor] = useState<string>("#10D597");
  const [shapeSize, setShapeSize] = useState<number>(1.0);
  const [spacing, setSpacing] = useState<number>(65);
  const [density, setDensity] = useState<number>(120);
  const [strength, setStrength] = useState<number>(1.0);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Existing states
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("staggered");
  const [shapeCount, setShapeCount] = useState<number>(0);
  const [scatterCount, setScatterCount] = useState<number>(0);
  const [sensitivity, setSensitivity] = useState<"gentle" | "dynamic">("dynamic");

  // Keep refs in sync with ticker & handlers to avoid re-mounting Pixi
  const mainColorRef = useRef<string>(mainColor);
  const shapeSizeRef = useRef<number>(shapeSize);
  const spacingRef = useRef<number>(spacing);
  const densityRef = useRef<number>(density);
  const strengthRef = useRef<number>(strength);
  const layoutModeRef = useRef<LayoutMode>(layoutMode);
  const sensitivityRef = useRef<"gentle" | "dynamic">(sensitivity);

  useEffect(() => {
    layoutModeRef.current = layoutMode;
  }, [layoutMode]);

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  // Compute targets based on selected layout mode & spacing
  const updateLayoutTargets = useCallback(
    (mode: LayoutMode, width: number, height: number, customSpacing?: number) => {
      const shapes = shapesRef.current;
      if (shapes.length === 0) return;

      const cellSpacing = customSpacing ?? spacingRef.current;
      const marginX = Math.max(width * 0.06, 50);
      const marginY = Math.max(height * 0.1, 70);
      const availW = Math.max(width - marginX * 2, 200);
      const availH = Math.max(height - marginY * 2, 200);

      if (mode === "staggered" || mode === "grid") {
        const isStaggered = mode === "staggered";
        const cols = Math.max(Math.floor(availW / cellSpacing), 4);
        const rows = Math.max(Math.floor(availH / cellSpacing), 3);

        const gridTotalW = (cols - 1) * cellSpacing;
        const gridTotalH = (rows - 1) * cellSpacing;
        const startX = Math.max((width - gridTotalW) / 2, 40);
        const startY = Math.max((height - gridTotalH) / 2, 60);

        let idx = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (idx >= shapes.length) break;
            const node = shapes[idx];
            const offsetX = isStaggered && r % 2 === 1 ? cellSpacing * 0.5 : 0;
            node.homeX = startX + c * cellSpacing + offsetX;
            node.homeY = startY + r * cellSpacing;
            idx++;
          }
        }

        // Distribute extra shapes if density is high
        while (idx < shapes.length) {
          const node = shapes[idx];
          const extraRow = Math.floor(idx / cols);
          const extraCol = idx % cols;
          const offsetX = isStaggered && extraRow % 2 === 1 ? cellSpacing * 0.5 : 0;
          node.homeX = startX + extraCol * cellSpacing + offsetX;
          node.homeY = startY + extraRow * cellSpacing;
          idx++;
        }
      } else if (mode === "orbit") {
        const cx = width / 2;
        const cy = height / 2;
        const ringCount = Math.max(3, Math.floor(shapes.length / 22));
        const baseRadius = cellSpacing * 0.85;
        const maxR = Math.min(availW, availH) * 0.46;
        const radiusStep = (maxR - baseRadius) / ringCount;

        let idx = 0;
        for (let ring = 1; ring <= ringCount; ring++) {
          const ringRadius = baseRadius + ring * radiusStep;
          const countOnRing = Math.max(
            6,
            Math.floor((ringRadius * Math.PI * 2) / (cellSpacing * 1.05))
          );
          for (let i = 0; i < countOnRing; i++) {
            if (idx >= shapes.length) break;
            const node = shapes[idx];
            const angle = (i / countOnRing) * Math.PI * 2 + ring * 0.35;
            node.homeX = cx + Math.cos(angle) * ringRadius;
            node.homeY = cy + Math.sin(angle) * ringRadius;
            idx++;
          }
        }

        while (idx < shapes.length) {
          const node = shapes[idx];
          const a = (idx / shapes.length) * Math.PI * 2;
          node.homeX = cx + Math.cos(a) * (baseRadius * 0.5);
          node.homeY = cy + Math.sin(a) * (baseRadius * 0.5);
          idx++;
        }
      }
    },
    []
  );

  // Trigger radial scatter burst with interaction strength scaling
  const triggerScatter = useCallback((originX?: number, originY?: number) => {
    const app = appRef.current;
    if (!app || shapesRef.current.length === 0) return;

    const ox = originX ?? app.screen.width / 2;
    const oy = originY ?? app.screen.height / 2;
    const sMult = strengthRef.current;

    // Inject shockwave ripple
    ripplesRef.current.push({
      x: ox,
      y: oy,
      radius: 10,
      maxRadius: Math.max(app.screen.width, app.screen.height) * 0.75,
      speed: 700 * Math.max(0.6, sMult * 0.8),
      intensity: 18 * sMult,
    });

    shapesRef.current.forEach((node) => {
      const dx = node.x - ox;
      const dy = node.y - oy;
      const dist = Math.max(Math.hypot(dx, dy), 12);
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.55;

      const impulse =
        (680 / (1 + dist * 0.0025)) * (0.8 + Math.random() * 0.55) * sMult;

      node.vx += Math.cos(angle) * impulse;
      node.vy += Math.sin(angle) * impulse;
      node.vRot += (Math.random() - 0.5) * 1.4 * sMult;
      node.vScale += (0.3 + Math.random() * 0.2) * Math.min(sMult, 1.8);
    });

    setScatterCount((prev) => prev + 1);
  }, []);

  // --- Real-Time Control Handlers ---

  // 1. Color Picker & Swatches
  const handleColorChange = useCallback((hex: string) => {
    setMainColor(hex);
    mainColorRef.current = hex;
    const palette = derivePalette(hex);
    shapesRef.current.forEach((node) => {
      node.graphics.tint = palette[node.colorRole];
    });
  }, []);

  // 2. Shape Size Slider
  const handleSizeChange = useCallback((val: number) => {
    setShapeSize(val);
    shapeSizeRef.current = val;
    shapesRef.current.forEach((node) => {
      node.homeScale = node.baseScale * val;
    });
  }, []);

  // 3. Spacing Slider
  const handleSpacingChange = useCallback(
    (val: number) => {
      setSpacing(val);
      spacingRef.current = val;
      const app = appRef.current;
      if (app && app.screen) {
        updateLayoutTargets(
          layoutModeRef.current,
          app.screen.width,
          app.screen.height,
          val
        );
      }
    },
    [updateLayoutTargets]
  );

  // 4. Density Slider (Smooth regeneration without re-mounting Pixi)
  const handleDensityChange = useCallback(
    (targetCount: number) => {
      setDensity(targetCount);
      densityRef.current = targetCount;

      const app = appRef.current;
      const container = patternContainerRef.current;
      if (!app || !container) return;

      const currentCount = shapesRef.current.length;

      if (targetCount > currentCount) {
        // Add new nodes seamlessly
        const palette = derivePalette(mainColorRef.current);
        const added: ShapeNode[] = [];
        for (let i = currentCount; i < targetCount; i++) {
          const node = createShapeNode(i, palette, shapeSizeRef.current);
          node.x = app.screen.width / 2 + (Math.random() - 0.5) * 120;
          node.y = app.screen.height / 2 + (Math.random() - 0.5) * 120;
          node.graphics.position.set(node.x, node.y);
          node.graphics.scale.set(0); // Pop in smoothly from scale 0
          container.addChild(node.graphics);
          added.push(node);
        }
        shapesRef.current = [...shapesRef.current, ...added];
      } else if (targetCount < currentCount) {
        // Remove excess nodes cleanly
        const toRemove = shapesRef.current.slice(targetCount);
        shapesRef.current = shapesRef.current.slice(0, targetCount);
        toRemove.forEach((node) => {
          container.removeChild(node.graphics);
          node.graphics.destroy();
        });
      }

      setShapeCount(shapesRef.current.length);
      updateLayoutTargets(
        layoutModeRef.current,
        app.screen.width,
        app.screen.height,
        spacingRef.current
      );
    },
    [updateLayoutTargets]
  );

  // 5. Interaction Strength Slider
  const handleStrengthChange = useCallback((val: number) => {
    setStrength(val);
    strengthRef.current = val;
  }, []);

  // Reset all customization controls to defaults
  const handleReset = useCallback(() => {
    handleColorChange("#10D597");
    handleSizeChange(1.0);
    handleSpacingChange(65);
    handleDensityChange(120);
    handleStrengthChange(1.0);
  }, [
    handleColorChange,
    handleSizeChange,
    handleSpacingChange,
    handleDensityChange,
    handleStrengthChange,
  ]);

  // Handle switching layout modes smoothly
  const handleModeChange = (newMode: LayoutMode) => {
    setLayoutMode(newMode);
    const app = appRef.current;
    if (app && app.screen) {
      updateLayoutTargets(
        newMode,
        app.screen.width,
        app.screen.height,
        spacingRef.current
      );
    }
  };

  // --- Initialize PixiJS v8 Application on mount ---
  useEffect(() => {
    let isCancelled = false;
    let activeApp: Application | null = null;

    const mountPixi = async () => {
      const container = containerRef.current;
      if (!container) return;

      try {
        const screenW =
          typeof window !== "undefined" ? window.innerWidth : 1200;
        const screenH =
          typeof window !== "undefined" ? window.innerHeight : 800;

        // Construct PixiJS v8 Application
        const app = new Application();

        // Async v8 initialization
        await app.init({
          width: screenW,
          height: screenH,
          resizeTo: window,
          background: "#FAF9F5",
          antialias: true,
          preference: "webgl",
          autoDensity: true,
          resolution:
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        });

        if (isCancelled) {
          app.destroy({ removeView: true }, { children: true });
          return;
        }

        activeApp = app;
        appRef.current = app;

        // Clean container and append canvas
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(app.canvas);

        // Root scene container
        const patternContainer = new Container();
        app.stage.addChild(patternContainer);
        patternContainerRef.current = patternContainer;

        const w = app.screen.width || screenW;
        const h = app.screen.height || screenH;

        // Create initial node list based on density
        const initialCount = densityRef.current;
        const palette = derivePalette(mainColorRef.current);
        const shapeList: ShapeNode[] = [];

        for (let i = 0; i < initialCount; i++) {
          const node = createShapeNode(i, palette, shapeSizeRef.current);
          patternContainer.addChild(node.graphics);
          shapeList.push(node);
        }

        shapesRef.current = shapeList;
        setShapeCount(shapeList.length);

        // Apply initial layout targets
        updateLayoutTargets(
          layoutModeRef.current,
          w,
          h,
          spacingRef.current
        );

        // Position nodes directly at home positions initially
        shapeList.forEach((s) => {
          s.x = s.homeX;
          s.y = s.homeY;
          s.graphics.position.set(s.homeX, s.homeY);
        });

        // Pointer event tracking
        const handlePointerMove = (e: PointerEvent) => {
          const rect = app.canvas.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const py = e.clientY - rect.top;

          const m = mouseRef.current;
          const now = performance.now();
          const dt = Math.max((now - m.lastMoveTime) / 1000, 0.016);

          if (m.prevX > -500) {
            const dist = Math.hypot(px - m.prevX, py - m.prevY);
            m.speed = dist / dt;
            m.smoothedSpeed += (m.speed - m.smoothedSpeed) * 0.35;
          }

          m.x = px;
          m.y = py;
          m.prevX = px;
          m.prevY = py;
          m.inside = true;
          m.lastMoveTime = now;

          // Faster mouse movement generates expanding ripples
          if (m.smoothedSpeed > 300) {
            const sMult = strengthRef.current;
            ripplesRef.current.push({
              x: px,
              y: py,
              radius: 8,
              maxRadius:
                180 +
                Math.min(m.smoothedSpeed * 0.15, 130) *
                  Math.sqrt(Math.max(0.4, sMult)),
              speed: 380,
              intensity: Math.min(m.smoothedSpeed * 0.008, 6.5) * sMult,
            });
          }
        };

        const handlePointerLeave = () => {
          mouseRef.current.inside = false;
          mouseRef.current.speed = 0;
          mouseRef.current.smoothedSpeed = 0;
        };

        const handlePointerDown = (e: PointerEvent) => {
          // If clicked directly on canvas, trigger scatter
          if (e.target === app.canvas) {
            const rect = app.canvas.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            triggerScatter(px, py);
          }
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerleave", handlePointerLeave);
        container.addEventListener("pointerdown", handlePointerDown);

        // 60 FPS Physics Simulation Loop via app.ticker
        app.ticker.add((ticker) => {
          const dt = Math.min(ticker.deltaTime, 2.0);
          const mouse = mouseRef.current;

          mouse.smoothedSpeed *= 0.92;
          const sMult = strengthRef.current;
          const mult =
            (sensitivityRef.current === "dynamic" ? 1.0 : 0.65) * sMult;

          // 1. Advance expanding ripples
          const ripples = ripplesRef.current;
          for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.radius += r.speed * (dt / 60);
            if (r.radius >= r.maxRadius) {
              ripples.splice(i, 1);
            }
          }

          // 2. Physics update for each vector shape node
          const shapes = shapesRef.current;
          const rippleCount = ripples.length;

          for (let i = 0; i < shapes.length; i++) {
            const node = shapes[i];

            // (A) Direct Cursor Proximity Repulsion
            if (mouse.inside) {
              const dx = node.x - mouse.x;
              const dy = node.y - mouse.y;
              const dist = Math.hypot(dx, dy);

              const repulsionRadius =
                (160 + Math.min(mouse.smoothedSpeed * 0.18, 120)) *
                Math.sqrt(Math.max(0.2, mult));

              if (dist < repulsionRadius && dist > 1) {
                const norm = 1 - dist / repulsionRadius;
                const force =
                  norm *
                  norm *
                  40 *
                  (1 + Math.min(mouse.smoothedSpeed * 0.002, 2.2)) *
                  mult;

                node.vx += (dx / dist) * force;
                node.vy += (dy / dist) * force;

                node.vRot += (dx / dist) * 0.03 * norm * mult;
                node.vScale += norm * 0.06 * Math.min(mult, 2.0);
              }
            }

            // (B) Ripple Wave Disturbances (Neighbor Propagation)
            for (let rIdx = 0; rIdx < rippleCount; rIdx++) {
              const rip = ripples[rIdx];
              const dx = node.x - rip.x;
              const dy = node.y - rip.y;
              const dist = Math.hypot(dx, dy);
              const waveDelta = dist - rip.radius;

              const waveHalfWidth = 36;
              if (Math.abs(waveDelta) < waveHalfWidth) {
                const waveIntensity =
                  Math.cos((waveDelta / waveHalfWidth) * (Math.PI / 2)) *
                  (1 - rip.radius / rip.maxRadius) *
                  rip.intensity;

                if (dist > 1) {
                  node.vx += (dx / dist) * waveIntensity * 1.1;
                  node.vy += (dy / dist) * waveIntensity * 1.1;
                  node.vRot += (dy / dist) * waveIntensity * 0.02;
                }
              }
            }

            // (C) Spring-Damper Force returning to home grid position
            const stiffness = 0.095;
            const damping = 0.855;

            const fx = (node.homeX - node.x) * stiffness;
            const fy = (node.homeY - node.y) * stiffness;

            node.vx = (node.vx + fx) * damping;
            node.vy = (node.vy + fy) * damping;

            node.x += node.vx * dt;
            node.y += node.vy * dt;

            // (D) Angular Momentum & Spring Return
            const fRot = (node.homeRotation - node.rotation) * 0.07;
            node.vRot = (node.vRot + fRot) * 0.87;
            node.rotation += node.vRot * dt;

            // (E) Scale Spring Return (to homeScale = baseScale * shapeSize)
            const fScale = (node.homeScale - node.graphics.scale.x) * 0.12;
            node.vScale = (node.vScale + fScale) * 0.84;
            const targetScale = Math.max(
              0.15,
              node.graphics.scale.x + node.vScale * dt
            );

            // Apply transforms directly to PixiJS Graphics node
            node.graphics.position.set(node.x, node.y);
            node.graphics.rotation = node.rotation;
            node.graphics.scale.set(targetScale);
          }
        });

        // Window resize listener
        const handleResize = () => {
          if (!app.renderer) return;
          updateLayoutTargets(
            layoutModeRef.current,
            app.screen.width,
            app.screen.height,
            spacingRef.current
          );
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerleave", handlePointerLeave);
          container.removeEventListener("pointerdown", handlePointerDown);
          window.removeEventListener("resize", handleResize);
        };
      } catch (err) {
        console.error("Error during PixiJS v8 mount:", err);
      }
    };

    let cleanupListeners: (() => void) | undefined;
    mountPixi().then((cleanup) => {
      cleanupListeners = cleanup;
    });

    return () => {
      isCancelled = true;
      if (cleanupListeners) cleanupListeners();
      if (activeApp) {
        activeApp.destroy({ removeView: true }, { children: true });
        activeApp = null;
        appRef.current = null;
        patternContainerRef.current = null;
      }
    };
  }, [triggerScatter, updateLayoutTargets]);

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <header className={styles.topNav}>
        <div className={styles.navGroup}>
          <Link href="/" className={styles.backButton}>
            ← Desktop
          </Link>
          <div className={styles.badgePill}>
            <span
              className={styles.statusDot}
              style={{ backgroundColor: mainColor }}
            />
            <span>Pattern Playground</span>
          </div>
        </div>

        <div className={styles.navGroup}>
          <div className={styles.badgePill}>
            <span>{shapeCount} Vector Nodes • PixiJS v8</span>
          </div>
        </div>
      </header>

      {/* Main PixiJS Canvas Hosting Container */}
      <main ref={containerRef} className={styles.canvasContainer} />

      {/* Floating Bottom Control Bar & Customizer Drawer */}
      <footer className={styles.bottomOverlay}>
        {/* Customization Drawer Panel */}
        {isPanelOpen && (
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <span>🎨 Real-Time Pattern Controls</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={handleReset}
                  title="Reset all settings to default"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={() => setIsPanelOpen(false)}
                  title="Close panel"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 1. Main Color Control */}
            <div className={styles.controlField}>
              <div className={styles.labelRow}>
                <span>Color</span>
                <span className={styles.valBadge}>{mainColor.toUpperCase()}</span>
              </div>
              <div className={styles.colorPickerRow}>
                <div
                  className={styles.colorNativeWrapper}
                  style={{ backgroundColor: mainColor }}
                >
                  <input
                    type="color"
                    className={styles.colorNativeInput}
                    value={mainColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    title="Choose custom color"
                  />
                </div>
                <div className={styles.swatchesWrapper}>
                  {SWATCHES.map((s) => (
                    <button
                      key={s.hex}
                      type="button"
                      className={`${styles.swatchButton} ${
                        mainColor.toLowerCase() === s.hex.toLowerCase()
                          ? styles.swatchButtonActive
                          : ""
                      }`}
                      style={{ backgroundColor: s.hex }}
                      onClick={() => handleColorChange(s.hex)}
                      title={s.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Shape Size Slider */}
            <div className={styles.controlField}>
              <div className={styles.labelRow}>
                <span>Shape Size</span>
                <span className={styles.valBadge}>{shapeSize.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={shapeSize}
                onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            {/* 3. Spacing Slider */}
            <div className={styles.controlField}>
              <div className={styles.labelRow}>
                <span>Spacing</span>
                <span className={styles.valBadge}>{spacing}px</span>
              </div>
              <input
                type="range"
                min="45"
                max="115"
                step="1"
                value={spacing}
                onChange={(e) =>
                  handleSpacingChange(parseInt(e.target.value, 10))
                }
                className={styles.rangeInput}
              />
            </div>

            {/* 4. Density Slider */}
            <div className={styles.controlField}>
              <div className={styles.labelRow}>
                <span>Density</span>
                <span className={styles.valBadge}>{density} shapes</span>
              </div>
              <input
                type="range"
                min="40"
                max="240"
                step="5"
                value={density}
                onChange={(e) =>
                  handleDensityChange(parseInt(e.target.value, 10))
                }
                className={styles.rangeInput}
              />
            </div>

            {/* 5. Interaction Strength Slider */}
            <div className={styles.controlField}>
              <div className={styles.labelRow}>
                <span>Interaction Strength</span>
                <span className={styles.valBadge}>{strength.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={strength}
                onChange={(e) =>
                  handleStrengthChange(parseFloat(e.target.value))
                }
                className={styles.rangeInput}
              />
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className={styles.controlBar}>
          <button
            type="button"
            className={styles.primaryPillButton}
            onClick={() => triggerScatter()}
            title="Scatter shapes and watch them reorganize"
          >
            <span>💥 Scatter</span>
            {scatterCount > 0 && <span>({scatterCount})</span>}
          </button>

          <div className={styles.divider} />

          <button
            type="button"
            className={`${styles.pillButton} ${
              layoutMode === "staggered" ? styles.pillButtonActive : ""
            }`}
            onClick={() => handleModeChange("staggered")}
          >
            Staggered
          </button>
          <button
            type="button"
            className={`${styles.pillButton} ${
              layoutMode === "grid" ? styles.pillButtonActive : ""
            }`}
            onClick={() => handleModeChange("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            className={`${styles.pillButton} ${
              layoutMode === "orbit" ? styles.pillButtonActive : ""
            }`}
            onClick={() => handleModeChange("orbit")}
          >
            Orbit
          </button>

          <div className={styles.divider} />

          <button
            type="button"
            className={`${styles.pillButton} ${
              sensitivity === "dynamic" ? styles.pillButtonActive : ""
            }`}
            onClick={() =>
              setSensitivity(sensitivity === "dynamic" ? "gentle" : "dynamic")
            }
            title="Toggle cursor disturbance sensitivity"
          >
            {sensitivity === "dynamic" ? "⚡ Dynamic Speed" : "🍃 Gentle Wave"}
          </button>

          <div className={styles.divider} />

          <button
            type="button"
            className={`${styles.pillButton} ${
              isPanelOpen ? styles.pillButtonActive : ""
            }`}
            onClick={() => setIsPanelOpen((prev) => !prev)}
            title="Toggle customization controls panel"
          >
            ⚙️ Controls
          </button>
        </div>

        <div className={styles.instructionPill}>
          <span>Gently move cursor across the pattern</span>
          <span>•</span>
          <span>Faster movement creates a stronger ripple</span>
          <span>•</span>
          <span>Click anywhere to scatter</span>
        </div>
      </footer>
    </div>
  );
}