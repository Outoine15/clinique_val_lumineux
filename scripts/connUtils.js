import { getCookie } from "/scripts/cookiesUtils.js";

export function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    const token = getCookie("token");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
    } else {
        // connecté
        window.location.replace("/home");
    }
}

export function check_conn_general(){
    const token = getCookie("token");

    if (!token || token === "undefined" || token === "null"){
        // non connecté
        window.location.replace("../pages/conn.html");
    } else {
        // connecté
    }
}