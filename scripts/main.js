import { check_conn_general } from "../scripts/connUtils.js";
import { LogoutButton } from "../component/logout.js";


//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page)
check_conn_general();


let loggout_bt = new LogoutButton();
document.body.appendChild(loggout_bt);