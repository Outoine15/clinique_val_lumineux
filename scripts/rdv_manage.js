import "../component/header/header.js";
import "../component/footer/footer.js";

import { check_conn_general } from "../scripts/connUtils.js";
import { DoctorCard } from "../component/doctor_card/doctor_card.js";
import { getCookie } from "../scripts/cookiesUtils.js";
import { isEmptyObject } from "../scripts/codeUtils.js";
//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page qui nécessite une connexion)
check_conn_general("USER");

//creation du div qui va regrouper toute les carte de medecin
const doctorContainer = document.getElementById("doctor-container");

doctorContainer.classList.add("doctor-grid");

// TODO remplacer la requete api par celle qui get la liste des rdv des clients d'un user
axios.get("../api/users/appointments", {
    headers: {
        Authorization: "Bearer "+getCookie("token")
    }
// parametres
}).then(res => {
    if(isEmptyObject(res.data)){
        let message = document.querySelector(".message");
        message.innerHTML=`vous n'avez aucun rendez-vous pour le moment `;
        let link = document.createElement("a");
        link.href="../rdv_ano";
        link.innerHTML="prendre un rendez-vous";
        message.appendChild(link);
    } else {
        let formated_data = convertAppointmentsUserList(res.data);
        formated_data.forEach(doctor => {
            let card = new DoctorCard(doctor,getCookie("role"));
            doctorContainer.appendChild(card);
        });
    }
}).catch(err => {
    console.log("request failed");
    // console.log(err);
})

function convertAppointmentsUserList(data) {
  const doctors = {};

  data.forEach((appointments) => {

    // ajoute un docteur si pas déjà dans la liste
    let doctorId=appointments.doctor.id;
    if (!doctors[doctorId]) {
      doctors[doctorId] = {
        "id": doctorId,
        "name": appointments.doctor.name,
        "firstname": appointments.doctor.firstname,
        "sector": appointments.sector,
        "appointments": []
      };
    }

    // ajoute rdv
    doctors[doctorId].appointments.push({
        "id": appointments.id,
        "start": appointments.start,
        "end": appointments.end,
        "reserved": false,
        "client":{
            "name":appointments.client.name,
            "firstname":appointments.client.firstname
        }
    });
  });

  // converti en array et renvoie
  return Object.values(doctors);
}