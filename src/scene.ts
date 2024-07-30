// import { Mat3x3, Point, Size, Vec2 } from './types';

// interface SceneOptions {
//   bounds?: { width: number; height: number; far: number };
// }

// const DEFAULT_SCENE_OPTIONS = {
//   bounds: { width: 800, height: 600, far: 1 },
// };

// export interface World {
//   size: Size;
//   backgroundColor: Color;
// }
// export interface Entity {
//   position: Point;
//   size: Size;
//   color: string;
// }

// export class Scene {
//   public bounds: { width: number; height: number };
//   public entities: Entity[] = [];
//   public camera: Entity;

//   // private model: Mat3x3 = new Mat3x3();
//   // private view: Mat3x3 = new Mat3x3();
//   // private projection: Mat3x3 = new Mat3x3();

//   constructor(options: SceneOptions = {}) {
//     const { bounds } = { ...DEFAULT_SCENE_OPTIONS, ...options };

//     // prettier-ignore
//     this.projection = Mat3x3.fromScale(new Vec2(0, -1)).multiply(Mat3x3.fromOrthographic(
//       0, bounds.width,
//       0, bounds.height,
//       0, bounds.far,
//     ));
//   }
// }
