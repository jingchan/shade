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

export interface Point {
  x: number;
  y: number;
}

/**
 * Card class
 *
 * The current state of a card in the game.
 */
export class Card {
  constructor(
    public cardDef: CardDef,
    public position: Point,
    public isFaceUp: boolean = true,
    public active: boolean = false,
    // Maybe state or status
  ) {
  }
}
