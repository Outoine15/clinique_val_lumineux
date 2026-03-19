import { DoctorCard } from "../component/doctor_card/doctor_card.js";

//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page)
// check_conn_general();


function check_conn_general(){
    if(!sessionStorage.getItem("user_token") && !sessionStorage.getItem("admin_token" && !sessionStorage.getItem("secretary_token") && !sessionStorage.getItem("doctor_token"))){
        console.log("non connecté, redirection (main)");
        window.location.replace("conn.html");
    } else {
        console.log("connecté (main)");
    }
}

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