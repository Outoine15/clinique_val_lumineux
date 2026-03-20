import { check_conn_general } from "/scripts/connUtils.js";
import { LogoutButton } from "/component/logout/logout.js";


import { DoctorCard } from "/component/doctor_card/doctor_card.js";

//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page qui nécessite une connexion)
check_conn_general();


let loggout_bt = new LogoutButton();
document.body.appendChild(loggout_bt);

axios.get("/api/doctors", {
// parametres
}).then(res => {
    console.log(res);
    res.data.forEach(doctor => {
        let card = new DoctorCard(doctor);
        document.body.appendChild(card);
    });
}).catch(err => {
    console.log("request failed");
    console.log(err);
})