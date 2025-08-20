import {
  dxCodeStyle,
  fwDocusaurus,
  langTypescript,
  scopeIgnores,
} from '@cbnventures/foundation/eslint';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langTypescript,
  ...fwDocusaurus,
];
