import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
import { check_conn_general } from "../../scripts/connUtils.js";
import { isEmptyObject } from "../../scripts/codeUtils.js";
import { getCookie } from "../../scripts/cookiesUtils.js";
import { RdvPopup } from "../rdv_popup/rdv_popup.js";
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
        this.allSectors = [];
        this.selectedDoctorId = "Tous"; 
        this.selectedSectorId = "Tous";
        //on récupere la semaine actuelle.
        this.semaineActuelle = this.getSemaineActuelle(); 
    }

    getSemaineActuelle(){
        let dates = [];
        let aujd = new Date();
        let jourSemaine = aujd.getDay();
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
        if(this.allDoctors && this.allDoctors.length > 0){
            this.render();
        }else{
            console.log("erreur de bdd, allDoctors est vide."); 
        }
    }

    async loadData() {
        try {
            //on charge api doctors
            const resDoc = await axios.get("../api/doctors");
            this.allDoctors = Array.isArray(resDoc.data) ? resDoc.data : [];
            console.log(this.allDoctors);
        } catch (error) {
            console.error("Erreur chargement :", error);
        }

        try{
            //on charge api sectors
            const resSect = await axios.get("../api/sectors");
            //on initialise allSectors en vérifiant que c'est bien un Array.
            this.allSectors = Array.isArray(resSect.data) ? resSect.data : [];
            console.log("sectors chargés : ",this.allSectors);
        } catch(error){
            console.error("Erreur de chargement :",error);
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

        //on crée une valeur pour tous les secteurs
        let sectors = `<option value="Tous">Toutes les secteurs</option>`;
        for(let sect of this.allSectors){
            //pour chaque secteur on crée une option avec son nom
            sectors += `<option value="${sect.id}">${sect.name}</options>`;
        }
        

        //on initialise nos options + notre tableau vide
        let html = `
            <div class="planning-control">
                <select id="selectDoc">${options}</select>
                <select id="selectSect">${sectors}</select>
                <div class="navigation">
                    <button class="bt-nav" id="semainePrec">◀</button>
                    <button class="bt-nav" id="semaineActuelle">Aujourd'hui</button>
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

            html += `
            <div class="header-jour">
                <span class="hj-jour">${jour}</span>
                <span class="hj-date">${jj}/${mm}</span>
            </div>`;
        });
        for (let h of HEURES) {
            //on ajt chaque heure en début de ligne.
            html += `<div class="colonne-heure">${h}h00</div>`;
            //On rempli la case en gris si elle est occupée.
            this.semaineActuelle.forEach(dateCol=>{
                let rdv_id = this.getRdvId(dateCol,parseInt(h));
                let etatCreneau = this.estOccupe(dateCol,parseInt(h));
                let annee = dateCol.getFullYear();
                let mois = (dateCol.getMonth() + 1) < 10 ? "0" + (dateCol.getMonth() +1) : (dateCol.getMonth() +1);
                let jour = dateCol.getDate() < 10 ? "0" + dateCol.getDate() : dateCol.getDate();
                let heure = `${h}:00:00.000000`;
                let fullDate = `${annee}-${mois}-${jour} ${heure}`;

                let finCreneau = new Date(
                    dateCol.getFullYear(),
                    dateCol.getMonth(),
                    dateCol.getDate(),
                    parseInt(h) + 0, 0, 0, 0
                );

                //Si la date est passée, on met etatCrénau a 3 qui corresponds a passé.
                if(finCreneau < new Date()){
                    etatCreneau = 3;
                }
                html += `<div class="cellule ${etatCreneau==1 ? 'occupe' : etatCreneau==2 ? 'disponible' : etatCreneau==3 ? 'passe' : ''}" data-creneauStart="${fullDate}" data-rdvId="${rdv_id || ''}">${etatCreneau==1 ? 'Pris' : etatCreneau==2 ? 'Reserver' : ''}</div>`;
            });
        }


        html += `</div>`;
        html += `
        <div class="popup-background-window">
            <div class="rdv-popup-window"></div>
        </div>
        `;
        html += `<div class="slot-tooltip"></div>`;
        this.innerHTML = html;
        //On récupère le tooltip "vide"
        const toolTip = this.querySelector(".slot-tooltip");

        //evite de rester sur l'option "Tous"
        this.querySelector("#selectDoc").value = this.selectedDoctorId;
        //a chaque changement on repositionne notre choix et on repaint 
        this.querySelector("#selectDoc").addEventListener("change", (e) => {
            this.selectedDoctorId = e.target.value;
            this.render();
        });

        //évite de rester sur l'option "Tous"
        this.querySelector("#selectSect").value = this.selectedSectorId;
        //a chaque changement on modifie notre choix et on repaint
        this.querySelector("#selectSect").addEventListener("change",(e)=>{
            this.selectedSectorId = e.target.value;
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

        this.querySelectorAll(".cellule.disponible").forEach(cellule=>{
            cellule.addEventListener("click",(e)=>{
                //verifier que l'utilisateur est co, si non on redirige vers connexion 
                check_conn_general("USER");


                const date = new Date(cellule.getAttribute("data-creneauStart").replace(" ", "T"));
                const docs = this.getDoctorsSlot(date, date.getHours());
                const dispos = docs.filter(d => !d.reserved);

                //Si on a que un créneau dispo, on dmd direct avec qui on veux le prendre
                if(dispos.length == 1){

                    this.ouvrirRdvPopup(dispos[0].rdv_id,cellule);
                    
                //Sinon on propose au user de clicker sur le docteur avec qui il veux prendre le rdv.
                } else {
                    this.querySelector(".choix-docteur")?.remove();

                    const menu = document.createElement("div");
                    menu.className = "choix-docteur";

                    let html = `<p class="choix-titre">Choisir le médecin :</p>`;
                    for(let dispo of dispos){
                        html += `
                            <button class="choix-item" data-rdv-id="${dispo.rdv_id}">
                                Dr ${dispo.name} ${dispo.firstname} - ${dispo.sector}
                            </button>
                        `;
                    }
                    menu.innerHTML = html;

                    menu.style.left = (e.clientX + 10) + "px";
                    menu.style.top  = (e.clientY + 10) + "px";

                    document.body.appendChild(menu);


                    menu.querySelectorAll(".choix-item").forEach(bt => {
                        bt.addEventListener("click", () => {
                            const rdv_id = bt.getAttribute("data-rdv-id");
                            menu.remove();
                            this.ouvrirRdvPopup(rdv_id, cellule);
                        });
                    });


                    setTimeout(() => {
                        document.addEventListener("click", (e) => {
                            //Si l'endroit clické n'est pas dans le menu, alors on supprime le menu actuel
                            if (! menu.contains(e.target)) menu.remove();
                            //paramètre de addEventListner qui permet de "réinitialiser" si on a clické ou pas a chaque fois
                        }, { once: true });
                     }, 0);
                    
                }

                
            
            })
        })

        //Tooltip sur CHAQUE case si on passe la souris dessus
        this.querySelectorAll(".cellule.occupe, .cellule.disponible").forEach(cellule=>{
            //On remplace l'esapce par un T pour que ca puisse correspondre au format Date()
            const date = new Date(cellule.getAttribute("data-creneauStart").replace(" ","T"));
            console.log(date);
            
            //Quand la souris entre on injecte le html du tooltip avec TOUS les docs pour ce créneau précis.
            cellule.addEventListener("mouseenter",()=>{
                const docs = this.getDoctorsSlot(date,date.getHours());
                // console.log(docs);
                if(docs.length != 0){
                    let htmlToolTip = "";
                    for(let doc of docs){
                        htmlToolTip += `
                            <div class="tooltip-item ${doc.reserved ? 'pris' : 'libre'}">
                                <span class="tooltip-dot"></span>
                                    Dr ${doc.name} ${doc.firstname} : ${doc.sector}
                                <span class="tooltip-state">${doc.reserved ? 'pris' : 'libre'}</span>
                            </div>
                        `;
                    }
                    toolTip.innerHTML = `
                    <div class="tooltip-title">Médecins</div>
                    ${htmlToolTip}
                    `;
                    toolTip.classList.add("visible");
                }
            });

            //On affiche le tooltip a coté de la souris
            cellule.addEventListener("mousemove",(e)=>{
                toolTip.style.left = (e.clientX + 15) + "px";
                toolTip.style.top = (e.clientY + 15) + "px";
            });

            //Quand on quitte la cellule on "cache" le tooltip
            cellule.addEventListener("mouseleave",()=>{
                toolTip.classList.remove("visible");
            });
        })


    }

    ouvrirRdvPopup(rdv_id,cellule){
        let rdv_div=document.querySelector(".rdv-popup-window");
        const popup = new RdvPopup(rdv_id,cellule);
        rdv_div.appendChild(popup)
    }
                    
                

    rightSector(doc){
        return this.selectedSectorId == "Tous" || doc.sector.id == this.selectedSectorId;
    }

    //fonction renvoie 0 => créneau vide
                     //1 => créneau occupé
                     //2 => créneau dispo
    // + met a jour le rdv_id.
    estOccupe(date, h) {
        let res = 0; //par défaut créneau vide
        //on parcours tous les docs
        for (let doc of this.allDoctors) {
            //si doc choisi == "Tous" ou du doc actuel on continue
            if (this.selectedDoctorId == "Tous" || doc.id == this.selectedDoctorId) {
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
                    );                    

                        if (mmDate && dateRdv.getHours() == h && app.reserved == true && this.rightSector(doc)) {
                            res = 1;
                        } else if (mmDate && dateRdv.getHours() == h && app.reserved == false && this.rightSector(doc)){
                            res = 2;
                        }
                    }
                }
            }
        }

        return res;
    }

    //TODO : ajouter class 'tool-tip' + ajouter eventlistener(mouseneter/mouseleave) sur CHAQUE cellule.dispo/.occupe 
    //+ CSS
    getDoctorsSlot(date,h){
        //On initialse notre résultat en tant que tableau vide.
        let res = [];
        //On parcours tous les docteurs depuis l'API
        for(let doc of this.allDoctors){
            //si doc choisi == "Tous" ou du doc actuel on continue
            if (this.selectedDoctorId == "Tous" || doc.id == this.selectedDoctorId) {
                if (this.rightSector(doc) && doc.appointments) {
                    //On boucle sur tous les rdv de CE docteur
                    for(let app of doc.appointments){
                        let dateRdv = new Date(app.start);
                        let mmDate = dateRdv.getFullYear() === date.getFullYear()
                        && dateRdv.getMonth() === date.getMonth()
                        && dateRdv.getDate() === date.getDate();
                        if(mmDate && dateRdv.getHours() == h ){
                            //On ajoute a notre liste chaque docteur liée au rdv actuel.
                            res.push({name : doc.name, firstname : doc.firstname, reserved : app.reserved, sector : doc.sector.name, rdv_id : app.id});
                        }
                    }                    
                }
            }
        }
        return res;
    }

    getRdvId(date,h){
        for (let doc of this.allDoctors) {
            //si doc choisi == "Tous" ou du doc actuel on continue
            if (this.selectedDoctorId == "Tous" || doc.id == this.selectedDoctorId) {
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
                    );

                    if (mmDate && dateRdv.getHours() == h && this.rightSector(doc)) {
                        return app.id;
                    }
                    }   
                }
            }
        }
    }

}

customElements.define("planning-component", Planning);