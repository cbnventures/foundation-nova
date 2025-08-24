import { dxCodeStyle, langTypescript, scopeIgnores } from '@cbnventures/foundation-nova/eslint';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langTypescript,
];
