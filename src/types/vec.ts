export type Vec2Like = Vec2 | Point | Size | { x: number; y: number };
export class Vec2 {
  public x: number;
  public y: number;
  constructor(x: Vec2Like | number, y: number = 0) {
    if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  mult(divisor: number): Vec2 {
    return new Vec2(this.x * divisor, this.y * divisor);
  }

  div(divisor: number): Vec2 {
    return new Vec2(this.x / divisor, this.y / divisor);
  }
}

export class Point extends Vec2 {}
export class Size extends Vec2 {
  get width(): number {
    return this.x;
  }

  get height(): number {
    return this.y;
  }

  center(): Point {
    return new Point(this.x / 2, this.y / 2);
  }

  halfsize(): Size {
    return new Size(this.x / 2, this.y / 2);
  }

  as_array(include_z: boolean = false): number[] {
    return include_z ? [this.x, this.y, 1.0] : [this.x, this.y];
  }

  static fromElementBounds(el: HTMLElement): Size {
    return new Size(el.clientWidth, el.clientHeight);
  }

  static fromRadiusAngle(radius: number, angle: Angle): Size {
    return new Size(radius * angle.cos(), radius * angle.sin());
  }
}
