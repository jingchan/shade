export class Point {
  constructor(public x: number, public y: number) {
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }

  mult(divisor: number): Point {
    return new Point(this.x * divisor, this.y * divisor);
  }

  div(divisor: number): Point {
    return new Point(this.x / divisor, this.y / divisor);
  }
}
