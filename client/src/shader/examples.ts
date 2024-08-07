import base from '../shaders/base.wgsl';
import box from '../shaders/box.wgsl';
import checker from '../shaders/checker.wgsl';
import circle from '../shaders/circle.wgsl';
import ellipse from '../shaders/ellipse.wgsl';
import line from '../shaders/line.wgsl';
import march from '../shaders/march.wgsl';
import noise from '../shaders/noise.wgsl';
import perlin from '../shaders/perlin.wgsl';
import screen from '../shaders/screen.wgsl';
import roundedBox from '../shaders/roundedBox.wgsl';
import roundedTri from '../shaders/roundedTri.wgsl';
import tri from '../shaders/tri.wgsl';

const SHADERS: {
  [key: string]: string;
} = {
  checker,
  base,
  perlin,
  noise,
  circle,
  screen,
  screenOptions: screen,
  ellipse,
  march,
  tri,
  roundedTri,
  line,
  box,
  roundedBox,
};
export default SHADERS;
