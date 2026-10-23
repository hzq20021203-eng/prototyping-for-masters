# Blind Date With a Book 📖

A playful, mysterious literary matchmaking experience inspired by independent vintage bookshops and experimental editorial graphic design.

Users choose their reading mood from 6 collectible postage stamps or write down their own mood on a vintage memo note, receive a mystery parcel wrapped in kraft paper with tied velvet ribbons and a wax seal, inspect non-spoiler clues, and pull an interactive paper tab to unwrap and reveal an authentic book recommendation dynamically fetched from the public Open Library API.

---

## 🎨 Visual Identity & Style

- **Color Palette**:
  - Warm cream: `#F7F0E5`
  - Deep burgundy: `#7B283C`
  - Dusty pink: `#DCA6AD`
  - Sage green: `#A9B8A0`
  - Dark brown: `#302820`
- **Typography**:
  - Oversized elegant serif headlines: `Playfair Display`
  - Contemporary sans-serif labels: `Instrument Sans`
  - Monospace library timestamps: `Space Mono`
- **Tactile Details**:
  - CSS & SVG layered parcel wrap with realistic diagonal creases, velvet ribbon cross-bands, and embossed wax seal.
  - Collectible postage stamp buttons with postmark cancellation ink waves.
  - Handwritten desk memo note with washi tape for custom mood input.
  - Library borrower's checkout slip with rubber date due stamps.
  - SVG fractal paper grain texture overlay.
  - Procedural Web Audio synthesizer (zero external dependencies) simulating stamp thuds, paper rustling, and reveal chimes.

---

## 📚 Open Library API Integration & Mood Mapping

- **6 Predefined Mood Stamps**:
  - **Dreamy**: Magical realism, mythology, surreal & lyrical prose (`subject:magical_realism`)
  - **Mysterious**: Gothic secrets, noir shadows & puzzles (`subject:gothic_fiction OR subject:mystery`)
  - **Romantic**: Love letters, yearning & slow sparks (`subject:love_stories OR subject:romance`)
  - **Adventurous**: Expeditions, sea voyages & daring escapes (`subject:adventure OR subject:sea_stories`)
  - **Cozy**: Quaint villages, baking & gentle mysteries (`subject:domestic_fiction OR subject:cozy_mystery`)
  - **Chaotic**: Satire, sharp wit & delightfully unhinged tales (`subject:satire OR subject:humorous_stories`)

- **Custom Mood Input ("Write Your Own Mood")**:
  - Type any custom mood or natural phrase, such as:
    - `"I feel lonely"` → Maps to solitude, friendship, and quiet reflection.
    - `"I want an adventure"` → Maps to expeditions, journeys, and high-seas daring.
    - `"I need comfort"` → Maps to hearthside warmth, domestic fiction, and soothing words.
    - `"I'm feeling nostalgic"` → Maps to bittersweet memories, coming of age, and golden-era prose.
  - Custom moods are prioritized when entered, with quick-select suggestion chips and a clear button to return to preset stamps.
  - Abstract or unfamiliar moods fall back to dynamic subject queries and literary fiction without ever failing.

- **Covers API**: Real book covers fetched via `https://covers.openlibrary.org/b/id/{cover_i}-L.jpg`.
- **In-Memory Caching**: Caches search results locally so changing moods or dating again avoids redundant network requests.
- **Offline Fallback**: Curated collection of verified Open Library books per mood guarantees instant, error-free presentation even if Open Library is slow or offline.
- **Zero Inventions**: All titles, authors, first publication years, descriptions, and cover IDs reflect genuine Open Library catalog data.

---

## 🕹️ User Interaction Flow

1. **Hero**: Editorial masthead and introduction with sound toggle and smooth scroll CTA.
2. **Mood Selection**: 6 collectible vintage postage stamps + handwritten memo note input with "FIND MY MYSTERY BOOK" button.
3. **Wrapped Mystery Book**: Displays dimensional parcel wrapping, ribbon, wax seal, and 4 non-spoiler clues (Atmosphere, Era, Reading Length, Suggested Pairing).
4. **Pull to Unwrap**: Perforated tab breaks the wax seal, slides the ribbons away, triggers a literary confetti explosion, and reveals the real book.
5. **Borrower's Slip**: Displays the official Open Library cover, book title, author, year, genre tags, description, and direct link to Open Library.
6. **Date Again**: Instantly reveals another mystery book matching your selected mood or custom note.

---

## ♿ Accessibility & Responsive Design

- Keyboard navigable: `Tab`, `Enter`, and `Space` supported on mood stamps, the custom mood input, and the "Pull to Unwrap" tab.
- Live region (`aria-live="polite"`) announces current mood and book reveals to screen reader users.
- `prefers-reduced-motion` media queries disable 3D transformations and confetti bursts for users who prefer reduced motion.
- Fully responsive on mobile, tablet, and desktop screens.
