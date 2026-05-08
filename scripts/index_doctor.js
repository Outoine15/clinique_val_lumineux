import { check_conn_general } from "../scripts/connUtils.js";
check_conn_general("DOCTOR");

import "../component/header/header.js";
import "../component/footer/footer.js";

import { LogoutButton } from "../component/logout/logout.js";
import { isEmptyObject } from "../scripts/codeUtils.js";
import { DoctorCard } from "../component/doctor_card/doctor_card.js";
import { getCookie } from "../scripts/cookiesUtils.js";
//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page qui nécessite une connexion)


let input_new_rdv_date_start = document.getElementById("doctor-new-rdv-date-start");
let input_new_rdv_date_end = document.getElementById("doctor-new-rdv-date-end");
let confirm_rdv_creation = document.getElementById("doctor-new-rdv-confirm");
console.log(input_new_rdv_date_end);
console.log(input_new_rdv_date_start);
confirm_rdv_creation.addEventListener("click", () => {
    axios.put("../api/appointments",
        new URLSearchParams({
            time_start:input_new_rdv_date_start.value,
            time_end:input_new_rdv_date_end.value
        }),
        {
        headers: {
            authorization: "Bearer "+getCookie("token")
        }
    }).then(res => {
        if(!isEmptyObject(res.data)) {
            // requête réussie
            console.log(res.data);
        } else {
            console.log("empty response");
        }
    }).catch(err => {
        console.log("request failed");
        console.log(err);
    })
})



let loggout_bt = new LogoutButton();
let loggout_bt_placement = document.getElementById("logout-button");
loggout_bt_placement.appendChild(loggout_bt)

//creation du div qui va regrouper toute les carte de medecin
let doctorContainer = document.getElementById("doctor-container");

doctorContainer.classList.add("doctor-grid");

axios.get("../api/doctors/appointments", {
    headers: {
        authorization: "Bearer "+getCookie("token")
    }
}).then(res => {
    console.log(res.data);
    let doctor = { "name":null,"firstname":null, id:null, "appointments":res.data};
    console.log(doctor);
    let card = new DoctorCard(doctor,getCookie("role"));
    doctorContainer.appendChild(card);
}).catch(err => {
    console.log("request failed");
    console.log(err);
})
