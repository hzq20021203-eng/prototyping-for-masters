import {
  MoodType,
  BlindDateBook,
  OpenLibrarySearchDoc,
  OpenLibraryWorkResponse,
} from "./types";
import { MOODS, FALLBACK_BOOKS, resolveCustomMood } from "./data";

// In-memory cache to prevent redundant Open Library requests (supports preset & custom mood keys)
const bookCache = new Map<string, BlindDateBook[]>();
const lastServedIndex = new Map<string, number>();

function cleanSubjectTag(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function generateEraClue(year?: number): string {
  if (!year) return "A timeless tale preserved through the years";
  if (year < 1850) return `A historic early literary classic from ${year}`;
  if (year < 1900) return `A 19th-century Victorian era classic (${year})`;
  if (year < 1950) return `A vintage Golden Age work from ${year}`;
  if (year < 2000) return `A late 20th-century favorite (${year})`;
  return `A contemporary story published in ${year}`;
}

function generateLengthClue(pages?: number): string {
  if (!pages) return "~320 pages • A captivating literary journey";
  if (pages < 220) return `~${pages} pages • A swift, evocative afternoon reverie`;
  if (pages <= 400) return `~${pages} pages • The ideal weekend companion`;
  return `~${pages} pages • A sweeping, immersive literary epic`;
}

function generateVibeClue(
  subjects: string[] = [],
  mood: MoodType,
  title: string,
  customVibeWords?: string[]
): string {
  const moodCfg = MOODS.find((m) => m.id === mood);
  const titleWords = title.toLowerCase().split(/\s+/);

  // Filter out subjects that give away the title or are too generic
  const filtered = subjects
    .filter((s) => {
      const lower = s.toLowerCase();
      if (lower.includes("fiction") || lower.includes("accessible book")) return false;
      if (lower.includes("protected daisy") || lower.includes("in library")) return false;
      if (titleWords.some((w) => w.length > 3 && lower.includes(w))) return false;
      return true;
    })
    .slice(0, 3)
    .map(cleanSubjectTag);

  if (filtered.length >= 2) {
    return filtered.join(" • ");
  }

  // Combine with curated mood vibes
  const fallbacks =
    customVibeWords || moodCfg?.clueHints.vibeWords || ["Atmospheric", "Intriguing"];
  return [...filtered, ...fallbacks.slice(0, 3 - filtered.length)].join(" • ");
}

/**
 * Fetch additional work synopsis from Open Library when available
 */
async function fetchWorkDescription(workKey: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const cleanKey = workKey.startsWith("/") ? workKey : `/${workKey}`;
    const url = `https://openlibrary.org${cleanKey}.json`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return "";
    const data: OpenLibraryWorkResponse = await res.json();

    if (!data.description) return "";
    if (typeof data.description === "string") {
      return data.description.trim();
    }
    if (typeof data.description === "object" && data.description.value) {
      return data.description.value.trim();
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * Core matching function: selects a book for either a predefined mood or a custom typed mood phrase
 */
export async function fetchBlindDateBook(
  moodOrPhrase: MoodType | string,
  forceNew: boolean = false
): Promise<BlindDateBook> {
  const isPreset = MOODS.some((m) => m.id === moodOrPhrase);
  const presetConfig = isPreset
    ? MOODS.find((m) => m.id === moodOrPhrase) || MOODS[0]
    : null;

  // Resolve custom mood details if it's not a preset ID
  const customResolution = !isPreset
    ? resolveCustomMood(moodOrPhrase)
    : null;

  const cacheKey = isPreset ? moodOrPhrase : `custom:${moodOrPhrase.trim().toLowerCase()}`;
  const subjectQuery = presetConfig
    ? presetConfig.subjectQuery
    : customResolution!.subjectQuery;
  const nearestPreset = presetConfig
    ? (presetConfig.id as MoodType)
    : customResolution!.nearestPreset;
  const pairingNote = presetConfig
    ? presetConfig.clueHints.pairingNote
    : customResolution!.pairingNote;
  const vibeWords = presetConfig
    ? presetConfig.clueHints.vibeWords
    : customResolution!.vibeWords;
  const displayMoodName = presetConfig
    ? presetConfig.label
    : customResolution!.displayMood;

  // 1. Check in-memory cache first
  const cachedList = bookCache.get(cacheKey);
  if (cachedList && cachedList.length > 0) {
    const prevIdx = lastServedIndex.get(cacheKey) ?? -1;
    let nextIdx = (prevIdx + 1) % cachedList.length;
    if (forceNew && cachedList.length > 1) {
      nextIdx = (prevIdx + 1) % cachedList.length;
    }
    lastServedIndex.set(cacheKey, nextIdx);
    return cachedList[nextIdx];
  }

  // 2. Fetch from Open Library Search API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);

    const query = encodeURIComponent(subjectQuery);
    const searchUrl = `https://openlibrary.org/search.json?q=${query}&limit=25&fields=key,title,author_name,first_publish_year,cover_i,subject,first_sentence,number_of_pages_median`;

    const res = await fetch(searchUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Open Library search responded with status ${res.status}`);
    }

    const data = await res.json();
    const docs: OpenLibrarySearchDoc[] = Array.isArray(data.docs) ? data.docs : [];

    // Filter suitable books: must have valid key, title, and at least one author
    const validDocs = docs.filter(
      (d) =>
        d.key &&
        d.title &&
        Array.isArray(d.author_name) &&
        d.author_name.length > 0 &&
        Boolean(d.cover_i)
    );

    if (validDocs.length === 0) {
      throw new Error("No suitable books found with cover art for this mood");
    }

    // Transform docs into BlindDateBook entities
    const processedBooks: BlindDateBook[] = validDocs.map((doc) => {
      const author = doc.author_name ? doc.author_name[0] : "Unknown Author";
      const year = doc.first_publish_year;
      const pages = doc.number_of_pages_median;
      const subjects = doc.subject || [];
      const cleanKey = doc.key.startsWith("/works/") ? doc.key : `/works/${doc.key}`;

      let firstSentenceStr = "";
      if (Array.isArray(doc.first_sentence) && doc.first_sentence.length > 0) {
        firstSentenceStr = doc.first_sentence[0];
      } else if (typeof doc.first_sentence === "string") {
        firstSentenceStr = doc.first_sentence;
      }

      return {
        key: cleanKey,
        title: doc.title,
        author,
        firstPublishYear: year,
        coverId: doc.cover_i,
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
          : undefined,
        subjects: subjects.slice(0, 6).map(cleanSubjectTag),
        description: firstSentenceStr,
        pages,
        openLibraryUrl: `https://openlibrary.org${cleanKey}`,
        mood: moodOrPhrase,
        displayMoodName,
        clues: {
          era: generateEraClue(year),
          length: generateLengthClue(pages),
          vibe: generateVibeClue(subjects, nearestPreset, doc.title, vibeWords),
          pairing: pairingNote,
        },
      };
    });

    // Cache the processed books for this mood / query
    bookCache.set(cacheKey, processedBooks);
    lastServedIndex.set(cacheKey, 0);

    const chosen = processedBooks[0];

    // Attempt to enrich with full description if search doc had no first sentence
    if (!chosen.description) {
      const fullDesc = await fetchWorkDescription(chosen.key);
      if (fullDesc) {
        chosen.description = fullDesc;
      }
    }

    return chosen;
  } catch {
    // 3. Fallback gracefully to high-quality curated real books
    const fallbackList = FALLBACK_BOOKS[nearestPreset] || FALLBACK_BOOKS.dreamy;
    const prevIdx = lastServedIndex.get(cacheKey) ?? -1;
    const nextIdx = (prevIdx + 1) % fallbackList.length;
    lastServedIndex.set(cacheKey, nextIdx);

    const baseFallback = fallbackList[nextIdx];

    // If custom mood was requested, tailor the fallback's clue pairing and display name
    if (!isPreset && customResolution) {
      return {
        ...baseFallback,
        mood: moodOrPhrase,
        displayMoodName,
        clues: {
          ...baseFallback.clues,
          pairing: customResolution.pairingNote,
          vibe: generateVibeClue(
            baseFallback.subjects,
            nearestPreset,
            baseFallback.title,
            customResolution.vibeWords
          ),
        },
      };
    }

    return baseFallback;
  }
}
