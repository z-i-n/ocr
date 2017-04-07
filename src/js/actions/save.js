export const SAVE_DO = 'SAVE_DO';
export const SAVE_DONE = 'SAVE_DONE';
export function doSave() {
  return {
    type: SAVE_DO
  };
}
export function doneSave() {
  return {
    type: SAVE_DONE
  };
}
