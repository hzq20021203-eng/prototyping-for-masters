"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import styles from "./styles/home.module.css";
import { instrumentSans } from "./fonts";
import {
  DoodleStrawberry,
  DoodleSparkles,
  DoodleBow,
  DoodleBlossom,
  DoodleHeart,
  DoodleZoomPlus,
  DoodleFloppy,
  DoodleFolder,
  DoodleTrash,
  DoodlePushPin,
  DoodleIcon,
} from "./components/DoodleIcons";

interface PrototypeItem {
  title: string;
  description: string;
  path: string;
  icon?: string;
  tag?: string;
  size?: string;
}

export default function Home() {
  // Add your prototypes to this array
  const prototypes: PrototypeItem[] = [
    {
      title: "Getting started",
      description: "How to create a prototype and master the workshop workflow",
      path: "/prototypes/example",
      icon: "🌸",
      tag: "Guide",
      size: "1.2 KB",
    },
    {
      title: "Confetti button",
      description: "An interactive button that creates a colorful confetti explosion",
      path: "/prototypes/confetti-button",
      icon: "🎉",
      tag: "Interactive",
      size: "2.4 KB",
    },
    {
      title: "Aura mesh gradient",
      description: "Diffused Gaussian blur with warm pastel twilight tones and tactile film-grain noise",
      path: "/prototypes/aura-gradient",
      icon: "✨",
      tag: "Aesthetic",
      size: "3.1 KB",
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const popSweetConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.35 },
      colors: ["#ffb6d9", "#b5e2fa", "#fff1c5", "#c5b3f7", "#bcf4de"],
      shapes: ["circle", "square"],
    });
  };

  return (
    <div className={`${styles.desktopContainer} ${instrumentSans.className}`}>
      {/* Top Classic Mac Menu Bar */}
      <header className={styles.menuBar}>
        <div className={styles.menuLeft}>
          <button
            type="button"
            className={styles.menuLogoButton}
            onClick={popSweetConfetti}
            title="Click for sparkles! 🍓"
          >
            <DoodleStrawberry size={20} />
          </button>
          <span className={styles.menuSystemTitle}>Kawaii OS 7.5</span>
          <span className={styles.menuItem}>File</span>
          <span className={styles.menuItem}>Edit</span>
          <span className={styles.menuItem}>View</span>
          <span className={styles.menuItem}>Special</span>
          <button
            type="button"
            className={styles.menuSparkleButton}
            onClick={popSweetConfetti}
          >
            <DoodleSparkles size={14} />
            <span>Sparkle</span>
          </button>
        </div>

        <div className={styles.menuRight}>
          <span className={styles.menuBadge}>
            <DoodleBow size={13} />
            <span>100% Cute</span>
          </span>
          <span className={styles.menuClock}>
            <DoodleBlossom size={13} />
            <span>{time ? time : "12:00 PM"}</span>
          </span>
        </div>
      </header>

      {/* Main Desktop Workspace */}
      <main className={styles.desktopWorkspace}>
        {/* Main Mac OS Window */}
        <section className={styles.windowContainer}>
          {/* Classic Mac Pinstripe Title Bar */}
          <div className={styles.windowTitleBar}>
            <button
              type="button"
              className={styles.windowCloseButton}
              onClick={popSweetConfetti}
              title="Close window (or celebrate!)"
            >
              <DoodleHeart size={12} />
            </button>

            <div className={styles.windowTitleBadge}>
              <DoodleBlossom size={16} />
              <h1 className={styles.windowTitleText}>Ziqing Huang's prototypes</h1>
              <DoodleBlossom size={16} />
            </div>

            <div className={styles.windowControlsRight}>
              <button
                type="button"
                className={styles.windowZoomButton}
                onClick={popSweetConfetti}
                title="Zoom"
              >
                <DoodleZoomPlus size={11} />
              </button>
            </div>
          </div>

          {/* Window Info Bar */}
          <div className={styles.windowInfoBar}>
            <div className={styles.windowInfoText}>
              <span>{prototypes.length} items</span>
              <span className={styles.infoDivider}>•</span>
              <span>1.4 MB in disk</span>
              <span className={styles.infoDivider}>•</span>
              <span className={styles.windowInfoHighlight}>250 MB free</span>
            </div>
            <div className={styles.windowInfoTag}>System 7.5 • Kawaii Edition</div>
          </div>

          {/* Window Body: Prototype Cards */}
          <div className={styles.windowContent}>
            <div className={styles.grid}>
              {prototypes.map((prototype, index) => (
                <Link
                  key={index}
                  href={prototype.path}
                  className={styles.card}
                >
                  <div className={styles.cardTopRow}>
                    <div className={styles.cardIconBox}>
                      <DoodleIcon name={prototype.icon} size={28} />
                    </div>
                    {prototype.tag && (
                      <span className={styles.cardTag}>{prototype.tag}</span>
                    )}
                  </div>

                  <h3 className={styles.cardTitle}>{prototype.title}</h3>
                  <p className={styles.cardDescription}>
                    {prototype.description}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.cardSize}>
                      {prototype.size || "1.0 KB"}
                    </span>
                    <span className={styles.cardOpenAction}>
                      Open App <span className={styles.cardArrow}>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Design helper note */}
            <div className={styles.windowBanner}>
              <DoodleSparkles size={20} />
              <p className={styles.windowBannerText}>
                <strong>Tip:</strong> Create your next prototype by copying{" "}
                <code className={styles.codeSnippet}>app/prototypes/_template</code>!
              </p>
            </div>
          </div>
        </section>

        {/* Desktop Sidebar (Classic Mac Icons & Sticky Note) */}
        <aside className={styles.desktopSidebar}>
          <button
            type="button"
            className={styles.desktopIconItem}
            onClick={popSweetConfetti}
            title="Double click for disk contents!"
          >
            <div className={styles.desktopIconGraphic}>
              <DoodleFloppy size={30} />
            </div>
            <span className={styles.desktopIconLabel}>Kawaii HD</span>
          </button>

          <button
            type="button"
            className={styles.desktopIconItem}
            onClick={popSweetConfetti}
          >
            <div className={styles.desktopIconGraphic}>
              <DoodleFolder size={30} />
            </div>
            <span className={styles.desktopIconLabel}>Masters Work</span>
          </button>

          <button
            type="button"
            className={styles.desktopIconItem}
            onClick={popSweetConfetti}
          >
            <div className={styles.desktopIconGraphic}>
              <DoodleTrash size={30} />
            </div>
            <span className={styles.desktopIconLabel}>Trash (empty)</span>
          </button>

          {/* Sticky Note */}
          <div className={styles.stickyNote}>
            <div className={styles.stickyNotePin}>
              <DoodlePushPin size={20} />
            </div>
            <div className={styles.stickyNoteTitle}>To-Do Note</div>
            <p className={styles.stickyNoteBody}>
              Welcome to Ziqing's prototyping lab! Click any card to test an interaction.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

