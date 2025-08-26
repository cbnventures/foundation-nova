import {
  dxCodeStyle,
  fwDocusaurus,
  langTypescript,
  scopeIgnores,
} from '@cbnventures/foundation-nova/eslint';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langTypescript,
  ...fwDocusaurus,
];
