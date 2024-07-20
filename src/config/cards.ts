import { CardConfig } from '../card';

export const CARDS: CardConfig[] = [
  {
    name: 'Sword',
    description: 'A sword',
    ...cardImages('../assets/Sword.png'),
  },
  {
    name: 'Shield',
    description: 'A shield',
    ...cardImages('../assets/Shield.png'),
  },
];
