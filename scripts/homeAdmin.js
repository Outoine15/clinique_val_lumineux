//on importe la fonction qui verif la connexion avec connUtils
import { check_conn_general } from "./connUtils.js";
//on importe le bouton pour se deconnecter
import { LogoutButton } from "../component/logout/logout.js";
//on imoporte de la fonction qui recupere un cookie par son nom
import { getCookie } from "../scripts/cookiesUtils.js";
//import du header et footer qui est le même sur chaque pages
import "../component/header/header.js";
import "../component/footer/footer.js";

//on verifie que le user est bien connecté a une session et on precise "ADMIN" et pas une autre
check_conn_general("ADMIN");

//fonction qui charge la liste des medecin depuis l'API
async function chargerMedecins() {
    try {
        //on fait un appel GET pour recup tous les medecins
        const response = await fetch('/api/doctors');
        
        //si le GET ne marche pas on recoit une erreur 404 ou 500 
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médecins');
        }

        //sinon on obtient un resultat et on le convertit en tableau json
        const medecins = await response.json();

        //on cherche le select de choix de medecin dans l'html
        const selectMedecin = document.querySelector('select[name="medecin_id"]');
        if (selectMedecin) {
            //permet de remettre a zero le selecteur pour etre sur (avec l'option qui est par defaut)
            selectMedecin.innerHTML = '<option value="">Choisir un médecin</option>';
            //pour chaque medecin on loop
            medecins.forEach(medecin => {
                //on crée un element option ou l"on met son nom prenom et secteur du medecin 
                const option = document.createElement('option');
                option.value = medecin.id; 
                option.textContent = `Dr. ${medecin.name} ${medecin.firstname} (${medecin.sector.name})`;
                //on met le medecin dans le grand tableau ou il y a tous les medecins
                selectMedecin.appendChild(option);
            });
        }

        //on get le tbody du tableau des medecin qui est dans l'html
        const tbodyMedecins = document.getElementById('table-corps-medecins');

        if (tbodyMedecins) {
            tbodyMedecins.innerHTML = '';
            //ppour chaque medecin on crée une ligne 
            medecins.forEach(medecin => {
                const tr = document.createElement('tr');

                const tdId = document.createElement('td');
                tdId.textContent = medecin.id;//id du medecin

                const tdNom = document.createElement('td');
                tdNom.textContent = medecin.name;//nom du medecin

                const tdPrenom = document.createElement('td');
                tdPrenom.textContent = medecin.firstname;//prenom du medecin

                const tdSecteur = document.createElement('td');
                tdSecteur.textContent = medecin.sector.name;//nom du secteur du medecin

                //colonne action avec le bouton qui supprime le medecin
                const tdAction = document.createElement('td');
                const btnSuppr = document.createElement('button');
                btnSuppr.textContent = "Supprimer le médecin";
                //quand on clique on lance la fonction pour le sup av l'id correspondant
                btnSuppr.onclick = () => supprimerMedecin(medecin.id);
                
                tdAction.appendChild(btnSuppr);

                //on ajoute toutes les colonnes a la ligne
                tr.append(tdId, tdNom, tdPrenom, tdSecteur, tdAction);
                
                //et on ajoute la ligne au tableau
                tbodyMedecins.appendChild(tr);
            });
        }

    } catch (error) {
        console.error('Erreur:', error);
    }
}


async function decalerRDV(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const rdvId = formData.get('rdv_id');
    const nouvelleDateStr = formData.get('nouvelle_date');

    const nouv_duration = formData.get('nouvelle_rdv_duration');

    let[hours, mins] = nouv_duration.split(":");
    const total_duration = (mins-0)+((hours-0)*60);

    if (!nouvelleDateStr) return;

    const startDate = new Date(nouvelleDateStr);
    const endDate = new Date(startDate.getTime()+total_duration*60000);

    const formatLocalSQL = (date) => {
    const pad = (n) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
    };
    

    const data = new URLSearchParams();
    data.append('time_start', formatLocalSQL(startDate));
    data.append('time_end', formatLocalSQL(endDate));

    try {
        const token = getCookie("token");

        const response = await fetch(`../api/appointments/${rdvId}/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        if (response.ok) {
            alert("Rendez-vous déplacé !");
            chargerTableauRDV(); 
        } else {
            const error = await response.json();
            alert("Erreur : " + (error.message || "Impossible de modifier"));
        }
    } catch (error) {
        console.error("Erreur modification :", error);
    }
}


async function chargerTableauRDV() {
    try {
        const response = await fetch('../api/doctors');
        if (!response.ok) throw new Error('Erreur API');
        
        const medecins = await response.json();
        const tbody = document.querySelector('table tbody');
        
        tbody.innerHTML = '';

        medecins.forEach(medecin => {
            medecin.appointments.forEach(rdv => {
                const tr = document.createElement('tr');

                const tdMed = document.createElement('td');
                tdMed.textContent = `Dr. ${medecin.name}`;

                const tdPat = document.createElement('td');
                tdPat.textContent = rdv.reserved ? "Occupé" : "Libre"; 

                const tdDate = document.createElement('td');
                tdDate.textContent = rdv.start.replace('T', ' ').slice(0, 16);

                const tdAction = document.createElement('td');
                
                tdAction.innerHTML = `
                <form class="form-modifier-rdv" style="display: inline-block; margin-right: 10px;">
                    <input type="hidden" name="rdv_id" value="${rdv.id}">
                    date:
                    <input type="datetime-local" name="nouvelle_date" required>
                    durée:
                    <input type="time" name="nouvelle_rdv_duration" required>
                    <button type="submit">OK</button>
                </form>
                `;

                const btnSuppr = document.createElement('button');
                btnSuppr.textContent = "Supprimer";
                btnSuppr.style.backgroundColor = "#ff4d4d";
                btnSuppr.style.color = "white";
                btnSuppr.style.border = "none";
                btnSuppr.style.padding = "4px 8px";
                btnSuppr.style.cursor = "pointer";
                btnSuppr.style.borderRadius = "4px";

                btnSuppr.onclick = () => supprimerRDV(rdv.id);

                tdAction.appendChild(btnSuppr);

                tr.append(tdMed, tdPat, tdDate, tdAction);
                tbody.appendChild(tr);
            });
        });

        document.querySelectorAll('.form-modifier-rdv').forEach(form => {
            form.onsubmit = decalerRDV; 
        });

    } catch (error) {
        console.error('Erreur chargement tableau:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loggout_bt = new LogoutButton();
    let loggout_bt_div = document.getElementById("logout-button");
    loggout_bt_div.appendChild(loggout_bt);

    chargerMedecins();
    chargerTableauRDV();
    
    const form = document.getElementById('form-ajout-creneau');
    if (form) {
        form.addEventListener('submit', ajouterCreneau); 
    }
    
    document.querySelector('table tbody').addEventListener('submit', (e) => {
        if (e.target.classList.contains('form-modifier-rdv')) {
            decalerRDV(e);
        }
    });
    document.getElementById('form-ajout-medecin').addEventListener('submit', ajouterMedecin);

});

async function ajouterCreneau(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);
    
    const doctorId = formData.get('medecin_id');
    const startValue = formData.get('date_heure'); 
    const duration = formData.get('rdv_duration');

    const startDate = new Date(startValue);
    let[hours, mins] = duration.split(":");
    const total_duration = (mins-0)+((hours-0)*60);
    const endDate = new Date(startDate.getTime()+total_duration*60000);

    const formatSQL = (date) => {
    const pad = (n) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds());
    };
    const timeStart = formatSQL(startDate);
    const timeEnd = formatSQL(endDate);

    const data = new URLSearchParams();
    data.append('doctor_id', doctorId);
    data.append('time_start', timeStart);
    data.append('time_end', timeEnd);

    try {
        const token = getCookie("token");
        
        const response = await fetch('../api/appointments', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        const result = await response.json();

        if (response.ok) {
            alert("Créneau créé avec succès !");
            form.reset();
            chargerTableauRDV(); 
        } else {
            alert("Erreur : " + (typeof result === 'string' ? result : JSON.stringify(result) || "Requête refusée"));
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur de connexion au serveur");
    }
}
async function supprimerRDV(rdvId) {
    if (!confirm("Supprimer définitivement ce créneau ?")) return;

    const token = getCookie("token");
    
    try {
        const response = await fetch(`../api/appointments/${rdvId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json(); 

        if (response.ok && result.success === true) {
            alert("Rendez-vous supprimé !");
            chargerTableauRDV();
        } else {
            alert("Erreur : Vous n'avez pas les droits ou le RDV n'existe plus.");
            console.log("Détails erreur back-end:", result);
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}


async function ajouterMedecin(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const data = new URLSearchParams();
    data.append('name', formData.get('nom'));
    data.append('firstname', formData.get('prenom'));
    data.append('mail', formData.get('email'));
    data.append('sectorID', formData.get('secteur_id'));
    data.append('password', formData.get('password'));

    try {
        const token = getCookie("token");

        const response = await fetch('../api/doctors', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        const result = await response.json();

        if (response.ok && result.id) {
            alert("Médecin créé avec succès !");
            form.reset();
            if (typeof chargerMedecins === 'function') chargerMedecins(); 
        } else {
            alert("Erreur lors de la création : " + (result.message || "Accès refusé"));
        }
    } catch (error) {
        console.error("Erreur ajout médecin:", error);
        alert("Erreur de connexion au serveur");
    }
}

async function supprimerMedecin(doctorID) {
    if (!confirm("Voulez-vous vraiment supprimer ce médecin ?...")) return;

    try {
        const token = getCookie("token");
        console.log("token :", token); 

        const url = `../api/doctors/${doctorID}`;
        console.log("URL construite :", url); 

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("status reçu :", response.status, response.url); 

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Médecin supprimé.");
            location.reload(); 
        } else {
            alert("Erreur : Impossible de supprimer ce médecin.");
        }
    } catch (error) {
        console.error("Erreur suppression médecin:", error);
    }
}