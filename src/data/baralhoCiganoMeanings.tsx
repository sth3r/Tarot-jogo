import type { TarotCardData } from '../types/TarotCardData';

export const tarotCardsData: TarotCardData[] = [
  // Arcanos Maiores
  {
    id: 0,
    name: 'O Louco',
    imageUrl: require('../assets/tarot-cards/TarotRWS-00-louco.jpg'),
    uprightMeaning: 'Início de jornada, espontaneidade, liberdade, fé no desconhecido',
    reversedMeaning: 'Imprudência, irresponsabilidade, falta de direção, ingenuidade',
  },
  {
    id: 1,
    name: 'O Mago',
    imageUrl: require('../assets/tarot-cards/TarotRWS-01-mago.jpg'),
    uprightMeaning: 'Habilidade, poder pessoal, iniciativa, concentração',
    reversedMeaning: 'Manipulação, truques, falta de ação, dispersão',
  },
  
];