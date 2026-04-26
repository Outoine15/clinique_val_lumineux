import "../component/header/header.js";
import "../component/footer/footer.js";

import { getCookie } from "../../scripts/cookiesUtils.js";
import { isEmptyObject } from "../../scripts/codeUtils.js";
import { LogoutButton } from "../component/logout/logout.js";
import { generateClientCode } from "../scripts/codeUtils.js";

let loggout_bt = new LogoutButton();
let loggout_bt_placement = document.getElementById("logout-button");
loggout_bt_placement.appendChild(loggout_bt)

let user_manage_client_info_section = document.querySelector(".user-manage-client-info");

axios.get("../api/clients", {
    headers: {
        Authorization: "Bearer "+getCookie("token")
    }
    }
).then(res => {
    if(!isEmptyObject(res.data)){
        res.data.forEach(client => {
            let client_info = document.createElement("div");
            client_info.classList.add("client-info");
            let client_name = document.createElement("div");
            let client_code = document.createElement("div");
            client_name.innerHTML=`${client["name"]} ${client["firstname"]}`
            client_code.innerHTML=`${generateClientCode(client["id"],client["name"],client["firstname"])}`;
            client_info.appendChild(client_name);
            client_info.appendChild(client_code);
            user_manage_client_info_section.appendChild(client_info);
        });
    }
}).catch(err => {
    console.log("request failed");
    console.log(err);
});


let client_code_input = document.getElementById("client-code");
let client_code_confirm = document.getElementById("client-code-confirm");

client_code_confirm.addEventListener("click", () => {
    console.log(client_code_input.value);
    axios.put("../api/clients",
        new URLSearchParams({
            client_code:client_code_input.value
    }),
    {
        headers: {
            Authorization: "Bearer "+getCookie("token")
        }
    }).then(response => {
        console.log(response.data);
    }).catch(err => {
        console.log("request failed");
        console.log(err);
    })
})


let new_client_firstname = document.getElementById("new-client-firstname");
let new_client_lastname = document.getElementById("new-client-lastname");
let new_client_birthday = document.getElementById("new-client-birthday");

let new_client_confirm = document.getElementById("new-client-confirm");

new_client_confirm.addEventListener("click", () => {
    console.log("création d'un nouveau client...");
    console.log(new_client_birthday.value);
    axios.post("../api/clients",
        new URLSearchParams({
            name:new_client_lastname.value,
            firstname:new_client_firstname.value,
            birthday:new_client_birthday.value
        }),
        {
            headers: {
                Authorization: "Bearer "+getCookie("token")
            }
        }).then(response => {
            console.log(response.data);
        }).catch(err => {
            console.log("request failed");
            console.log(err);
        })
})