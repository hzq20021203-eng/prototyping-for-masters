import { MoodConfig, BlindDateBook, CustomMoodResolution } from "./types";

export const MOODS: MoodConfig[] = [
  {
    id: "dreamy",
    label: "Dreamy",
    tagline: "Magical realism, myths & starry prose",
    postagePrice: "25¢",
    icon: "🌙",
    subjectQuery: "subject:magical_realism",
    colorAccent: "#7B283C",
    stampBg: "#F4ECE1",
    clueHints: {
      atmosphere: "Ethereal, lyrical & softly blurring reality",
      pairingNote: "Jasmine tea & an open window under twilight",
      vibeWords: ["Lyrical", "Starry", "Enchanting", "Surreal", "Poetic"],
    },
  },
  {
    id: "mysterious",
    label: "Mysterious",
    tagline: "Gothic secrets, noir fog & unsolved puzzles",
    postagePrice: "40¢",
    icon: "🗝️",
    subjectQuery: "subject:gothic_fiction OR subject:mystery",
    colorAccent: "#302820",
    stampBg: "#EBE5DB",
    clueHints: {
      atmosphere: "Cobbled alleys, locked archives & whispered secrets",
      pairingNote: "Black coffee & candlelight on a stormy midnight",
      vibeWords: ["Gothic", "Tense", "Clever", "Shadowy", "Atmospheric"],
    },
  },
  {
    id: "romantic",
    label: "Romantic",
    tagline: "Written letters, yearning & slow sparks",
    postagePrice: "50¢",
    icon: "💌",
    subjectQuery: "subject:love_stories OR subject:romance",
    colorAccent: "#7B283C",
    stampBg: "#F7ECEE",
    clueHints: {
      atmosphere: "Electric glances, wax-sealed letters & devotion",
      pairingNote: "Red wine & a vintage armchair in lamplight",
      vibeWords: ["Yearning", "Tender", "Slow-Burn", "Passionate", "Bittersweet"],
    },
  },
  {
    id: "adventurous",
    label: "Adventurous",
    tagline: "Uncharted waters, expeditions & perilous journeys",
    postagePrice: "65¢",
    icon: "🧭",
    subjectQuery: "subject:adventure OR subject:sea_stories",
    colorAccent: "#A9B8A0",
    stampBg: "#EBF1E8",
    clueHints: {
      atmosphere: "Salt-spray winds, hidden maps & daring courage",
      pairingNote: "Strong spiced chai & a well-worn notebook",
      vibeWords: ["Daring", "Expansive", "Thrilling", "Uncharted", "Courageous"],
    },
  },
  {
    id: "cozy",
    label: "Cozy",
    tagline: "Warm tea, quaint villages & gentle comfort",
    postagePrice: "35¢",
    icon: "☕",
    subjectQuery: "subject:domestic_fiction OR subject:cozy_mystery OR subject:friendship",
    colorAccent: "#A9B8A0",
    stampBg: "#F5F2EB",
    clueHints: {
      atmosphere: "Rain on windowpanes, warm bread & gentle laughter",
      pairingNote: "Chamomile tea, honey & an oversized woolen knit",
      vibeWords: ["Gentle", "Heartwarming", "Quaint", "Nostalgic", "Soothing"],
    },
  },
  {
    id: "chaotic",
    label: "Chaotic",
    tagline: "Biting satire, sharp wit & absurd escapades",
    postagePrice: "75¢",
    icon: "⚡",
    subjectQuery: "subject:satire OR subject:humorous_stories",
    colorAccent: "#7B283C",
    stampBg: "#F9ECE8",
    clueHints: {
      atmosphere: "Whirlwind pacing, biting irony & glorious mischief",
      pairingNote: "Fizzy sparkling tonic & zero expectations",
      vibeWords: ["Unhinged", "Witty", "Biting", "Fast-Paced", "Audacious"],
    },
  },
];

export const FALLBACK_BOOKS: Record<string, BlindDateBook[]> = {
  dreamy: [
    {
      key: "/works/OL16086603W",
      title: "The Night Circus",
      author: "Erin Morgenstern",
      firstPublishYear: 2011,
      coverId: 8259447,
      coverUrl: "https://covers.openlibrary.org/b/id/8259447-L.jpg",
      subjects: ["Magical Realism", "Fantasy", "Romance", "Circus"],
      description:
        "The circus arrives without warning. It is simply there, when yesterday it was not. Within the black-and-white striped canvas tents is an utterly unique experience full of breathtaking amazements, where two young magicians are pitted in a fierce competition.",
      pages: 387,
      openLibraryUrl: "https://openlibrary.org/works/OL16086603W",
      mood: "dreamy",
      clues: {
        era: "Published in the early 2010s",
        length: "~380 pages • An immersive weekend journey",
        vibe: "Lyrical • Black-and-white tents • Clockwork wonders",
        pairing: "Jasmine tea & an open window under twilight",
      },
    },
    {
      key: "/works/OL16805822W",
      title: "The Ocean at the End of the Lane",
      author: "Neil Gaiman",
      firstPublishYear: 2013,
      coverId: 8235116,
      coverUrl: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
      subjects: ["Magical Realism", "Mythology", "Childhood", "Memory"],
      description:
        "A middle-aged man returns to his childhood home to attend a funeral. He finds himself drawn to the farm at the end of the road, where forty years earlier he knew a remarkable girl named Lettie Hempstock who claimed their duck pond was an ocean.",
      pages: 181,
      openLibraryUrl: "https://openlibrary.org/works/OL16805822W",
      mood: "dreamy",
      clues: {
        era: "Published in the 2010s",
        length: "~180 pages • A brief, poetic afternoon reverie",
        vibe: "Nostalgic • Ancient magic • Quiet wonders",
        pairing: "Warm milk with nutmeg & a quiet thunderstorm",
      },
    },
  ],
  mysterious: [
    {
      key: "/works/OL2893540W",
      title: "Rebecca",
      author: "Daphne du Maurier",
      firstPublishYear: 1938,
      coverId: 8231856,
      coverUrl: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      subjects: ["Gothic Fiction", "Mystery", "Psychological", "Manor House"],
      description:
        "Last night I dreamt I went to Manderley again. Working as a lady's companion, the heroine is swept off her feet by the dashing widower Maxim de Winter, only to arrive at his vast country estate haunted by the lingering shadow of his late first wife.",
      pages: 428,
      openLibraryUrl: "https://openlibrary.org/works/OL2893540W",
      mood: "mysterious",
      clues: {
        era: "A golden age classic from 1938",
        length: "~430 pages • A deeply layered, haunting affair",
        vibe: "Gothic • Mist-cloaked cliffs • Lingering shadows",
        pairing: "Black coffee & candlelight on a stormy midnight",
      },
    },
    {
      key: "/works/OL472449W",
      title: "And Then There Were None",
      author: "Agatha Christie",
      firstPublishYear: 1939,
      coverId: 8235269,
      coverUrl: "https://covers.openlibrary.org/b/id/8235269-L.jpg",
      subjects: ["Mystery", "Detective", "Locked Room", "Suspense"],
      description:
        "Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious host. When dinner is served, a phonograph record accuses each guest of harboring a guilty secret, and one by one they begin to perish.",
      pages: 272,
      openLibraryUrl: "https://openlibrary.org/works/OL472449W",
      mood: "mysterious",
      clues: {
        era: "First published in 1939",
        length: "~270 pages • Taut, breathless locked-room suspense",
        vibe: "Island manor • Clockwork dread • Unsolved riddles",
        pairing: "Earl Grey with lemon & locked doors",
      },
    },
  ],
  romantic: [
    {
      key: "/works/OL66554W",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      firstPublishYear: 1813,
      coverId: 8278278,
      coverUrl: "https://covers.openlibrary.org/b/id/8278278-L.jpg",
      subjects: ["Classic Romance", "Regency", "Humorous", "Social Manners"],
      description:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. The sparkling rivalry and deepening affection between Elizabeth Bennet and the proud Mr. Darcy remains the archetype of romantic fiction.",
      pages: 279,
      openLibraryUrl: "https://openlibrary.org/works/OL66554W",
      mood: "romantic",
      clues: {
        era: "Regency masterpiece from 1813",
        length: "~280 pages • Sparking wit & slow-burn chemistry",
        vibe: "Ballrooms • Sharp dialogue • Undeniable devotion",
        pairing: "Red wine & a vintage armchair in lamplight",
      },
    },
    {
      key: "/works/OL19661642W",
      title: "Normal People",
      author: "Sally Rooney",
      firstPublishYear: 2018,
      coverId: 8739161,
      coverUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
      subjects: ["Contemporary Romance", "Irish Literature", "Coming of Age"],
      description:
        "At school Marianne and Connell pretend not to know each other. Connell is popular and well-liked, while Marianne is lonely and proud. When they both earn spots at Trinity College in Dublin, a connection sparks that will draw them in and out of each other's lives.",
      pages: 273,
      openLibraryUrl: "https://openlibrary.org/works/OL19661642W",
      mood: "romantic",
      clues: {
        era: "Contemporary 2018 story",
        length: "~270 pages • Raw emotional intimacy",
        vibe: "Quiet ache • Shared silences • Magnetic pull",
        pairing: "Hot pour-over coffee & wistful indie tunes",
      },
    },
  ],
  adventurous: [
    {
      key: "/works/OL24177W",
      title: "Treasure Island",
      author: "Robert Louis Stevenson",
      firstPublishYear: 1883,
      coverId: 8235213,
      coverUrl: "https://covers.openlibrary.org/b/id/8235213-L.jpg",
      subjects: ["Adventure", "Pirates", "Sea Stories", "Treasure"],
      description:
        "When young Jim Hawkins discovers a weathered oilskin packet containing an island map with red crosses marking buried treasure, he embarks on an adventurous sea voyage aboard the Hispaniola that will pit him against the cunning Long John Silver.",
      pages: 311,
      openLibraryUrl: "https://openlibrary.org/works/OL24177W",
      mood: "adventurous",
      clues: {
        era: "Victorian high-seas epic from 1883",
        length: "~310 pages • Brimming with swashbuckling danger",
        vibe: "X-marks-the-spot • Salt air • Daring escapes",
        pairing: "Strong spiced chai & a well-worn notebook",
      },
    },
    {
      key: "/works/OL1097893W",
      title: "Around the World in Eighty Days",
      author: "Jules Verne",
      firstPublishYear: 1873,
      coverId: 8235338,
      coverUrl: "https://covers.openlibrary.org/b/id/8235338-L.jpg",
      subjects: ["Expedition", "Travel", "Adventure", "Steamship"],
      description:
        "Phileas Fogg wagers his entire fortune of twenty thousand pounds that he can circumnavigate the globe in just eighty days. Accompanied by his resourceful French valet Passepartout, he braves steamships, railways, elephants, and typhoons.",
      pages: 252,
      openLibraryUrl: "https://openlibrary.org/works/OL1097893W",
      mood: "adventurous",
      clues: {
        era: "Published in 1873",
        length: "~250 pages • Fast-paced whirlwind expedition",
        vibe: "Pocket watches • Steam engines • Against-the-clock",
        pairing: "Espresso & an open compass",
      },
    },
  ],
  cozy: [
    {
      key: "/works/OL52093W",
      title: "Anne of Green Gables",
      author: "L. M. Montgomery",
      firstPublishYear: 1908,
      coverId: 8235237,
      coverUrl: "https://covers.openlibrary.org/b/id/8235237-L.jpg",
      subjects: ["Friendship", "Prince Edward Island", "Family", "Classics"],
      description:
        "When elderly brother and sister Matthew and Marilla Cuthbert decide to adopt an orphan boy to help with their farm, an unexpected mix-up sends them Anne Shirley—an imaginative, freckled, fiercely spirited red-headed girl who transforms their lives.",
      pages: 320,
      openLibraryUrl: "https://openlibrary.org/works/OL52093W",
      mood: "cozy",
      clues: {
        era: "Beloved 1908 classic",
        length: "~320 pages • Pure sunshine & heartwarming kindred spirits",
        vibe: "Apple orchards • Wild imaginations • Warm hearths",
        pairing: "Chamomile tea, honey & an oversized woolen knit",
      },
    },
    {
      key: "/works/OL20849903W",
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      firstPublishYear: 2020,
      coverId: 10427845,
      coverUrl: "https://covers.openlibrary.org/b/id/10427845-L.jpg",
      subjects: ["Found Family", "Fantasy", "Humorous", "Cozy Fiction"],
      description:
        "Linus Baker is a by-the-book caseworker at the Department in Charge of Magical Youth. When he is assigned a classified mission to observe six dangerous youth at an island orphanage, he discovers an extraordinary family he never knew he needed.",
      pages: 396,
      openLibraryUrl: "https://openlibrary.org/works/OL20849903W",
      mood: "cozy",
      clues: {
        era: "Modern 2020 comfort read",
        length: "~390 pages • A giant warm hug in book form",
        vibe: "Island cliffs • Vinyl records • Found family",
        pairing: "Hot cocoa with marshmallows & rain on the window",
      },
    },
  ],
  chaotic: [
    {
      key: "/works/OL2163649W",
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      firstPublishYear: 1979,
      coverId: 8235123,
      coverUrl: "https://covers.openlibrary.org/b/id/8235123-L.jpg",
      subjects: ["Satire", "Science Fiction", "Absurdist Humor", "Space Travel"],
      description:
        "Seconds before the Earth is demolished to make way for a galactic freeway bypass, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy. Don't panic, and always bring a towel.",
      pages: 216,
      openLibraryUrl: "https://openlibrary.org/works/OL2163649W",
      mood: "chaotic",
      clues: {
        era: "First published in 1979",
        length: "~215 pages • Unhinged, laugh-out-loud hilarity",
        vibe: "Towels • Pan Galactic Gargle Blasters • Galactic absurdity",
        pairing: "Fizzy sparkling tonic & zero expectations",
      },
    },
    {
      key: "/works/OL453956W",
      title: "Good Omens",
      author: "Neil Gaiman & Terry Pratchett",
      firstPublishYear: 1990,
      coverId: 8235120,
      coverUrl: "https://covers.openlibrary.org/b/id/8235120-L.jpg",
      subjects: ["Satire", "Humor", "Fantasy", "Apocalypse"],
      description:
        "According to the Nice and Accurate Prophecies of Agnes Nutter, the world will end on a Saturday. Just before dinner. Unfortunately for Heaven and Hell, a somewhat fussy angel and a fast-living demon who have lived among mortals since the Beginning have grown rather fond of the lifestyle.",
      pages: 412,
      openLibraryUrl: "https://openlibrary.org/works/OL453956W",
      mood: "chaotic",
      clues: {
        era: "Published in 1990",
        length: "~410 pages • Witty British banter & apocalyptic mayhem",
        vibe: "Bentley sports cars • Mismatched prophecies • Pure mischief",
        pairing: "A slightly burnt scone & rebellious laughter",
      },
    },
  ],
};

interface KeywordRule {
  keywords: string[];
  searchSubjectQuery: string;
  nearestPreset: "dreamy" | "mysterious" | "romantic" | "adventurous" | "cozy" | "chaotic";
  atmosphere: string;
  pairingNote: string;
  vibeWords: string[];
}

const KEYWORD_RULES: KeywordRule[] = [
  // 1. Lonely / Melancholy / Solitude
  {
    keywords: ["lonely", "alone", "solitude", "melancholy", "sad", "blue", "heartbroken", "isolated", "grief"],
    searchSubjectQuery: "subject:solitude OR subject:friendship OR subject:coming_of_age",
    nearestPreset: "cozy",
    atmosphere: "Quiet contemplation, kindred spirits & finding gentle light in solitude",
    pairingNote: "Warm cinnamon tea & a soft armchair beside rain-washed glass",
    vibeWords: ["Soulful", "Tender", "Reflective", "Quiet", "Human"],
  },
  // 2. Adventure / Exploration / Journey
  {
    keywords: ["adventure", "adventurous", "explore", "travel", "journey", "quest", "expedition", "wanderlust", "action", "voyage"],
    searchSubjectQuery: "subject:adventure OR subject:sea_stories OR subject:expeditions",
    nearestPreset: "adventurous",
    atmosphere: "Uncharted horizons, peril & salt-spray winds",
    pairingNote: "Dark roast espresso & a well-worn notebook and compass",
    vibeWords: ["Daring", "Expansive", "Thrilling", "Uncharted", "Heroic"],
  },
  // 3. Comfort / Cozy / Healing
  {
    keywords: ["comfort", "cozy", "healing", "safe", "gentle", "warm", "peaceful", "calm", "rest", "soft", "soothing", "relax"],
    searchSubjectQuery: "subject:domestic_fiction OR subject:cozy_mystery OR subject:friendship",
    nearestPreset: "cozy",
    atmosphere: "Rain on windowpanes, warm bread & gentle hearthside comfort",
    pairingNote: "Chamomile tea, wildflower honey & an oversized woolen knit",
    vibeWords: ["Gentle", "Heartwarming", "Soothing", "Tender", "Nostalgic"],
  },
  // 4. Nostalgic / Memory / Childhood
  {
    keywords: ["nostalgic", "nostalgia", "childhood", "memory", "memories", "vintage", "past", "retro", "reminiscing", "homesick"],
    searchSubjectQuery: "subject:nostalgia OR subject:memory OR subject:coming_of_age OR subject:historical_fiction",
    nearestPreset: "dreamy",
    atmosphere: "Sepia-toned memories, forgotten summers & bittersweet longing",
    pairingNote: "Earl Grey tea & acoustic records spinning in the twilight",
    vibeWords: ["Bittersweet", "Evocative", "Timeless", "Golden-Hued", "Lyrical"],
  },
  // 5. Romance / Yearning / Love
  {
    keywords: ["romance", "romantic", "love", "yearning", "crush", "passion", "flirty", "devotion", "sweetheart", "darling"],
    searchSubjectQuery: "subject:love_stories OR subject:romance",
    nearestPreset: "romantic",
    atmosphere: "Wax-sealed letters, electric glances & slow-burning devotion",
    pairingNote: "A glass of pinot noir & warm candlelight",
    vibeWords: ["Yearning", "Tender", "Slow-Burn", "Passionate", "Intimate"],
  },
  // 6. Mystery / Dark / Gothic / Spooky
  {
    keywords: ["mystery", "mysterious", "dark", "gothic", "spooky", "secret", "secrets", "detective", "thriller", "crime", "eerie", "puzzle", "haunted"],
    searchSubjectQuery: "subject:gothic_fiction OR subject:mystery",
    nearestPreset: "mysterious",
    atmosphere: "Cobbled alleys, locked archives & whispered secrets",
    pairingNote: "Black coffee & candlelight on a stormy midnight",
    vibeWords: ["Gothic", "Tense", "Clever", "Shadowy", "Atmospheric"],
  },
  // 7. Chaotic / Funny / Satire / Wild
  {
    keywords: ["chaotic", "chaos", "wild", "unhinged", "crazy", "funny", "satire", "bizarre", "weird", "laugh", "humor", "mischief", "rebel"],
    searchSubjectQuery: "subject:satire OR subject:humorous_stories",
    nearestPreset: "chaotic",
    atmosphere: "Whirlwind pacing, biting irony & glorious mischief",
    pairingNote: "Sparkling tonic with citrus & zero expectations",
    vibeWords: ["Unhinged", "Witty", "Biting", "Fast-Paced", "Audacious"],
  },
  // 8. Dreamy / Magical / Fantasy / Whimsical
  {
    keywords: ["dreamy", "magical", "magic", "fantasy", "whimsical", "surreal", "fairy", "stargazing", "myth", "ethereal", "wonder"],
    searchSubjectQuery: "subject:magical_realism OR subject:mythology OR subject:fairy_tales",
    nearestPreset: "dreamy",
    atmosphere: "Ethereal, lyrical & softly blurring reality",
    pairingNote: "Jasmine tea & an open window under starlight",
    vibeWords: ["Lyrical", "Starry", "Enchanting", "Surreal", "Poetic"],
  },
  // 9. Philosophical / Deep / Existential
  {
    keywords: ["philosophical", "philosophy", "deep", "existential", "thoughtful", "mind", "thinking", "pondering", "meaning"],
    searchSubjectQuery: "subject:philosophical_fiction OR subject:psychological_fiction",
    nearestPreset: "mysterious",
    atmosphere: "Labyrinthine thoughts, profound questions & existential wonder",
    pairingNote: "Dark roast oolong tea & a fountain pen",
    vibeWords: ["Profound", "Introspective", "Labyrinthine", "Thoughtful", "Haunting"],
  },
  // 10. Hopeful / Optimistic / Uplifting
  {
    keywords: ["hopeful", "hope", "optimistic", "happy", "joy", "inspired", "uplifting", "sunshine", "bright", "cheery"],
    searchSubjectQuery: "subject:inspirational OR subject:friendship OR subject:humorous_stories",
    nearestPreset: "cozy",
    atmosphere: "Morning light breaking through clouds & resilient hope",
    pairingNote: "Fresh lemon ginger tea & an open terrace",
    vibeWords: ["Luminous", "Resilient", "Uplifting", "Heartwarming", "Tender"],
  },
  // 11. Escapist / Tired / Stressed / Overwhelmed
  {
    keywords: ["escapist", "escape", "tired", "exhausted", "stressed", "overwhelmed", "bored", "drained", "sleepy"],
    searchSubjectQuery: "subject:fantasy OR subject:adventure OR subject:humorous_stories",
    nearestPreset: "adventurous",
    atmosphere: "Distant worlds, immersive escapism & leaving the ordinary behind",
    pairingNote: "Iced lavender mint tea & total silence",
    vibeWords: ["Transportive", "Sweeping", "Immersive", "Vivid", "Engrossing"],
  },
];

/**
 * Interpret natural phrase custom moods into a rich book search resolution
 */
export function resolveCustomMood(rawText: string): CustomMoodResolution {
  const trimmed = rawText.trim();
  const lower = trimmed.toLowerCase();

  // Strip common conversational carrier words
  const words = lower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => !["i", "im", "i'm", "feel", "feeling", "like", "want", "need", "today", "a", "an", "the", "some", "bit", "kind", "of", "really", "very", "so"].includes(w));

  // 1. Search against predefined keyword rules
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw) || words.includes(kw)) {
        return {
          rawInput: trimmed,
          displayMood: trimmed,
          subjectQuery: rule.searchSubjectQuery,
          nearestPreset: rule.nearestPreset,
          atmosphere: rule.atmosphere,
          pairingNote: rule.pairingNote,
          vibeWords: rule.vibeWords,
        };
      }
    }
  }

  // 2. Sensible fallback for abstract or unfamiliar custom text
  const primaryWord = words[0] || "curious";
  const sanitizedWord = primaryWord.replace(/[^a-zA-Z]/g, "").toLowerCase();

  return {
    rawInput: trimmed,
    displayMood: trimmed,
    // Construct dynamic subject search combined with general literary fiction fallback
    subjectQuery: sanitizedWord
      ? `subject:${sanitizedWord} OR subject:literary_fiction OR subject:fiction`
      : "subject:magical_realism OR subject:literary_fiction",
    nearestPreset: "dreamy",
    atmosphere: `Reflective & drawn to the unique mood of “${trimmed}”`,
    pairingNote: "Your favorite warm beverage & an uninterrupted hour",
    vibeWords: ["Curious", "Evocative", "Atmospheric", "Unique"],
  };
}

