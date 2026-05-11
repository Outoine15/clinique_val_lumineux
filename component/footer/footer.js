const cssLink = document.createElement("link");
cssLink.setAttribute("rel","stylesheet");
cssLink.setAttribute("href",import.meta.url.replace(".js",".css"));
document.head.appendChild(cssLink);

class Footer extends HTMLElement {
    constructor(){
        super();

        this.innerHTML = `
            <footer>
                <section>
                    <a href="#"> Politique de confidentialité </a>
                    <a href="#"> CGU </a>
                </section>

                <hr/>

                <section>
                    <p>secretariat@clinique.fr</p>
                    <p>+33 4 65 71 64 45</p>
                    <p>3 rue d'Italie, 73000 Chambéry</p>
                </section>
            </footer>
        `;
    }
}

customElements.define("footer-component", Footer);