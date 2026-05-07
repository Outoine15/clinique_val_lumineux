import { deleteCookie, getCookie } from "../scripts/cookiesUtils.js";
import { isEmptyObject } from "../scripts/codeUtils.js";

export function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    const token = getCookie("token");
    const role = getCookie("role");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
    } else {
        axios.get("../api/users", {
            headers: {
                Authorization: "Bearer "+token
            }
        }).then(res => {
            if(!isEmptyObject(res.data))
            {
                if(!isEmptyObject(res.data.id))
                {
                    console.log(res.data);
                    // connecté 
                    switch (role) {
                        case "USER":
                            window.location.replace("../home");
                            break;
                        case "SECRETARY":
                            window.location.replace("../SECRETARY");
                            break;
                        case "DOCTOR":
                            window.location.replace("../DOCTOR");
                            break;
                        default:
                            window.location.replace("../home");
                            break;
                    }
                }
            }
        }).catch(err => {
            // console.log(err);
        })
        // connecté
        // window.location.replace("../home"); //vers le dashboard a terme
    }
}

export function check_conn_general(){
    
    const token = getCookie("token");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
        deleteCookie("token");
        deleteCookie("role");
        window.location.replace("../login");
    } else {
        axios.get("../api/users", {
            headers: {
                Authorization: "Bearer "+token
            }
        }).then(res => {
            if(!isEmptyObject(res.data))
            {
                // connecté 
            } else {
                console.log("connecté");
                // mauvais token
                deleteCookie("token");
                deleteCookie("role");
            }
        }).catch(err => {
            // console.log(err);
        })
        // connecté (ne rien faire)
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