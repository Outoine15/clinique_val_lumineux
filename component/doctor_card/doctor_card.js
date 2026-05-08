await import(import.meta.url.replaceAll("doctor_card", "doctor_calendar"));

const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

export class DoctorCard extends HTMLElement {
    doctorData;
    userType;

    constructor(data,user_type) {
        // création depuis le HTML: <doctor-card data="{ ... }"></doctor-card>
        // création depuis le JS: new DoctorCard(dataJSON)
        // les data sont sous la même forme que ce que l'API fournit lorsqu'on demande un médecin
        super();
        this.userType = user_type;

        if(!data) {
            var dataByAttribute = this.getAttribute("data");
            data = dataByAttribute ? JSON.parse(dataByAttribute) : {};
        }

        this.setAttribute("doctor-id", data["id"]||0);
        if(this.userType=="DOCTOR"){
        this.innerHTML = `
        <div class="doctorCard">
            <section class="doctorCardInfo">
                <p class="doctorCardName">vos rendez-vous</p>
            </section>
            <section class="doctorCardAppointments fade">
                <doctor-calendar></doctor-calendar>
            </section>
        </div>
        `;
        } else {
        this.innerHTML = `
        <div class="doctorCard">
            <section class="doctorCardInfo">
                <p class="doctorCardName">Dr ${data["name"]||"Nom"} ${data["firstname"]||"Prénom"}</p>
                <a class="doctorCardJob" href="/sector/${data["sector"] ? data["sector"]["id"]||0 : 0}">
                    ${data["sector"] ? data["sector"]["job_name"] : "Job"}
                </a>
            </section>
            <section class="doctorCardAppointments fade">
                <doctor-calendar></doctor-calendar>
            </section>
        </div>
        `;
        }

        this.doctorData = data;
    }

    connectedCallback() {
        var calendar = this.querySelector("doctor-calendar");
        calendar.setAppointments(this.doctorData["appointments"]||[],this.userType);
    }
}

customElements.define("doctor-card", DoctorCard);