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

//appelle la fonction au chargement de la page
window.addEventListener('DOMContentLoaded', chargerMedecins);

