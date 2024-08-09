import { CanvasViewOptions } from '../components/shade/CanvasView.vue';
import { RendererConstructor } from './renderer';
// import { TriangleRenderer } from './triangle';
// import { CubeRenderer } from './cube';
// import { ScreenRenderer } from './screen';
// import { TextureRenderer } from './texture';
import { BaseRenderer } from './base';
import ShaderCode from '../shader/shaderCode';
import SHADERS from '../shader/examples';

interface Demo {
  name: string;
  id?: string | number;
  renderer: RendererConstructor;
  options?: CanvasViewOptions;
}

const DEMOS: Demo[] = [
  {
    name: 'Screen-space',
    renderer: BaseRenderer,
    id: 'screen',
    options: {
      vertexShader: new ShaderCode(SHADERS.base),
      fragmentShader: new ShaderCode(SHADERS.base),
    },
  },
  // {
  //   name: 'Screen-space (options)',
  //   renderer: BaseRenderer,
  //   id: 'screenOptions',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.base),
  //     fragmentShader: new ShaderCode(SHADERS.base),
  //     color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // //   { name: 'tri', renderer: TriangleRenderer },
  // //   { name: 'cube', renderer: CubeRenderer },
  // //   {
  // //     name: 'texture',
  // //     renderer: TextureRenderer,
  // //     options: {
  // //       image: new URL('../assets/Placeholder.png', import.meta.url).href,
  // //     },
  // //   },
  // {
  //   name: 'checker',
  //   renderer: BaseRenderer,
  //   id: 'checker',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.checker),
  //     fragmentShader: new ShaderCode(SHADERS.checker),
  //   },
  // },
  // {
  //   name: 'perlin noise',
  //   renderer: BaseRenderer,
  //   id: 'perlin',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.perlin),
  //     fragmentShader: new ShaderCode(SHADERS.perlin),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //     scale: 2,
  //   },
  // },
  // {
  //   name: 'value noise',
  //   renderer: BaseRenderer,
  //   id: 'noise',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.noise),
  //     fragmentShader: new ShaderCode(SHADERS.noise),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //     scale: 2,
  //   },
  // },
  // {
  //   name: 'SDF: circle',
  //   renderer: BaseRenderer,
  //   id: 'circle',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.circle),
  //     fragmentShader: new ShaderCode(SHADERS.circle),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'SDF: box',
  //   renderer: BaseRenderer,
  //   id: 'box',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.box),
  //     fragmentShader: new ShaderCode(SHADERS.box),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'SDF: roundedBox',
  //   renderer: BaseRenderer,
  //   id: 'roundedBox',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.roundedBox),
  //     fragmentShader: new ShaderCode(SHADERS.roundedBox),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'SDF: triangle',
  //   renderer: BaseRenderer,
  //   id: 'tri',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.tri),
  //     fragmentShader: new ShaderCode(SHADERS.tri),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'SDF: Rounded Triangle',
  //   renderer: BaseRenderer,
  //   id: 'roundedTri',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.roundedTri),
  //     fragmentShader: new ShaderCode(SHADERS.roundedTri),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'SDF: line',
  //   renderer: BaseRenderer,
  //   id: 'line',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.line),
  //     fragmentShader: new ShaderCode(SHADERS.line),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // {
  //   name: 'Ray Marching',
  //   renderer: BaseRenderer,
  //   id: 'march',
  //   options: {
  //     vertexShader: new ShaderCode(SHADERS.march),
  //     fragmentShader: new ShaderCode(SHADERS.march),
  //     // color: [1.0, 0.0, 1.0, 0.5],
  //   },
  // },
  // // {
  // //   name: 'SDF: ellipse',
  // //   renderer: BaseRenderer,
  // //   id: 'ellipse',
  // //   options: {
  // //     vertexShader: new ShaderCode(SHADERS.ellipse),
  // //     fragmentShader: new ShaderCode(SHADERS.ellipse),
  // //     // color: [1.0, 0.0, 1.0, 0.5],
  // //   },
  // // },
];

export default DEMOS;
