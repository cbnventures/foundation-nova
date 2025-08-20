import {
  dxCodeStyle,
  langTypescript,
  scopeIgnores,
} from '@cbnventures/foundation/eslint';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langTypescript,
];
