import { getCookie } from "../../scripts/cookiesUtils.js";
import { isEmptyObject } from "../../scripts/codeUtils.js";
import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

export class RdvEditPopup extends HTMLElement {
    data;
    rdv_id;

    constructor(rdv_id,rdv_div) {
        super();
        this.rdv_id=rdv_id;
        this.rdv_div=rdv_div;
        this.innerHTML=`
        <div class="rdvEditPopup">
            <button class="rdvEditPopupClose" aria-label="Fermer">×</button>
            <p>Modifier le rendez-vous</p>
            <section class="rdvEditPopupInfo">
            <div class="delete-button">Supprimer</div>
            </section>
            <section class="rdvEditPopupWarnings">
            </section>
        </div>
        `
    }

    connectedCallback() {
        let popup_info_section = this.querySelector(".rdvEditPopupInfo");
        let popup_warning_section = this.querySelector(".rdvEditPopupWarnings");
        let popup_background_div = document.querySelector(".popup-background-window");
        popup_background_div.classList.add("popup-background-window-active");
        let popup_div = document.querySelector(".rdv-popup-window");
        popup_div.classList.add("rdv-popup-window-active");

        this.querySelector(".rdvEditPopupClose").addEventListener("click", () => {
            popup_background_div.classList.remove("popup-background-window-active");
            popup_div.classList.remove("rdv-popup-window-active");
            this.remove();
        });

        this.querySelector(".delete-button").addEventListener("click", () => {
            axios.delete("../api/appointments/"+this.rdv_id, {
            headers: {
                Authorization: "Bearer "+getCookie("token")
            }
            }).then(res => {
                if(!isEmptyObject(res.data))
                {
                    if(res.data.success==true)
                    {
                        popup_warning_section.innerHTML="Le rendez-vous a été supprimé avec succès !";
                        popup_warning_section.classList.add("visible");
                    } else {
                        popup_warning_section.innerHTML="Impossible de supprimer le rendez-vous...";
                    }
                }
            }).catch(err => {
                console.log("request failed");
                console.log(err);
                popup_warning_section.innerHTML="Une erreur est survenue lors de la suppression du rendez-vous...";
            })
        });
    }

}


customElements.define("rdv-edit-popup", RdvEditPopup);
