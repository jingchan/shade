import type { Card } from './card';
import { DEBUG_CARDS } from './debug';

interface CardIterator {
  [Symbol.iterator]: () => Iterator<Card>;
}

export class CardStack implements CardIterator {
  constructor(public cards: Card[]) {}

  [Symbol.iterator](): Iterator<Card> {
    let index = 0;
    return {
      next: (): IteratorResult<Card, undefined> => {
        if (index < this.cards.length) {
          return { value: this.cards[index++], done: false };
        }
        else {
          return { done: true } as IteratorReturnResult<undefined>;
        }
      },
    };
  }

  /**
   * Similar to Array.prototype.forEach().
   */
  forEach(callbackfn: (card: Card, index: number, array: Card[]) => void, thisArg?: CardStack): void {
    this.cards.forEach(callbackfn, thisArg);
  }

  /**
   * Similar to Array.prototype.map().
   */
  map<T>(callbackfn: (card: Card, index: number, array: Card[]) => T, thisArg?: CardStack): T[] {
    return this.cards.map(callbackfn, thisArg);
  }

  get length(): number {
    return this.cards.length;
  }

  get(index: number): Card {
    return this.cards[index];
  }

  addCard(card: Card, index?: number): void {
    if (index) {
      this.cards.splice(index, 0, card);
    }
    else {
      this.cards.push(card);
    }
  }

  /**
   * Removes card from stack and returns it.
   */
  popCard(card: Card): Card {
    const cardIndex = this.cards.indexOf(card);
    if (cardIndex > -1) {
      return this.cards.splice(cardIndex, 1).at(0) as Card;
    }
    else {
      throw new Error('Card not found in CardStack.');
    }
  }

  moveCard(card: Card, index: number): void {
    const movedCard = this.popCard(card);
    this.addCard(movedCard, index);
  }

  deselectAllCards(): void {
    this.forEach(card => card.active = false);
  }

  selectCard(card: Card): void {
    card.active = true;
  }

  flipCard(card: Card): void {
    card.isFaceDown = !card.isFaceDown;
  }

  static example() {
    return new CardStack(DEBUG_CARDS);
  }
}
