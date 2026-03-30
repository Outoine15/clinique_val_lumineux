import { setCookie } from "/scripts/cookiesUtils.js";
import { check_conn_connexion } from "/scripts/connUtils.js";

check_conn_connexion();

const conn_bt = document.getElementById("connexion-bt");
const icon = document.getElementById("togglePassword");
const pwd = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");
let mail = document.getElementById("mail");
let password = document.getElementById("password");

// toggle visibilite mdp
icon.addEventListener('click', (event) => {
  if(password.type === "password") {
    password.type = "text";
    icon.classList.add("fa-eye");
    icon.classList.remove("fa-eye-slash");
  }
  else {
    password.type = "password";
    icon.classList.add("fa-eye-slash");
    icon.classList.remove("fa-eye");
  }
});

pwd.addEventListener('input',(event)=>{
    const val = event.target.value;
    let score = 0;
    if (val.length >= 8){
        score = score +1;
    }if(/[A-Z]/.test(val)){
        score = score +1;
    }if (/[0-9]/.test(val)){
        score = score +1;
    }if (/[^A-Za-z0-9]/.test(val)){
        score = score +1;
    }
    const Sbar = document.getElementById("strengthFill");
    const couleurs = ['red','orange','lightgreen','green'];
    if(val.length == 0){
        Sbar.style.width = '0%';
    } else{
        Sbar.style.width = (score*25)+'%';
    }
    Sbar.style.backgroundColor = couleurs[score-1];
    

});

//confirmation (connexion)
conn_bt.addEventListener("click", (event) => {
    let token = "";
    //recuperation mail/password

    console.log(mail.value, password.value);
    axios.post("/api/users",
    new URLSearchParams({
      mail: mail.value,
      password: password.value
    }))
      .then(response => {
        var res = response.data;
        //gestion cas de reponse
        try {
            if(res.success==false){
                // identifiant/mdp invalid
            } else {
                var token = res.token;

                setCookie("token",token);

                role=res.role;
                setCookie("role",role);
            }
        } catch (error) {
            // success = false
        }
        check_conn_connexion();
    })
      .catch(err => {
        console.log("request failed");
        console.log(err);
      });
}
);


// function check_conn_connexion(){
//     //redirection plus precise possible (en fonction du role)
//     if(!sessionStorage.getItem("user_token") && !sessionStorage.getItem("admin_token") && !sessionStorage.getItem("secretary_token") && !sessionStorage.getItem("doctor_token")){
//         console.log("non connecté (conn)");
//     } else {
//         if(sessionStorage.getItem("user_token")){
//             console.log("user connexion (conn)");
//             window.location.replace("index.html");
//         }
//         if (sessionStorage.getItem("admin_token")){
//             console.log("admin connexion (conn)");
//             window.location.replace("index_admin.html");
//         }
//         if (sessionStorage.getItem("secretary_token")){
//             console.log("secretary connexion (conn)");
//             window.location.replace("index_secretary.html");
//         }
//         if (sessionStorage.getItem("doctor_token")){
//             console.log("doctor connexion (conn)");
//             window.location.replace("index_doctor.html");
//         }
//     }
// }
