export type MoodType =
  | "dreamy"
  | "mysterious"
  | "romantic"
  | "adventurous"
  | "cozy"
  | "chaotic";

export interface MoodClueHints {
  atmosphere: string;
  pairingNote: string;
  vibeWords: string[];
}

export interface MoodConfig {
  id: MoodType;
  label: string;
  tagline: string;
  postagePrice: string;
  icon: string;
  subjectQuery: string;
  colorAccent: string;
  stampBg: string;
  clueHints: MoodClueHints;
}

export interface BlindDateBookClues {
  era: string;
  length: string;
  vibe: string;
  pairing: string;
}

export interface CustomMoodResolution {
  rawInput: string;
  displayMood: string;
  subjectQuery: string;
  nearestPreset: MoodType;
  atmosphere: string;
  pairingNote: string;
  vibeWords: string[];
}

export interface BlindDateBook {
  key: string;
  title: string;
  author: string;
  firstPublishYear?: number;
  coverId?: number;
  coverUrl?: string;
  subjects: string[];
  description: string;
  pages?: number;
  openLibraryUrl: string;
  mood: MoodType | string;
  displayMoodName?: string;
  clues: BlindDateBookClues;
}

export interface OpenLibrarySearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  first_sentence?: string | string[];
  number_of_pages_median?: number;
}

export interface OpenLibraryWorkResponse {
  description?: string | { type?: string; value: string };
  title?: string;
  covers?: number[];
  subjects?: string[];
}
