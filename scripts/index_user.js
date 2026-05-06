import "../component/header/header.js";
import "../component/footer/footer.js";

import { getCookie } from "../scripts/cookiesUtils.js";
import { isEmptyObject } from "../scripts/codeUtils.js";
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
            client_info.classList.add("client-id-"+client["id"]);
            let client_name = document.createElement("div");
            let client_code = document.createElement("div");
            let client_delete = document.createElement("button");
            client_name.innerHTML=`${client["name"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${client["firstname"]}`
            client_code.innerHTML=`${generateClientCode(client["id"],client["name"],client["firstname"])}`;
            client_delete.innerHTML=`supprimer`;
            client_delete.addEventListener("click", () => {
                axios.delete("../api/clients/"+client["id"], {
                    headers: {
                        Authorization: "Bearer "+getCookie("token")
                    }
                }).then(res => {
                    if(!isEmptyObject(res.data)){
                        console.log(res.data);
                        if(res.data.success=true){
                            let this_client = document.getElementsByClassName("client-id-"+client["id"])[0];
                            console.log()
                            this_client.remove();
                        }
                    }
                }).catch(err => {

            });
            });
            client_info.appendChild(client_name);
            client_info.appendChild(client_code);
            client_info.appendChild(client_delete);
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
        if(!isEmptyObject(response.data)){
            if(response.data.success==true){
                let client=response.data.client;
                let client_info = document.createElement("div");
                client_info.classList.add("client-info");
                let client_name = document.createElement("div");
                let client_code = document.createElement("div");
                client_name.innerHTML=`${client["name"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${client["firstname"]}`
                client_code.innerHTML=`${generateClientCode(client["id"],client["name"],client["firstname"])}`;
                client_info.appendChild(client_name);
                client_info.appendChild(client_code);
                user_manage_client_info_section.appendChild(client_info);
            }
        }
    }).catch(err => {
        console.log("request failed");
        console.log(err);
    })
})


let new_client_firstname = document.getElementById("new-client-firstname");
let new_client_lastname = document.getElementById("new-client-lastname");
let new_client_birthdate = document.getElementById("new-client-birthdate");

let new_client_confirm = document.getElementById("new-client-confirm");

new_client_confirm.addEventListener("click", () => {
    axios.post("../api/clients",
        new URLSearchParams({
            name:new_client_lastname.value,
            firstname:new_client_firstname.value,
            birthdate:new_client_birthdate.value
        }),
        {
            headers: {
                Authorization: "Bearer "+getCookie("token")
            }
        }).then(response => {
            console.log(response.data);
            if(!isEmptyObject(response.data.id)){
                let client=response.data;
                let client_info = document.createElement("div");
                client_info.classList.add("client-info");
                let client_name = document.createElement("div");
                let client_code = document.createElement("div");
                client_name.innerHTML=`${client["name"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${client["firstname"]}`
                client_code.innerHTML=`${generateClientCode(client["id"],client["name"],client["firstname"])}`;
                client_info.appendChild(client_name);
                client_info.appendChild(client_code);
                user_manage_client_info_section.appendChild(client_info);
            }
        }).catch(err => {
            console.log("request failed");
            console.log(err);
        })
})