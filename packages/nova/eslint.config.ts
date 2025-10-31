import {
  dxCodeStyle,
  dxIgnore,
  envNode,
  langTypescript,
} from './src/presets/eslint/index.mjs';

export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langTypescript,
  ...envNode,
];
