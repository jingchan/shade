import { DEBUG_CARDS } from './debug';
import { Point, Size } from './types';

export const DEFAULT_CARD_SIZE = new Size(170, 240);
export const PLACEHOLDER_CARD_IMAGE = new URL(
  './assets/Placeholder.png',
  import.meta.url,
).href;
export const PLACEHOLDER_CARD_IMAGE_2X = new URL(
  './assets/Placeholder@2x.png',
  import.meta.url,
).href;

export class CardDef {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public description: string,
    public image?: string,
    public image2x?: string,

    // Deprecated
    public position?: Point,
  ) {}
}

export interface CardConfig {
  name?: string;
  type?: string;
  description?: string;
  image?: string;
  image2x?: string;
  custom_color?: string;
  draggable?: boolean;
  position?: Point;
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
  public image: string;
  public image2x: string;

  readonly draggable: boolean;
  readonly custom_color?: string;

  public active: boolean = false;
  public isFaceDown: boolean = false;

  // public cardDef: CardDef,
  public position: Point = new Point(0, 0);
  public size: Size = DEFAULT_CARD_SIZE;
  // // Maybe state or status
  constructor(public config: CardConfig = {}) {
    this.name = config.name ?? 'Name';
    this.type = config.type ?? 'Type';
    this.description = config.description ?? 'Description';
    this.image = config.image ?? PLACEHOLDER_CARD_IMAGE;
    this.image2x = config.image2x ?? PLACEHOLDER_CARD_IMAGE_2X;

    this.draggable = config.draggable ?? false;
    this.custom_color = config.custom_color;
  }

  static random(): Card {
    return new Card(
      DEBUG_CARDS[Math.floor(Math.random() * DEBUG_CARDS.length)],
    );
  }
}
