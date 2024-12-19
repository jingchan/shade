/**
 * Free positioning.
 *
 * Cards can be dragged and dropped anywhere.
 *
 * Free Positioning example usage:
 * const positioner = ref(new FreePositioning());
 * watch([() => props.cards, width, height], (newValue) => {
 *   const [newCards, newWidth, newHeight] = newValue;
 *   if (newWidth === 0 || newHeight === 0) {
 *     return;
 *   }
 *   positioner.value.bounds = new Size(width.value, height.value);
 *   positioner.value.cards = newCards;
 * });
 */

import type { Card } from '../card';
import { CardStack } from '../cardStack';
import { Point, Size } from '../types';
import type { PositioningInfo } from './arc';

export class FreePositioning {
  private positions: WeakMap<Card, Point> = new WeakMap();
  private nextPosition: Point = new Point(0, 0);
  private _cards: CardStack = CardStack.EMPTY;
  private _bounds: Size = new Size(0, 0);

  get cards(): CardStack {
    return this._cards;
  }

  set cards(cards: CardStack) {
    if (cards === this._cards) {
      return;
    }
    this._cards = cards;
    this.updatePositions();
  }

  get bounds(): Size {
    return this._bounds;
  }

  set bounds(bounds: Size) {
    if (this._bounds.x === bounds.x && this._bounds.y === bounds.y) {
      return;
    }
    this._bounds = bounds;
    this.updatePositions();
  }

  updatePositions(): void {
    for (const card of this.cards) {
      if (!this.positions.has(card)) {
        const size = card.size;
        if (this.nextPosition.x + size.width > this._bounds.width) {
          this.nextPosition = new Point(0, this.nextPosition.y + size.height);
        }
        this.positions.set(card, this.nextPosition.add(card.size.halfsize()));
        this.nextPosition = this.nextPosition.add(new Point(card.size.x, 0));
      }
    }
  }

  moveCard(card: Card, point: Point): void {
    this.positions.set(card, point);
  }

  getPositions(): PositioningInfo[] {
    const positions: PositioningInfo[] = [];
    this.cards.forEach((card) => {
      const position = this.positions.get(card);
      if (position) {
        positions.push({ center: position });
      }
    });
    return positions;
  }

  getPosition(card: Card): Point {
    const position = this.positions.get(card);
    if (position) {
      return position;
    }
    return new Point(0, 0);
  }
}
