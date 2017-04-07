export const OPACITY_SET = 'OPACITY_SET';
export function setOpacity(opacity) {
  return {
    type: OPACITY_SET,
    opacity
  };
}
