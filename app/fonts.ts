import { Instrument_Sans, Instrument_Serif, Inconsolata } from 'next/font/google';

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const inconsolata = Inconsolata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
