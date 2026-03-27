const cssLink = document.createElement("link");
cssLink.setAttribute("rel","stylesheet");
cssLink.setAttribute("href",import.meta.url.replace(".js",".css"));
document.head.appendChild(cssLink);

class Header extends HTMLElement {
    constructor(){
        super();

        this.innerHTML = `
            <header>
                <h2>Clinique du Val Lumineux</h2> 
                <div class="pages">
                    <a href="#">RDV</a>
                    <a href="../account">Compte</a>
                </div>
            </header>
        `;
    }
}

customElements.define("header-component", Header);