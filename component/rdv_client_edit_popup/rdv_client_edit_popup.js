import { getCookie } from "../../scripts/cookiesUtils.js";
import { isEmptyObject } from "../../scripts/codeUtils.js";
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

export class RdvClientEditPopup extends HTMLElement {
    client_name;
    rdv_id;

    constructor(rdv_id,rdv_div,client_name,client_firstname) {
        super();
        this.rdv_id=rdv_id;
        this.rdv_div=rdv_div;
        this.client_name=client_name;
        this.client_firstname=client_firstname
        this.innerHTML=`
        <div class="rdvClientEditPopup">
            <button class="rdvClientEditPopupClose" aria-label="Fermer">×</button>
            <section class="rdvClientEditPopupInfo">
            <div>
                gestion du rendez-vous de:
                <p class="client-firstname"></p><p class="client-name"></p>
            </div>
            <div class="unsubscribe-button">se désinscrire du rendez-vous</div>
            </section>
            <section class="rdvClientEditPopupWarnings">
            </section>
        </div>
        `
    }

    connectedCallback() {
        let popup_info_section = this.querySelector(".rdvClientEditPopupInfo");
        let popup_warning_section = this.querySelector(".rdvClientEditPopupWarnings");
        let popup_background_div = document.querySelector(".popup-background-window");
        popup_background_div.classList.add("popup-background-window-active");
        let popup_div = document.querySelector(".rdv-popup-window");
        popup_div.classList.add("rdv-popup-window-active");

        let client_firstname_div=this.querySelector(".client-firstname");
        let client_name_div=this.querySelector(".client-name");
        client_firstname_div.innerHTML=this.client_firstname;
        client_name_div.innerHTML=this.client_name;
        this.querySelector(".rdvClientEditPopupClose").addEventListener("click", () => {
            popup_background_div.classList.remove("popup-background-window-active");
            popup_div.classList.remove("rdv-popup-window-active");
            this.remove();
        });

        this.querySelector(".unsubscribe-button").addEventListener("click", () => {
            axios.delete("../api/appointments/"+this.rdv_id+"/unsubscribe", {
            headers: {
                Authorization: "Bearer "+getCookie("token")
            }
            }).then(res => {
                if(!isEmptyObject(res.data))
                {
                    if(res.data.success==true)
                    {
                        popup_warning_section.innerHTML="suppression réussie !";
                    } else {
                        popup_warning_section.innerHTML="échec de la suppression...";
                    }
                }
            }).catch(err => {
                console.log("request failed");
                console.log(err);
                popup_warning_section.innerHTML="échec de la suppression...";
            })
        });
    }

}


customElements.define("rdv-client-edit-popup", RdvClientEditPopup);
