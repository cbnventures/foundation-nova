import {
  dxCodeStyle,
  fwDocusaurus,
  langMdx,
  langTypescript,
  scopeIgnores,
} from '@cbnventures/foundation-nova/eslint';

export default [
  ...scopeIgnores,
  ...dxCodeStyle,
  ...langMdx,
  ...langTypescript,
  ...fwDocusaurus,
];
