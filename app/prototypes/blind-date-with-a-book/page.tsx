"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Space_Mono } from "next/font/google";
import confetti from "canvas-confetti";
import styles from "./styles.module.css";
import { instrumentSans } from "../../fonts";
import { MoodType, BlindDateBook } from "./types";
import { MOODS } from "./data";
import { fetchBlindDateBook } from "./api";
import { bookAudio } from "./audio";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function BlindDateWithABook() {
  const [selectedMood, setSelectedMood] = useState<MoodType>("dreamy");
  const [customMoodInput, setCustomMoodInput] = useState<string>("");
  const [activeCustomMood, setActiveCustomMood] = useState<string | null>(null);

  const [status, setStatus] = useState<"loading" | "wrapped" | "unwrapping" | "revealed">("loading");
  const [currentBook, setCurrentBook] = useState<BlindDateBook | null>(null);
  const [coverFailed, setCoverFailed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>("");

  const moodSectionRef = useRef<HTMLDivElement>(null);
  const stageSectionRef = useRef<HTMLDivElement>(null);

  // Load a mystery book for either preset or custom mood
  const loadBook = useCallback(
    async (moodOrPhrase: MoodType | string, forceNew: boolean = false) => {
      setStatus("loading");
      setCoverFailed(false);
      setAnnouncement(`Selecting a mystery title for "${moodOrPhrase}" mood...`);

      try {
        const book = await fetchBlindDateBook(moodOrPhrase, forceNew);
        setCurrentBook(book);
        setStatus("wrapped");
        setAnnouncement(`Your mystery book for "${moodOrPhrase}" is wrapped and ready to reveal.`);
      } catch {
        // Handled internally in api.ts via fallbacks
        setStatus("wrapped");
      }
    },
    []
  );

  // Initialize on first render with the default mood
  useEffect(() => {
    loadBook("dreamy");
  }, [loadBook]);

  // Handle Preset Mood Selection (prioritizes preset, clears custom)
  const handleSelectPresetMood = (mood: MoodType) => {
    bookAudio.stamp();
    setSelectedMood(mood);
    setActiveCustomMood(null);
    loadBook(mood, true);

    // Smooth scroll down to stage if on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(() => {
        stageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  // Handle Custom Mood Form Submit (prioritizes custom mood)
  const handleCustomMoodSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customMoodInput.trim();
    if (!trimmed) return;

    bookAudio.stamp();
    setActiveCustomMood(trimmed);
    loadBook(trimmed, true);

    setTimeout(() => {
      stageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Handle Clicking a Suggestion Phrase
  const handleSuggestionClick = (phrase: string) => {
    setCustomMoodInput(phrase);
    bookAudio.stamp();
    setActiveCustomMood(phrase);
    loadBook(phrase, true);

    setTimeout(() => {
      stageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Clear Custom Mood and revert to preset
  const handleClearCustomMood = () => {
    bookAudio.tick();
    setCustomMoodInput("");
    setActiveCustomMood(null);
    loadBook(selectedMood, true);
  };

  // Handle "PULL TO UNWRAP"
  const handleUnwrap = () => {
    if (status !== "wrapped" || !currentBook) return;

    bookAudio.rustle();
    setStatus("unwrapping");
    setAnnouncement("Unwrapping your mystery book...");

    // Celebratory Literary Confetti (Warm tones: Burgundy, Rose, Cream, Sage, Gold)
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#7B283C", "#DCA6AD", "#A9B8A0", "#F7F0E5", "#D4AF37"],
        shapes: ["circle", "square"],
      });
      bookAudio.reveal();
      setStatus("revealed");
      setAnnouncement(`Revealed: ${currentBook.title} by ${currentBook.author}.`);
    }, 550);
  };

  // Keyboard accessibility for unwrapping
  const handleUnwrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUnwrap();
    }
  };

  // Handle "DATE AGAIN" (respects active custom mood or preset mood)
  const handleDateAgain = () => {
    bookAudio.tick();
    const active = activeCustomMood || selectedMood;
    loadBook(active, true);
    setTimeout(() => {
      stageSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Toggle Sound
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    bookAudio.muted = nextMuted;
    if (!nextMuted) {
      bookAudio.tick();
    }
  };

  // Smooth scroll from hero to mood selection
  const scrollToMoods = () => {
    bookAudio.tick();
    moodSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const activeMoodConfig = MOODS.find((m) => m.id === selectedMood) || MOODS[0];
  const displayActiveMoodName = activeCustomMood
    ? `“${activeCustomMood}”`
    : activeMoodConfig.label;

  return (
    <div className={`${styles.pageContainer} ${instrumentSans.className}`}>
      {/* Screen Reader Live Region for Accessible Announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
        }}
      >
        {announcement}
      </div>

      {/* Tactile SVG Paper Grain Noise Filter */}
      <svg className={styles.grainOverlay} aria-hidden="true">
        <filter id="vintagePaperGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0.08 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#vintagePaperGrain)" />
      </svg>

      {/* Editorial Masthead & Navigation */}
      <header className={styles.masthead}>
        <div className={styles.mastheadLeft}>
          <Link href="/" className={styles.backLink}>
            ← Workspace
          </Link>
          <span className={styles.shopBadge}>Independent Literary Salon • No. 04</span>
        </div>

        <div className={styles.mastheadRight}>
          <button
            type="button"
            className={styles.soundToggle}
            onClick={toggleSound}
            title={isMuted ? "Turn sound on" : "Mute sound effects"}
            aria-label={isMuted ? "Sound muted, click to unmute" : "Sound enabled, click to mute"}
          >
            <span>{isMuted ? "🔇" : "🔔"}</span>
            <span>{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>
        </div>
      </header>

      {/* Section 1: Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroTaglinePill}>
          <span className={styles.heroStar}>✦</span>
          <span>Curated Literary Matchmaking</span>
          <span className={styles.heroStar}>✦</span>
        </div>

        <h1 className={`${styles.heroTitle} ${playfair.className}`}>
          Blind Date With a Book.
        </h1>

        <p className={styles.heroSubtitle}>
          One mood. One mystery. One unexpected story. Choose your reading atmosphere, receive a parcel wrapped in paper, and pull the tab to reveal your literary companion.
        </p>

        <button
          type="button"
          className={styles.heroCtaButton}
          onClick={scrollToMoods}
        >
          <span>Find My Blind Date</span>
          <span>↓</span>
        </button>
      </section>

      {/* Section 2: Mood Selection (6 Postage Stamps + Custom Note Input) */}
      <section ref={moodSectionRef} className={styles.moodSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Step 01 • The Atmosphere</span>
          <h2 className={`${styles.sectionTitle} ${playfair.className}`}>
            Select Your Reading Mood
          </h2>
          <p className={styles.sectionHint}>
            Pick a collectible stamp or write down exactly how you feel to query Open Library.
          </p>
        </div>

        {/* 6 Collectible Postage Stamps */}
        <div className={styles.moodGrid} role="radiogroup" aria-label="Reading mood options">
          {MOODS.map((mood) => {
            const isActive = !activeCustomMood && selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`${styles.moodStamp} ${isActive ? styles.moodStampActive : ""}`}
                onClick={() => handleSelectPresetMood(mood.id)}
                style={{
                  backgroundColor: isActive ? mood.stampBg : undefined,
                }}
              >
                <span className={`${styles.stampPrice} ${spaceMono.className}`}>
                  {mood.postagePrice}
                </span>
                <span className={styles.stampIcon} aria-hidden="true">
                  {mood.icon}
                </span>
                <span className={`${styles.stampLabel} ${playfair.className}`}>
                  {mood.label}
                </span>
                <span className={styles.stampTagline}>{mood.tagline}</span>

                {/* Decorative postmark cancellation ink lines */}
                <svg
                  className={styles.stampInkMark}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M2 6 Q 7 2, 12 6 T 22 6" />
                  <path d="M2 12 Q 7 8, 12 12 T 22 12" />
                  <path d="M2 18 Q 7 14, 12 18 T 22 18" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Custom Mood Handwritten Note & Input */}
        <div className={styles.customMoodContainer}>
          <div className={styles.customMoodDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerOrnament}>✦ ✧ ✦</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.customMoodCard}>
            <div className={styles.customMoodTape} aria-hidden="true" />

            <div className={styles.customMoodHeader}>
              <span className={styles.customMoodLabel}>
                <span className={styles.customMoodQuill} aria-hidden="true">
                  ✒️
                </span>
                <span>Or Write Your Own Mood</span>
              </span>

              {activeCustomMood && (
                <span className={styles.activeCustomBadge}>
                  <span>Active: “{activeCustomMood}”</span>
                  <button
                    type="button"
                    className={styles.clearCustomBtn}
                    onClick={handleClearCustomMood}
                    title="Clear custom note and revert to preset stamp"
                    aria-label="Clear custom mood"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            <form onSubmit={handleCustomMoodSubmit} className={styles.customMoodForm}>
              <div className={styles.customMoodInputWrapper}>
                <input
                  type="text"
                  value={customMoodInput}
                  onChange={(e) => setCustomMoodInput(e.target.value)}
                  placeholder="Today, I feel like..."
                  className={`${styles.customMoodInput} ${playfair.className}`}
                  aria-label="Write your own reading mood"
                />
              </div>

              <button
                type="submit"
                className={styles.customMoodSubmitBtn}
                disabled={!customMoodInput.trim()}
              >
                <span>Find My Mystery Book</span>
                <span>→</span>
              </button>
            </form>

            {/* Suggested Natural Phrases */}
            <div className={styles.customMoodSuggestions}>
              <span className={styles.suggestionPrompt}>Or try:</span>
              {[
                "I feel lonely",
                "I want an adventure",
                "I need comfort",
                "I'm feeling nostalgic",
              ].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  className={styles.suggestionChip}
                  onClick={() => handleSuggestionClick(phrase)}
                >
                  “{phrase}”
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sections 3, 4 & 5: Interactive Mystery Stage */}
      <section ref={stageSectionRef} className={styles.mysteryStage}>
        <div className={styles.stageStatusBanner}>
          <span>Mood:</span>
          <strong>{displayActiveMoodName}</strong>
          {activeCustomMood && (
            <button
              type="button"
              className={styles.clearCustomBtn}
              onClick={handleClearCustomMood}
              title="Clear custom note and return to preset stamp"
              aria-label="Clear custom mood"
            >
              ✕
            </button>
          )}
          <span>•</span>
          <span>{status === "revealed" ? "Match Unwrapped" : "Mystery Parcel"}</span>
        </div>

        {/* Loading State: Searching library shelves */}
        {status === "loading" && (
          <div className={styles.loadingBox} role="status">
            <div className={styles.loadingSpinner} />
            <h3 className={`${styles.loadingText} ${playfair.className}`}>
              Searching the Rare Book Archives...
            </h3>
            <p className={styles.loadingSub}>
              Matching an authentic title from Open Library for {displayActiveMoodName}
            </p>
          </div>
        )}

        {/* Sections 3 & 4: Mystery Wrapped Book with "PULL TO UNWRAP" */}
        {(status === "wrapped" || status === "unwrapping") && currentBook && (
          <div
            className={`${styles.bookStageWrapper} ${
              status === "unwrapping" ? styles.isUnwrapping : ""
            }`}
          >
            <div className={styles.wrappedBookCard}>
              {/* 3D Book Spine Shading */}
              <div className={styles.bookSpineEffect} />

              {/* Diagonal Wrap Creases */}
              <div className={styles.paperWrapCreaseTop} />
              <div className={styles.paperWrapCreaseBottom} />

              {/* Tied Fabric Ribbons */}
              <div className={styles.verticalRibbon} />
              <div className={styles.horizontalRibbon} />

              {/* Center Embossed Wax Seal */}
              <div className={styles.waxSeal}>
                <span className={`${styles.waxSealInsignia} ${playfair.className}`}>
                  ?
                </span>
              </div>

              {/* Attached Vintage Luggage Tag with Non-Spoiler Clues */}
              <div className={styles.luggageTag}>
                <div className={styles.tagTwine} />
                <div className={styles.tagEyelet} />

                <div className={styles.tagHeader}>
                  <span className={styles.tagMysteryLabel}>Mystery Parcel Clues</span>
                  <span className={`${styles.tagStampMark} ${spaceMono.className}`}>
                    No Peeking
                  </span>
                </div>

                <div className={styles.clueList}>
                  <div className={styles.clueItem}>
                    <span className={styles.clueIcon}>✨</span>
                    <div className={styles.clueText}>
                      <span className={styles.clueBold}>Atmosphere: </span>
                      {currentBook.clues.vibe}
                    </div>
                  </div>

                  <div className={styles.clueItem}>
                    <span className={styles.clueIcon}>⏳</span>
                    <div className={styles.clueText}>
                      <span className={styles.clueBold}>Era: </span>
                      {currentBook.clues.era}
                    </div>
                  </div>

                  <div className={styles.clueItem}>
                    <span className={styles.clueIcon}>📖</span>
                    <div className={styles.clueText}>
                      <span className={styles.clueBold}>Length: </span>
                      {currentBook.clues.length}
                    </div>
                  </div>

                  <div className={styles.clueItem}>
                    <span className={styles.clueIcon}>☕</span>
                    <div className={styles.clueText}>
                      <span className={styles.clueBold}>Pairing: </span>
                      {currentBook.clues.pairing}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Unwrapping Interaction Tab */}
              <div className={styles.pullTabWrapper}>
                <button
                  type="button"
                  className={styles.pullTabButton}
                  onClick={handleUnwrap}
                  onKeyDown={handleUnwrapKeyDown}
                  disabled={status === "unwrapping"}
                  aria-label="Pull to unwrap book and reveal its title and cover"
                >
                  <span className={styles.scissorsGraphic} aria-hidden="true">
                    ✂
                  </span>
                  <span>Pull to Unwrap</span>
                  <span>→</span>
                </button>
                <span className={styles.pullHint}>Click or press Enter to break the wax seal</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Revealed Book Card (Library Borrower's Slip) */}
        {status === "revealed" && currentBook && (
          <div className={styles.revealContainer}>
            {/* Rubber Date Due Stamp */}
            <div className={`${styles.dateDueStamp} ${spaceMono.className}`}>
              Date Due: Today ✦ Matched
            </div>

            {/* Left: Real Book Cover */}
            <div className={styles.revealCoverCol}>
              <div className={styles.bookCover3D}>
                {currentBook.coverUrl && !coverFailed ? (
                  <Image
                    src={currentBook.coverUrl}
                    alt={`Real cover for ${currentBook.title}`}
                    width={280}
                    height={420}
                    className={styles.bookCoverImage}
                    onError={() => setCoverFailed(true)}
                    unoptimized
                  />
                ) : (
                  <div className={styles.bookCoverFallback}>
                    <span className={styles.fallbackFoilStar}>✦</span>
                    <div>
                      <h4 className={`${styles.fallbackTitle} ${playfair.className}`}>
                        {currentBook.title}
                      </h4>
                      <p className={styles.fallbackAuthor}>{currentBook.author}</p>
                    </div>
                    <span className={`${styles.fallbackFoilStar} ${spaceMono.className}`}>
                      {currentBook.firstPublishYear || "Library Edition"}
                    </span>
                  </div>
                )}
                <div className={styles.coverRibbonBookmark} />
              </div>
            </div>

            {/* Right: Vintage Library Borrower's Slip */}
            <div className={styles.revealCardCol}>
              <div>
                <div className={styles.cardHeader}>
                  <span className={styles.cardClassLabel}>
                    Official Match • {displayActiveMoodName}
                  </span>
                  <span className={`${styles.cardAccessionNo} ${spaceMono.className}`}>
                    {currentBook.key.replace("/works/", "OL-")}
                  </span>
                </div>

                <h3 className={`${styles.bookTitle} ${playfair.className}`}>
                  {currentBook.title}
                </h3>

                <p className={styles.bookAuthor}>
                  <span className={styles.bookAuthorPrefix}>Written by </span>
                  <strong>{currentBook.author}</strong>
                </p>

                {/* Genre & Meta Tags */}
                <div className={styles.metaTagsRow}>
                  {currentBook.firstPublishYear && (
                    <span className={`${styles.metaTagPill} ${styles.metaTagYear} ${spaceMono.className}`}>
                      First Published: {currentBook.firstPublishYear}
                    </span>
                  )}
                  {currentBook.pages && (
                    <span className={`${styles.metaTagPill} ${spaceMono.className}`}>
                      {currentBook.pages} pages
                    </span>
                  )}
                  {currentBook.subjects.slice(0, 4).map((sub, idx) => (
                    <span key={idx} className={styles.metaTagPill}>
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Book Synopsis / First Line */}
                <div className={styles.descriptionBox}>
                  <p className={styles.descriptionText}>
                    {currentBook.description ||
                      "An extraordinary story waiting to be discovered on your bookshelf. Visit Open Library to explore loans, edition details, and community reviews."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.dateAgainButton}
                  onClick={handleDateAgain}
                >
                  <span>Date Again</span>
                  <span>↺</span>
                </button>

                <a
                  href={currentBook.openLibraryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openLibraryLink}
                >
                  <span>View on Open Library</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer & Open Library Attribution */}
      <footer className={styles.pageFooter}>
        <p className={styles.attributionText}>
          Powered by the{" "}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.attributionLink}
          >
            Open Library Public API
          </a>{" "}
          &amp; Covers Service.
        </p>
        <p className={styles.footerNotes}>
          Designed as an interactive prototype for Master&apos;s Prototyping Workshop. No books were spoiled before unwrapping.
        </p>
      </footer>
    </div>
  );
}
