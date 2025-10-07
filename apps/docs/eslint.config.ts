import {
  dxCodeStyle,
  dxIgnore,
  fwDocusaurus,
  langMdx,
  langTypescript,
} from '@cbnventures/foundation-nova/eslint';

export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langMdx,
  ...langTypescript,
  ...fwDocusaurus,
];
