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
                    // console.log(res.data);
                    // connecté 
                    switch (role) {
                        case "USER":
                            window.location.replace("../home");
                            break;
                        case "SECRETARY":
                            window.location.replace("../secretary");
                            break;
                        case "DOCTOR":
                            window.location.replace("../doctor");
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
//expected_role est soit le string du role soit "" (si tous les roles sont autorisés)
export function check_conn_general(expected_role){
    
    const token = getCookie("token");
    if (!token || token === "undefined" || token === "null"){
        // non connecté
        // console.log("token invalide");
        window.location.replace("../login");
        // window.location.replace("../login");
    } else {
        // console.log("connexion...");
        axios.get("../api/users", {
            headers: {
                Authorization: "Bearer "+token
            }
        }).then(res => {
            if(!isEmptyObject(res.data))
            {
                // console.log("connecté");
                // connecté 
                if(expected_role!=""){ //tous les roles pas autorisé
                    if(getCookie("role")==expected_role){
                        //bon type de compte
                        // console.log("bon role");
                    } else {
                        // console.log("mauvais role");
                        window.location.replace("../home");
                        // window.location.replace("../home");
                    }
                }
            } else {
                // console.log("mauvais token");
            }
        }).catch(err => {
            // console.log(err);
        })
        // connecté (ne rien faire)
    }
}