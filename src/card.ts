import { DEBUG_CARDS } from './debug';
import type { Point } from './types';

export class CardDef {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public description: string,
    public image?: string,
  ) {
  }
}

/**
 * Card class
 *
 * The current state of a card in the game.
 */
export class Card {
  public name: string;
  public type: string;
  public description: string;

  readonly draggable: boolean;
  readonly custom_color?: string;

  public active: boolean = false;
  public isFaceDown: boolean = false;
  public position: Point = { x: 0, y: 0 };

  // public cardDef: CardDef,
  // public position: Point,
  // // Maybe state or status
  constructor(
    public config: CardConfig = {},
  ) {
    this.name = config.name ?? 'Name';
    this.type = config.type ?? 'Type';
    this.description = config.description ?? 'Description';

    this.draggable = config.draggable ?? false;
    this.custom_color = config.custom_color;
    this.position = config.position ?? this.position;
  }

  static random(): Card {
    return new Card(DEBUG_CARDS[Math.floor(Math.random() * DEBUG_CARDS.length)]);
  }
}

interface CardConfig {
  name?: string;
  type?: string;
  description?: string;
  custom_color?: string;
  draggable?: boolean;
  position?: Point;
}
