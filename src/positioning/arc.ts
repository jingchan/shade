import type { Size } from '../types';
import { Angle, Point } from '../types';
import { DEFAULT_CARD_SIZE } from '../card';
import type { CardStack } from '../cardStack';

export interface PositioningInfo {
  center: Point;
  rotation?: Angle;
}

interface ArcPositioningConfig {
  /**
   * Size of card to use when calculating positions.
   */
  cardSize?: Size;
  /**
   * Maximum rotation that a card can take when positioned in the arc.
   */
  maxRotationRadians?: number;
  /**
   * Extra space reserved on the sides of the bounds so cards don't poke out.
   */
  sidePadding?: number;
  /**
   * Maximum distance between cards with abundant space.
   */
  maxStepWidth?: number;
}

const DEFAULT_ARC_POSITIONING_CONFIG = {
  cardSize: DEFAULT_CARD_SIZE,
  maxRotationRadians: 10 * Math.PI / 180,
  sidePaddingFactor: 0.8,
  maxStepWidthFactor: 0.87,
};

export function calculateArcPositions(
  cards: CardStack,
  bounds: Size,
  config: ArcPositioningConfig = {},
): PositioningInfo[] {
  const {
    cardSize,
    maxRotationRadians,
    sidePaddingFactor,
    maxStepWidthFactor,
  } = { ...DEFAULT_ARC_POSITIONING_CONFIG, ...config };
  const numCards = cards.length;
  if (numCards <= 0) {
    return [];
  }
  if (numCards <= 1) {
    return [{ center: bounds.center() }];
  }

  const usableWidth = bounds.width - cardSize.width * sidePaddingFactor * 2;
  const radius = usableWidth / 2 / Math.tan(maxRotationRadians);
  const maxStepRadians = Math.atan2(cardSize.width * maxStepWidthFactor, radius);

  const stepRadians = Math.min(maxStepRadians, maxRotationRadians * 2 / (numCards - 1));
  const cardAngleRange = stepRadians * (numCards - 1);
  const cardAngleStart = -cardAngleRange / 2;

  // Add half the maximal height displacement to recenter the cards.
  const displacementOffset = new Point(0, -(radius - radius * Math.cos(maxRotationRadians)) / 2);
  const origin = bounds.center().add(displacementOffset);

  return cards.map((_card, index) => {
    const rotation = new Angle(cardAngleStart + index * stepRadians);
    const center = origin.add(new Point(radius * rotation.sin(), radius - radius * rotation.cos()));
    return {
      center,
      rotation,
    };
  });
}
