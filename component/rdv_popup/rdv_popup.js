import { getCookie } from "/scripts/cookiesUtils.js";
import { isEmptyObject } from "/scripts/codeUtils.js";
const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

export class RdvPopup extends HTMLElement {
    data;
    rdv_id;

    constructor(rdv_id) {
        super();
        this.rdv_id=rdv_id;
        this.innerHTML=`
        <div class="rdvPopup">
            <section class="rdvPopupInfo">
            </section>
        </div>
        `
    }

    connectedCallback() {
        let popup_info_section = this.querySelector(".rdvPopupInfo");
        axios.get("/api/clients", {
            headers: {
                Authorization: "Bearer "+getCookie("token")
            }
          }
        ).then(res => {
            if(!isEmptyObject(res.data)){
                this.data = res.data;

                this.data.forEach(client => {
                    let client_info= document.createElement("p");
                    client_info.innerHTML=`
                        <p class="rdvPopupClientName">
                            ${client["firstname"] || "Prénom"} ${client["name"] || "Nom"}
                        </p>
                        `
                    popup_info_section.appendChild(client_info);
                    client_info.addEventListener("click", (event) => {
                    axios.put(
                        "../api/appointments/"+this.rdv_id+"/subscribe", 
                        new URLSearchParams({
                            "client_id": client["id"]
                        }),
                        {
                            headers: {
                                authorization: "Bearer "+getCookie("token")
                            }
                        }    
                    ).then(response => {
                            console.log(response);
                            if(response.data.success==true){
                                // creneau reserve
                                console.log("rdv reservé, id:"+this.rdv_id);
                                this.remove();
                            } else {
                                this.remove();
                                // impossible de reserver le creneau
                            }
                        }).catch(err => {
                            // 404 ou 500
                        });
                    })
                });
            }
            
        }).catch(err => {
            console.log("request failed");
            console.log(err);
        });
    }

}


customElements.define("rdv-popup", RdvPopup);

// TODO:
// - selection client associer
// - button confirmer/annuler
// - &