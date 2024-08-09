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
