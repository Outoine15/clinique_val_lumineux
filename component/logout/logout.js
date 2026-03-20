import { deleteCookie } from "/scripts/cookiesUtils.js";
import { check_conn_general } from "/scripts/connUtils.js";

export class LogoutButton extends HTMLElement{
    constructor(data) {
        super();
        this.show();
    }

    show(){
        this.innerHTML=`<button type="button">déconnexion</button>`;
        let exit_bt = this.querySelector("button");
        exit_bt.onclick = function(){
            deleteCookie("role");
            deleteCookie("token");
            check_conn_general();
        }
    }
}

customElements.define("logout-button",LogoutButton);