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

    axios.post("/api/user", {
        params: {
            mail: mail.value,
            password: password.value
      }
    })
      .then(res => {
        console.log(res);
        //gestion cas de reponse
        try {
            token = res.token;
            if(res.admin==true){
                sessionStorage.setItem("admin_token",token);
            } else if (res.secretary==true) {
                sessionStorage.setItem("secretary_token",token);
            } else if (res.doctor==true) {
                sessionStorage.setItem("doctor_token",token);
            } else {
                sessionStorage.setItem("user_token",token);
            }
        } catch (error) {
            console.log("erreur de connexion:");
            console.log(res);        
        }
      })
      .catch(err => {
        console.log("request failed");
        console.log(err);
      });
    // console.log("bypass");
    // sessionStorage.setItem("user_token","test");
    check_conn_connexion();
}
);


function check_conn_connexion(){
    console.log("user: "+sessionStorage.getItem("user_token"));
    console.log("admin: "+sessionStorage.getItem("admin_token"));
    console.log("secretary: "+sessionStorage.getItem("secretary_token"));
    console.log("doctor: "+sessionStorage.getItem("doctor_token"));

    //redirection plus precise possible (en fonction du role)
    if(!sessionStorage.getItem("user_token") && !sessionStorage.getItem("admin_token") && !sessionStorage.getItem("secretary_token") && !sessionStorage.getItem("doctor_token")){
        console.log("non connecté (conn)");
    } else {
        if(sessionStorage.getItem("user_token")){
            console.log("user connexion (conn)");
            window.location.replace("index.html");
        }
        if (sessionStorage.getItem("admin_token")){
            console.log("admin connexion (conn)");
            window.location.replace("index_admin.html");
        }
        if (sessionStorage.getItem("secretary_token")){
            console.log("secretary connexion (conn)");
            window.location.replace("index_secretary.html");
        }
        if (sessionStorage.getItem("doctor_token")){
            console.log("doctor connexion (conn)");
            window.location.replace("index_doctor.html");
        }
        //redirection par defaut (ne devrait jamais se produire)
        console.log("connecté, redirection (attention, redirection par defaut)");

        window.location.replace("index.html");
    }
}
