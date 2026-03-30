export function setCookie(name,data){
    document.cookie = name+"="+data+"; max-age=3600; path=/; SameSite=Strict";
}

export function getCookie(name){
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function deleteCookie(name){
  document.cookie = name+"=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}