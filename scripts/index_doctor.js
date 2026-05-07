import "../component/header/header.js";
import "../component/footer/footer.js";

import { check_conn_general } from "../scripts/connUtils.js";
check_conn_general("DOCTOR");
//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page qui nécessite une connexion)

// import { DoctorCard } from "../component/doctor_card/doctor_card.js";
import { LogoutButton } from "../component/logout/logout.js";

let loggout_bt = new LogoutButton();
let loggout_bt_placement = document.getElementById("logout-button");
loggout_bt_placement.appendChild(loggout_bt)



// //creation du div qui va regrouper toute les carte de medecin
// const doctorContainer = document.createElement("div");

// doctorContainer.id = "doctor-container";

// doctorContainer.classList.add("doctor-grid");

// document.body.appendChild(doctorContainer);


// axios.get("../api/doctors", {

// // parametres
// }).then(res => {
//     res.data.forEach(doctor => {
//         let card = new DoctorCard(doctor);
//         doctorContainer.appendChild(card);
//     });
// }).catch(err => {
//     console.log("request failed");
//     console.log(err);
// })
