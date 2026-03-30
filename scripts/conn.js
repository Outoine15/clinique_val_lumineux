import { setCookie } from "../scripts/cookiesUtils.js";
import { check_conn_connexion } from "../scripts/connUtils.js";

check_conn_connexion();

const conn_bt = document.getElementById("connexion-bt");
const icon = document.getElementById("togglePassword");
const pwd = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");
const forgotPassword = document.querySelector(".forgot-password");
const logo = document.querySelector(".logo i");
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

logo.addEventListener("click",()=>{
    window.location.replace("../home");
});

pwd.addEventListener('input',(event)=>{
    const val = event.target.value;
    let score = 0;
    if (val.length >= 1){
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

    axios.post("../api/users",
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
                errorMessage.innerHTML = "Identifiants incorrects.";
                forgotPassword.style.backgroundColor = "#ffebeb";
                forgotPassword.style.borderRadius = "6px";
                forgotPassword.style.fontSize = "15px";
            } else {
                var token = res.token;
                var role = res.role;

                setCookie("token",token);
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