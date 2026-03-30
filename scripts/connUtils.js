import { getCookie } from "../scripts/cookiesUtils.js";

export function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    const token = getCookie("token");
    const role = getCookie("role");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
    } else {
        switch (role) {
            case "USER":
                window.location.replace("../home");
                break;
            case "SECRETARY":
                window.location.replace("../home");
                
            default:
                window.location.replace("../home");
                break;
        }
        // connecté
        window.location.replace("../home"); //vers le dashboard a terme
    }
}

export function check_conn_general(){
    
    const token = getCookie("token");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
        window.location.replace("../login");
    } else {
        console.log("connecté bravo");
    }
}

export function get_linked_clients(){
    axios.get(
        "../api/clients", 
        new URLSearchParams({
            "token": getCookie("token")
        }).toString()
    ).then(response => {
        if(response.data.success==false){
            // mauvait token
        } else {
            return response.data;
        }
    }).catch(err => {
        // 404 ou 500
    });
    return null;
}