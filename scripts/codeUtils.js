
export function isEmptyObject(arg) {
  return typeof arg === 'object' && Object.keys(arg).length === 0;
}

export function generateClientCode(client_id,client_name,client_firstname) {
  return ""+client_name.slice(0,2)+client_id+client_firstname.slice(0,2);
}