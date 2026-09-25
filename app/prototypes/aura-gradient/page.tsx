"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

interface Palette {
  name: string;
  id: string;
  colors: [string, string, string, string, string];
}

const PALETTES: Palette[] = [
  {
    name: "Twilight",
    id: "twilight",
    colors: ["#ffaa71", "#d8b4f8", "#ff9ebb", "#a0c4ff", "#ffe29f"],
  },
  {
    name: "Sunset Gold",
    id: "sunset",
    colors: ["#ff7e67", "#fdbb58", "#e056fd", "#686de0", "#ffbe76"],
  },
  {
    name: "Pastel Aura",
    id: "pastel",
    colors: ["#b5ead7", "#e2f0cb", "#ffdac1", "#ffb7b2", "#c7ceea"],
  },
  {
    name: "Cosmic Glow",
    id: "cosmic",
    colors: ["#00f2fe", "#4facfe", "#fa709a", "#fee140", "#b388eb"],
  },
];

export default function AuraGradientPrototype() {
  const [activePalette, setActivePalette] = useState<Palette>(PALETTES[0]);
  const [blurAmount, setBlurAmount] = useState<number>(85);
  const [grainOpacity, setGrainOpacity] = useState<number>(0.45);
  const [grainFreq, setGrainFreq] = useState<number>(0.72);
  const [grainEnabled, setGrainEnabled] = useState<boolean>(true);
  const [mouseFollow, setMouseFollow] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseFollow) return;
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseFollow]);

  // CSS variables applied to container for dynamic color transitions
  const containerStyle = {
    "--color-blob-1": activePalette.colors[0],
    "--color-blob-2": activePalette.colors[1],
    "--color-blob-3": activePalette.colors[2],
    "--color-blob-4": activePalette.colors[3],
    "--color-blob-5": activePalette.colors[4],
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={containerStyle} ref={containerRef}>
      {/* Real-time Mathematical SVG Grain Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <filter id="tactile-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={grainFreq}
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Floating Aura Blobs Mesh */}
      <div
        className={styles.auraCanvas}
        style={{ filter: `blur(${blurAmount}px)` }}
      >
        <div className={`${styles.auraBlob} ${styles.blob1}`} />
        <div className={`${styles.auraBlob} ${styles.blob2}`} />
        <div className={`${styles.auraBlob} ${styles.blob3}`} />
        <div className={`${styles.auraBlob} ${styles.blob4}`} />
        <div className={`${styles.auraBlob} ${styles.blob5}`} />

        {/* Cursor interactive ambient glow */}
        {mouseFollow && (
          <div
            className={styles.mouseBlob}
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              opacity: mousePos.x > -500 ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* Tactile Film-Grain Noise Overlay Layer */}
      <div
        className={styles.grainOverlay}
        style={{
          filter: "url(#tactile-grain)",
          opacity: grainEnabled ? grainOpacity : 0,
        }}
      />

      {/* Top Header Navigation */}
      <header className={styles.topNav}>
        <Link href="/" className={styles.backButton}>
          ← Desktop
        </Link>
        <div className={styles.badgePill}>
          ✨ Grainy Blur Aesthetic
        </div>
      </header>

      {/* Interactive Stage & Controls */}
      <main className={styles.stage}>
        <section className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Aura Mesh Gradient</h1>
          <p className={styles.heroSubtitle}>
            Diffused Gaussian blur with warm pastel twilight tones and a tactile film-grain noise overlay.
          </p>
        </section>

        {/* Frosted Glass Playground Panel */}
        <section className={styles.controlCard}>
          {/* Palette Selector */}
          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <span>Color Palette</span>
              <span className={styles.controlValue}>{activePalette.name}</span>
            </div>
            <div className={styles.paletteRow}>
              {PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  className={`${styles.paletteButton} ${
                    activePalette.id === palette.id ? styles.paletteButtonActive : ""
                  }`}
                  onClick={() => setActivePalette(palette)}
                >
                  <div className={styles.palettePreviewDots}>
                    {palette.colors.map((c, i) => (
                      <span
                        key={i}
                        className={styles.previewDot}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gaussian Blur Slider */}
          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <span>Gaussian Blur</span>
              <span className={styles.controlValue}>{blurAmount}px</span>
            </div>
            <input
              type="range"
              min="30"
              max="140"
              step="5"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              className={styles.slider}
              aria-label="Adjust Gaussian Blur"
            />
          </div>

          {/* Film Grain Opacity Slider */}
          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <span>Film Grain Opacity</span>
              <span className={styles.controlValue}>
                {grainEnabled ? `${Math.round(grainOpacity * 100)}%` : "Disabled"}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.85"
              step="0.05"
              value={grainOpacity}
              disabled={!grainEnabled}
              onChange={(e) => setGrainOpacity(Number(e.target.value))}
              className={styles.slider}
              aria-label="Adjust Film Grain Opacity"
            />
          </div>

          {/* Grain Scale / Frequency */}
          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <span>Grain Granularity (feTurbulence)</span>
              <span className={styles.controlValue}>{grainFreq.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.1"
              step="0.04"
              value={grainFreq}
              disabled={!grainEnabled}
              onChange={(e) => setGrainFreq(Number(e.target.value))}
              className={styles.slider}
              aria-label="Adjust Grain Granularity"
            />
          </div>

          {/* Toggles */}
          <div className={styles.toggleRow}>
            <span className={styles.toggleLabel}>Tactile Film-Grain Overlay</span>
            <button
              type="button"
              className={`${styles.toggleButton} ${grainEnabled ? styles.toggleButtonActive : ""}`}
              onClick={() => setGrainEnabled(!grainEnabled)}
            >
              {grainEnabled ? "ON" : "OFF"}
            </button>
          </div>

          <div className={styles.toggleRow}>
            <span className={styles.toggleLabel}>Interactive Light Cursor</span>
            <button
              type="button"
              className={`${styles.toggleButton} ${mouseFollow ? styles.toggleButtonActive : ""}`}
              onClick={() => setMouseFollow(!mouseFollow)}
            >
              {mouseFollow ? "ENABLED" : "OFF"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
