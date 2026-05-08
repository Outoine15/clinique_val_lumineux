import "../component/header/header.js";
import "../component/footer/footer.js";

import { check_conn_general } from "../scripts/connUtils.js";
import { DoctorCard } from "../component/doctor_card/doctor_card.js";
import { getCookie } from "../scripts/cookiesUtils.js";
//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page qui nécessite une connexion)
check_conn_general("USER");

console.log("test");

//creation du div qui va regrouper toute les carte de medecin
const doctorContainer = document.getElementById("doctor-container");

doctorContainer.classList.add("doctor-grid");

// TODO remplacer la requete api par celle qui get la liste des rdv des clients d'un user
axios.get("../api/doctors", {

// parametres
}).then(res => {
    res.data.forEach(doctor => {
        let card = new DoctorCard(doctor,getCookie("role"));
        doctorContainer.appendChild(card);
    });
}).catch(err => {
    console.log("request failed");
    console.log(err);
})
