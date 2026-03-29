import { setCookie } from "/scripts/cookiesUtils.js";
import { check_conn_connexion } from "/scripts/connUtils.js";

check_conn_connexion();

const conn_bt = document.getElementById("connexion_bt");
const icon = document.getElementById("togglePassword");
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

                role=res.role;
                setCookie("role",role);
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