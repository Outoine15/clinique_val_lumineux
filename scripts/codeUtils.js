
export function isEmptyObject(arg) {
  return typeof arg === 'object' && Object.keys(arg).length === 0;
}