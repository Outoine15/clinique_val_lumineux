import { isEmptyObject } from "../scripts/codeUtils.js";
import { check_conn_connexion } from "../scripts/connUtils.js";
import { setCookie } from "../scripts/cookiesUtils.js";

var firstnameInput = document.getElementById("firstnameInput");
var nameInput = document.getElementById("nameInput");
var birthdateInput = document.getElementById("birthdateInput");
var mailInput = document.getElementById("mailInput");
var passwordInput = document.getElementById("passwordInput");
var registerButton = document.getElementById("register-bt");
const logo = document.querySelector(".logo i");

logo.addEventListener("click",()=>{
    window.location.replace("../home");
});


registerButton.addEventListener('click', () => {
    var firstname = firstnameInput.value;
    var name = nameInput.value;
    var birthdate = birthdateInput.value;
    var mail = mailInput.value;
    var password = passwordInput.value;
    console.log("click");
    if(firstname && name && birthdate && mail && password) { // s'ils sont tous définie
        axios.put("../api/users",
            new URLSearchParams({
                mail: mail,
                name: name,
                firstname: firstname,
                password: password,
                birthdate: birthdate
            }).toString()
        ).then(response => {
            console.log(response.data);
                        var res = response.data;
                        //gestion cas de reponse
                        if(!isEmptyObject(response.data)){
                            var token = res.token;
                            var role = res.role;
                        
                            setCookie("token",token);
                            setCookie("role",role);
                        }
                        check_conn_connexion();
        }).catch(err => {
            console.log(err);
            // 404 ou 500 -> "une erreur est survenue"
        });
    }
});