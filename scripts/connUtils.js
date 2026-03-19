import { getCookie } from "./cookiesUtils.js";

export function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    if(!getCookie("token")){
        // non connecté
    } else {
        // connecté
        window.location.replace("index.html");
    }
}

export function check_conn_general(){
    if(!getCookie("token")){
        // non connecté
        window.location.replace("conn.html");
    } else {
        // connecté
    }
}