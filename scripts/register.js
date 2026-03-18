var firstnameInput = document.getElementById("firstnameInput");
var nameInput = document.getElementById("nameInput");
var birthdateInput = document.getElementById("birthdateInput");
var mailInput = document.getElementById("mailInput");
var passwordInput = document.getElementById("passwordInput");
var registerButton = document.getElementById("registerButton");

registerButton.addEventListener('click', () => {
    var firstname = firstnameInput.value;
    var name = nameInput.value;
    var birthdate = birthdateInput.value;
    var mail = mailInput.value;
    var password = passwordInput.value;

    if(firstname && name && birthdate && mail && password) { // s'ils sont tous définie
        axios.put(
            "/api/users",
            `mail=${mail}&name=${name}&firstname=${firstname}&password=${password}&birthdate=${birthdate}`
        ).then(response => {
            var res = response.data;

            if(res[success] != false) {
                sessionStorage.setItem("user_token", res["token"]);
                window.location.href = "../account";
            } else {
                // une erreur est survenue
            }
        });
    }
});