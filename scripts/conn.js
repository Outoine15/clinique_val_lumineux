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
    let id = 0;
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
            id=1;
            if(res.admin=true){
                sessionStorage.setItem("admin_id",id);
            } else if (res.secretary=true) {
                sessionStorage.setItem("secretary_id",id);
            } else if (res.doctor=true) {
                sessionStorage.setItem("doctor_id",id);
            } else {
                sessionStorage.setItem("user_id",id);
            }
        } catch (error) {
            console.log("erreur de connexion:");
            console.log(res);        
        }
      })
      .catch(err => {
        console.log("request failed");
        console.log(err);
        // temporaire (pour test tant que l'api n'est pas disponible) (TODO: remove this)
        sessionStorage.setItem("user_id",id);
        check_conn_connexion();
      });
    
    check_conn_connexion();
}
);


function check_conn_connexion(){
    //redirection plus precise possible (en fonction du role)
    if(!sessionStorage.getItem("user_id") && !sessionStorage.getItem("admin_id" && !sessionStorage.getItem("secretary_id") && !sessionStorage.getItem("doctor_id"))){
        console.log("non connecté");
    } else {
        window.location.replace("index.html");
        console.log("connecté, redirection");
    }
}
