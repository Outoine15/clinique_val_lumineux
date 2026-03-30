var firstnameInput = document.getElementById("firstnameInput");
var nameInput = document.getElementById("nameInput");
var birthdateInput = document.getElementById("birthdateInput");
var mailInput = document.getElementById("mailInput");
var passwordInput = document.getElementById("passwordInput");
var registerButton = document.getElementById("register-bt");

registerButton.addEventListener('click', () => {
    var firstname = firstnameInput.value;
    var name = nameInput.value;
    var birthdate = birthdateInput.value;
    var mail = mailInput.value;
    var password = passwordInput.value;

    if(firstname && name && birthdate && mail && password) { // s'ils sont tous définie
        axios.put(
            "../api/users",
            new URLSearchParams({
                "mail": mail,
                "name": name,
                "firstname": firstname,
                "password": password,
                "birthdate": birthdate
            }).toString()
        ).then(response => {
            var res = response.data;

            try {
                sessionStorage.setItem("user_token", res["token"]);
                window.location.href = "../dashboard";
            } catch (error) {
                // success = false -> une erreur est survenue   
            }
        }).catch(err => {
            // 404 ou 500 -> "une erreur est survenue"
        });
    }
});