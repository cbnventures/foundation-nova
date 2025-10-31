import {
  dxCodeStyle,
  dxIgnore,
  fwDocusaurus,
  langMdx,
  langTypescript,
} from '@cbnventures/nova/eslint';

export default [
  ...dxIgnore,
  ...dxCodeStyle,
  ...langMdx,
  ...langTypescript,
  ...fwDocusaurus,
];
