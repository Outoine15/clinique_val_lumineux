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
        "../api/user", 
        new URLSearchParams({
            "mail": mail.value,
            "password": password.value
        }).toString()
    ).then(response => {
        var res = response.data;
        //gestion cas de reponse
        try {
            var token= res.token;
            sessionStorage.setItem("token", token);
        } catch (error) {
            // success = false
        }
      })
      .catch(err => {
        // 404 ou 500
      });
    check_conn_connexion();
}
);


function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    if(!sessionStorage.getItem("user_token") && !sessionStorage.getItem("admin_token" && !sessionStorage.getItem("secretary_token") && !sessionStorage.getItem("doctor_token"))){
        console.log("non connecté (conn)");
    } else {
        console.log("connecté, redirection (conn)");
        window.location.replace("index.html");
    }
}
