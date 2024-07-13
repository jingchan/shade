import { Card } from './card';
import { Point } from './types';

export const DEBUG_CARDS: Card[] = [
  new Card(
    {
      name: 'Punch',
      type: 'Type 1',
      description: 'Attack 1',
      position: new Point(0, 100),
    },
  ),
  new Card(
    {
      name: 'Kick',
      type: 'Type 1',
      description: 'Attack 2',
      position: new Point(100, 100),
    },
  ),
  new Card(
    {
      name: 'Block',
      type: 'Type 1',
      description: 'Defend 1',
      position: new Point(300, 100),
    },
  ),
  new Card(
    {
      name: 'Pickpocket',
      type: 'Type 1',
      description: 'Steal 1',
      position: new Point(500, 200),
    },
  ),
  new Card(
    {
      name: 'Cinderstrike',
      type: 'Type 1',
      description: 'Fire 1',
      position: new Point(200, 300),
    },
  ),
  new Card(
    {
      name: 'Frostbite',
      type: 'Type 1',
      description: 'Ice 1',
      position: new Point(700, 250),
    },
  ),
];
