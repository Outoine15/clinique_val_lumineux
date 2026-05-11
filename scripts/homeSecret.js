import { check_conn_general } from "../scripts/connUtils.js";
import { LogoutButton } from "../component/logout/logout.js";
import { getCookie } from "../scripts/cookiesUtils.js";
import "../component/header/header.js";
import "../component/footer/footer.js";



check_conn_general("SECRETARY");


async function chargerMedecins() {
    try {
        const response = await fetch('../api/doctors');
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médecins');
        }

        const medecins = await response.json();

        const selectMedecin = document.querySelector('select[name="medecin_id"]');

        medecins.forEach(medecin => {
            const option = document.createElement('option');
            option.value = medecin.id; 
            option.textContent = `Dr. ${medecin.name} ${medecin.firstname} (${medecin.sector.name})`;
            selectMedecin.appendChild(option);
        });

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