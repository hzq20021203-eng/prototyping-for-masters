export interface NotionBook {
  id: string;
  title: string;
  author: string;
  genre: {
    name: string;
    color?: string;
  };
  coverImage: string;
  rating: number | null;
  review: string;
  url?: string;
  readDate?: string;
  pages?: number;
  createdTime?: string;
  lastEditedTime?: string;
}

export const DEMO_BOOKS: NotionBook[] = [
  {
    id: "notion-demo-001",
    title: "Ways of Seeing",
    author: "John Berger",
    genre: {
      name: "Art & Design",
      color: "red"
    },
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    review: "An essential critique of visual culture, consumerist aesthetics, and the historical mechanics of mystification in European oil painting. Seeing comes before words; the child looks and recognizes before it can speak.",
    pages: 176
  },
  {
    id: "notion-demo-002",
    title: "Exhalation",
    author: "Ted Chiang",
    genre: {
      name: "Science Fiction",
      color: "purple"
    },
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    review: "Nine luminous philosophical inquiries disguised as speculative fiction. The titular story on thermodynamic mortality and mechanical consciousness remains an absolute masterpiece of twentieth-century humanism.",
    pages: 352
  },
  {
    id: "notion-demo-003",
    title: "Yellowface",
    author: "R.F. Kuang",
    genre: {
      name: "Fiction",
      color: "orange"
    },
    coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    review: "A razor-sharp, satirical excavation of the contemporary publishing machine, cultural appropriation, and the feverish echo-chamber dynamics of social media self-immolation.",
    pages: 336
  },
  {
    id: "notion-demo-004",
    title: "Pachinko",
    author: "Min Jin Lee",
    genre: {
      name: "Fiction",
      color: "blue"
    },
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    review: "An extraordinary multi-generational chronicle of a Korean family in twentieth-century Japan. An intimate study of endurance, displacement, dignity, and familial sacrifice.",
    pages: 496
  }
];
