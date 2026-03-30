const cssLink = document.createElement("link");
const policeLink = document.createElement("link");
cssLink.setAttribute("rel","stylesheet");
cssLink.setAttribute("href",import.meta.url.replace(".js",".css"));
policeLink.setAttribute("rel","stylesheet");
policeLink.setAttribute("href","https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap");
document.head.appendChild(cssLink);
document.head.appendChild(policeLink);

class Header extends HTMLElement {
    constructor(){
        super();

        this.innerHTML = `
            <header>
                <a href="../home">Clinique du Val Lumineux</a> 
                <div class="pages">
                    <a href="#">RDV</a>
                    <a href="../account" class="account">Compte</a>
                </div>
            </header>
        `;
    }
}

customElements.define("header-component", Header);