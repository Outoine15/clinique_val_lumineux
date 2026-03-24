import { setCookie } from "/scripts/cookiesUtils.js";
import { check_conn_connexion } from "/scripts/connUtils.js";

check_conn_connexion();

const conn_bt = document.getElementById("connexion-bt");
const icon = document.getElementById("togglePassword");
const pwd = document.getElementById("password");
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

    axios.post(
        "../api/users", 
        new URLSearchParams({
            "mail": mail.value,
            "password": password.value
        }).toString()
    ).then(response => {
        var res = response.data;
        //gestion cas de reponse
        try {
            if(res.success==false){
                // identifiant/mdp invalid
            } else {
                var token = res.token;

                setCookie("token",token);
                // document.cookie = "token="+token+"; max-age=3600; path=/; Secure; SameSite=Strict";
                // sessionStorage.setItem("token", token);

                var role = "USER";
                if (res.admin){
                    role = "ADMIN";
                } else if (res.secretary){
                    role = "SECRETARY";
                } else if (res.doctor){
                    role = "DOCTOR";
                }
                setCookie("role",role);
                // document.cookie = "role="+role+"; max-age=3600; Secure; SameSite=Strict";
                // sessionStorage.setItem("role",role);
            }
        } catch (error) {
            // success = false
        }
        check_conn_connexion();
      })
      .catch(err => {
        // 404 ou 500
      });
}
);