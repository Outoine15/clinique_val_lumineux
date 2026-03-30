import { getCookie } from "/scripts/cookiesUtils.js";

export function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    const token = getCookie("token");
    const role = getCookie("role");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
    } else {
        switch (role) {
            case "USER":
                window.location.replace("/home");
                break;
            case "SECRETARY":
                window.location.replace("/home");
                
            default:
                window.location.replace("/home");
                break;
        }
        // connecté
        
    }
}

export function check_conn_general(){
    const token = getCookie("token");

    if (!token || token === "undefined" || token === "null"){
        // non connecté
        window.location.replace("/login");
    } else {
        // connecté
    }
}