// src/data/decks.ts
import { tarotCardsData } from './tarotMeanings';
// import { ciganoCardsData } from './baralhoCiganoMeanings';
// import { marseilleCardsData } from './tarotMarseille';

export const decks = {
  tarotRWS: {
    name: "Tarot Rider-Waite",
    cards: tarotCardsData,
  },
//   cigano: {
//     name: "Baralho Cigano",
//     cards: ciganoCardsData,
//   },
//   marseille: {
//     name: "Tarot de Marselha",
//     cards: marseilleCardsData,
//   },
};

export type DeckKey = keyof typeof decks;
