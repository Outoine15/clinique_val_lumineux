import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
const cssLink = document.createElement("link");
const policeLink = document.createElement("link");
cssLink.setAttribute("rel","stylesheet");
cssLink.setAttribute("href",import.meta.url.replace(".js",".css"));
policeLink.setAttribute("rel","stylesheet");
policeLink.setAttribute("href","https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap");
document.head.appendChild(cssLink);
document.head.appendChild(policeLink);

const JOURS = ["dim","lun","mar","mer","jeu","ven","sam"];
const HEURES = ["08","09","10","11","12","13","14","15","16","17","18"];

class Planning extends HTMLElement {
    constructor() {
        super();
        this.allDoctors = [];
        this.selectedDoctorId = "Tous"; 
        //on récupere la semaine actuelle.
        this.semaineActuelle = this.getSemaineActuelle(); 
    }

    getSemaineActuelle(){
        let dates = [];
        let aujd = new Date();
        let jourSemaine =aujd.getDay();
        //Calcul quel est le lundi le plus proche (si on est dimanche on veux le lundi de la semaine d'avant,)
        let ecartAvecLundi = aujd.getDate() - jourSemaine + (jourSemaine == 0 ? -6 : 1);
        //on crée une date en partant d'aujourd'hui et on ajoute l'écart pour avoir une date correspondant a notre lundi actuel.
        let lundi = new Date(aujd.setDate(ecartAvecLundi));

        //on boucle 5 fois pour avoir notre semaine complète.
        for(let i=0 ;i<5;i++ ){
            //on crée notre lundi actuel qu'on décale du nb de tr de boucle.
            let d = new Date(lundi);
            d.setDate(lundi.getDate()+i);
            dates.push(d);
        }
        return dates;
    }
    
    //Des que code injecté on éxécute
    async connectedCallback() {
        //on charge notre data dans API
        await this.loadData();
        this.render();
    }

    async loadData() {
        try {
            //on charge api doctors
            const res = await axios.get("../api/doctors");
            this.allDoctors = res.data;
        } catch (error) {
            console.error("Erreur chargement :", error);
        }
    }

    //fonction qui "dessine" notre tab (appeller a chaque changement)
    render() {
        //options => menu peremet de choisir quel docteur on veux voir
        let options = `<option value="Tous">Tous les médecins</option> `;
        for (let doc of this.allDoctors) {
            //pour chaque doc on ajoute une nv option
            options += `<option value="${doc.id}">Dr ${doc.name}</option>`;
        }

        //on initialise nos options + notre tableau vide
        let html = `
            <div class="planning-control">
                <select id="selectDoc">${options}</select>
                <div class="navigation">
                    <button class="bt-nav" id="semainePrec">◀</button>
                    <button class="bt-nav" id="semaineActuelle">Naviguation</button>
                    <button class="bt-nav" id="semaineSuiv">▶</button>
                </div>
            </div>
            <div class="planning-grid">
                <div class="case-vide"></div>
        `;

        this.semaineActuelle.forEach(dateJour => {
            let jour = JOURS[dateJour.getDay()]; 
            let jj = dateJour.getDate() < 10 ? "0" + dateJour.getDate() : dateJour.getDate();
            //(getMonth + 1) car janvier = 0
            let mm = (dateJour.getMonth() + 1) < 10 ? "0" + (dateJour.getMonth() +1) : (dateJour.getMonth() +1);

            html += `<div class="header-jour">${jour} ${jj}/${mm}</div>`;
        });

        for (let h of HEURES) {
            //on ajt chaque heure en début de ligne.
            html += `<div class="colonne-heure">${h}h00</div>`;

            //On rempli la case en gris si elle est occupée.
            this.semaineActuelle.forEach(dateCol=>{
                let occupe = this.estOccupe(dateCol,parseInt(h));
                html += `<div class="cellule ${occupe ? 'occupe' : ''}">${occupe ? 'Pris' : ''}</div>`;
            });
        }


        html += `</div>`;
        this.innerHTML = html;

        //evite de rester sur l'option "Tous"
        this.querySelector("#selectDoc").value = this.selectedDoctorId;
        //a chaque changement on repositionne notre choix et on repaint 
        this.querySelector("#selectDoc").addEventListener("change", (e) => {
            this.selectedDoctorId = e.target.value;
            this.render();
        });
        //Ajout de 7j dans notre semaine actuelle + repaint.
        this.querySelector("#semaineSuiv").addEventListener("click",(e)=>{
            this.semaineActuelle = this.semaineActuelle.map(jour=>{
                let nouvelleDate = new Date(jour);
                nouvelleDate.setDate(nouvelleDate.getDate() + 7);
                return nouvelleDate;
            });
            this.render();
        });
        //Retrait de 7jours dans notre semaine actuelle + repaint.
        this.querySelector("#semainePrec").addEventListener("click",(e)=>{
            this.semaineActuelle = this.semaineActuelle.map(jour=>{
                let nouvelleDate = new Date(jour);
                nouvelleDate.setDate(nouvelleDate.getDate() - 7);
                return nouvelleDate;
            });
            this.render();
        });
        //Retrait de 7jours dans notre semaine actuelle + repaint.
        this.querySelector("#semaineActuelle").addEventListener("click",(e)=>{
            this.semaineActuelle = this.getSemaineActuelle();
            this.render();
        });
    }

    estOccupe(date, h) {
        let res = false;
        //on parcours tous les docs
        for (let doc of this.allDoctors) {
            //si doc choisi /= "Tous" ou du doc actuel on continue
            if (!(this.selectedDoctorId != "Tous" && doc.id != this.selectedDoctorId)) {
                //si ce doc a des rdv
                if (doc.appointments) {
                    //on parcours tous ses rdv
                    for (let app of doc.appointments) {
                        //a chaque rdv on crée un objet Date avec les mm propriétes.
                        let dateRdv = new Date(app.start);
                        let mmDate = (
                        dateRdv.getFullYear() === date.getFullYear() &&
                        dateRdv.getMonth() === date.getMonth() &&
                        dateRdv.getDate() === date.getDate()
                    );                        //si notre rdv corresponds a la case actuelle on renvoie vrai.
                        if (mmDate && dateRdv.getHours() == h && app.reserved == true) {
                            res = true;
                        }
                    }
                }
            }
        }

        return res;
    }
}

customElements.define("planning-component", Planning);