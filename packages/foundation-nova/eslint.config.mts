import {
  dxCodeStyle,
  envNode,
  langTypescript,
  scopeIgnores,
} from './src/presets/eslint/index.mjs';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langTypescript,
  ...envNode,
];
