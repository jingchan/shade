import { CardConfig } from './card';

function cardImages(filename: string) {
  if (!filename.endsWith('.png')) {
    console.warn(
      'Filename does not end with .png, 2x image not supported.',
      filename,
    );
  }
  const filename2x = filename.replace('.png', '@2x.png');
  return {
    image: new URL(`${filename}`, import.meta.url).href,
    image2x: new URL(`${filename2x}`, import.meta.url).href,
  };
}

export const DEBUG_CARDS: CardConfig[] = [
  {
    name: 'Punch',
    type: 'Type 1',
    description: 'Attack 1',
  },
  {
    name: 'Kick',
    type: 'Type 1',
    description: 'Attack 2',
  },
  {
    name: 'Sword',
    type: 'Type 1',
    description: 'Attack 3',
    ...cardImages('./assets/Sword.png'),
  },
  {
    name: 'Block',
    type: 'Type 1',
    description: 'Defend 1',
  },
  {
    name: 'Shield',
    type: 'Type 1',
    description: 'Defend 2',
    ...cardImages('./assets/Shield.png'),
  },
  {
    name: 'Pickpocket',
    type: 'Type 1',
    description: 'Steal 1',
  },
  {
    name: 'Cinderstrike',
    type: 'Type 1',
    description: 'Fire 1',
  },
  {
    name: 'Frostbite',
    type: 'Type 1',
    description: 'Ice 1',
  },
];
