import { check_conn_general } from "./connUtils.js";
import { LogoutButton } from "/component/logout/logout.js";

check_conn_general();

async function chargerMedecins() {
    try {
        const response = await fetch('/api/doctors');
        
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


async function decalerRDV(event)
{
    event.preventDefault;
const form = event.target;
    const formData = new FormData(form);
    const rdvId = formData.get('rdv_id');
    const nouvelleDate = formData.get('nouvelle_date');

    if (!nouvelleDate) return;

    const startDate = new Date(nouvelleDate);
    //on met 30 on part du principe qu'un rdv est 30 min
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    const formatSQL = (date) => date.toISOString().slice(0, 19).replace('T', ' ');
    
    const data = new URLSearchParams();
    data.append('time_start', formatSQL(startDate));
    data.append('time_end', formatSQL(endDate));

    try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        const response = await fetch(`/api/appointments/${rdvId}/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data.toString()
        });

        if (response.ok) {
            alert("Rendez-vous déplacé !");
            chargerTableauRDV(); // Rafraîchir l'affichage
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
        const response = await fetch('/api/doctors');
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
                <form class="form-modifier-rdv">
                    <input type="hidden" name="rdv_id" value="${rdv.id}">
                    <input type="datetime-local" name="nouvelle_date" required>
                    <button type="submit">OK</button>
                </form>
                `;

                tr.append(tdMed, tdPat, tdDate, tdAction);
                tbody.appendChild(tr);
            });
        });
    } catch (error) {
        console.error('Erreur chargement tableau:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loggout_bt = new LogoutButton();
    document.body.appendChild(loggout_bt);

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

    const startDate = new Date(startValue);
    const endDate = new Date(startDate.getTime() + 30 * 60000); 

    const formatSQL = (date) => date.toISOString().slice(0, 19).replace('T', ' ');
    const timeStart = formatSQL(startDate);
    const timeEnd = formatSQL(endDate);

    const data = new URLSearchParams();
    data.append('doctor_id', doctorId);
    data.append('time_start', timeStart);
    data.append('time_end', timeEnd);

    try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        
        const response = await fetch('/api/appointments', {
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