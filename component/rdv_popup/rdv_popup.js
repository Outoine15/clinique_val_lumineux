import { getCookie } from "../../scripts/cookiesUtils.js";
import { isEmptyObject } from "../../scripts/codeUtils.js";
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

export class RdvPopup extends HTMLElement {
    data;
    rdv_id;

    constructor(rdv_id,rdv_div) {
        super();
        this.rdv_id=rdv_id;
        this.rdv_div=rdv_div;
        this.innerHTML=`
        <div class="rdvPopup">
            <button class="rdvPopupClose" aria-label="Fermer">×</button>
            <p>Pour qui prendre le rendez-vous ?</p>
            <section class="rdvPopupInfo">
            </section>
            <section class="rdvPopupWarnings">
            </section>
        </div>
        `
    }

    connectedCallback() {
        let popup_info_section = this.querySelector(".rdvPopupInfo");
        let popup_warning_section = this.querySelector(".rdvPopupWarnings");
        let popup_background_div = document.querySelector(".popup-background-window");
        popup_background_div.classList.add("popup-background-window-active")
        let popup_div = document.querySelector(".rdv-popup-window");
        popup_div.classList.add("rdv-popup-window-active");

        this.querySelector(".rdvPopupClose").addEventListener("click", () => {
            popup_background_div.classList.remove("popup-background-window-active");
            popup_div.classList.remove("rdv-popup-window-active");
            this.remove();
        });


        axios.get("../api/clients", {
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
                                if(response.data.success==true){
                                    popup_warning_section.innerHTML="rendez-vous réservé avec succès";
                                    setTimeout(()=> {
                                        this.rdv_div.classList.add("reserved"); //marque le creneau comme réservé
                                        popup_background_div.classList.remove("popup-background-window-active")
                                        popup_div.classList.remove("rdv-popup-window-active");
                                        this.remove();
                                    },2500);
                                    // creneau reserve
                                } else {
                                    popup_warning_section.innerHTML="imposible de réserver le rendez vous";
                                    setTimeout(()=> {
                                        popup_background_div.classList.remove("popup-background-window-active")
                                        popup_div.classList.remove("rdv-popup-window-active");
                                        this.remove();
                                    },2500);
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
