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

export class Angle {
  constructor(public radians: number) {}

  get degrees(): number {
    return (this.radians * 180) / Math.PI;
  }

  multiply(factor: number): Angle {
    return new Angle(this.radians * factor);
  }

  sin(): number {
    return Math.sin(this.radians);
  }

  cos(): number {
    return Math.cos(this.radians);
  }

  static fromDegrees(degrees: number): Angle {
    return new Angle((degrees * Math.PI) / 180);
  }

  static ZERO = new Angle(0);
}

export class Mat3x3 {
  constructor(public data: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {}

  multiply(other: Mat3x3): Mat3x3 {
    const result = new Mat3x3();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let sum = 0;
        for (let i = 0; i < 3; i++) {
          sum += this.data[row * 3 + i] * other.data[i * 3 + col];
        }
        result.data[row * 3 + col] = sum;
      }
    }
    return result;
  }

  multiplyVec2(point: Vec2): Vec2 {
    return new Vec2(
      this.data[0] * point.x + this.data[1] * point.y + this.data[2],
      this.data[3] * point.x + this.data[4] * point.y + this.data[5],
    );
  }

  static identity(): Mat3x3 {
    return new Mat3x3();
  }
  static fromTranslation(translation: Vec2): Mat3x3 {
    return new Mat3x3([1, 0, 0, 0, 1, 0, translation.x, translation.y, 1]);
  }
  static fromScale(scale: Vec2): Mat3x3 {
    return new Mat3x3([scale.x, 0, 0, 0, scale.y, 0, 0, 0, 1]);
  }
  static fromRotation(angle: Angle): Mat3x3 {
    return new Mat3x3([
      angle.cos(),
      angle.sin(),
      0,
      -angle.sin(),
      angle.cos(),
      0,
      0,
      0,
      1,
    ]);
  }
  static fromTransformation(
    translation: Vec2,
    scale: Vec2,
    angle: Angle,
  ): Mat3x3 {
    return Mat3x3.fromTranslation(translation)
      .multiply(Mat3x3.fromScale(scale))
      .multiply(Mat3x3.fromRotation(angle));
  }

  static fromPerspective(
    aspect: number,
    fov: number,
    near: number,
    far: number,
  ): Mat3x3 {
    const f = 1.0 / Math.tan(fov / 2);
    return new Mat3x3([
      f / aspect,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      (far + near) / (near - far),
    ]);
  }

  static fromOrthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
  ): Mat3x3 {
    return new Mat3x3([
      2 / (right - left),
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      (left + right) / (left - right),
      (top + bottom) / (bottom - top),
      (far + near) / (near - far),
    ]);
  }
}
