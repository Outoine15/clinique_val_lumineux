import { RdvPopup } from "../component/rdv_popup/rdv_popup.js";

const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

class AppointmentTime extends HTMLElement {
    constructor(data) {
        super();
        this.data = data||{};
        this.show();
    }

    show() {
        var startTime = new Date(this.data["start"]||"1");
        var endTime = new Date(this.data["end"]||"2");

        var startHours = startTime.getHours();
        var startMinutes = startTime.getMinutes();
        var endHours = endTime.getHours();
        var endMinutes = endTime.getMinutes();

        this.innerHTML = `
        <div class="appointmentTime ${this.data["reserved"] ? "reserved" : ""}">
            <p>${startHours}:${startMinutes} - ${endHours}:${endMinutes}</p>
        </div>`;
        let reserve_appointment = this.querySelector(".appointmentTime");
        reserve_appointment.addEventListener("click", (event) => {
            let rdv_selection = new RdvPopup(this.data["id"]);
            document.body.appendChild(rdv_selection);
            });
    }
    
    connectCallback() {
        this.show();
    }

    setData(data) {
        this.data = data;
        this.show();
    }
}

customElements.define("appointment-time", AppointmentTime);

class DayAppointmentsContainer extends HTMLElement {
    constructor(dayName, day, monthName) {
        super();
        this.innerHTML = `
        <div class="dayAppointmentsContainer">
            <section class="dayAppointmentsContainerInfo">
                <p class="dayAppointmentsContainerName">${dayName}</p>
                <p class="dayAppointmentsContainerDayMonth">${day} ${monthName}</p>
            </section>

            <section class="dayAppointmentsContainerDates"> </section>
        </div>
        `;
    }

    addAppointment(app) {
        this.querySelector(".dayAppointmentsContainerDates").appendChild(app);
    }
}

customElements.define("day-appointments-containers", DayAppointmentsContainer);

export class DoctorCalendar extends HTMLElement {
    appointments;

    constructor() {
        super();
        
        this.appointments = [];

        this.innerHTML = `<div class="doctorCalendar"></div>`;
    }

    
    loadAppointments() {
        var calendar = this.querySelector(".doctorCalendar");
        calendar.innerHTML = "";

        var currentDate = undefined;
        var dayContainer = undefined;
        this.appointments.sort((a,b) => b["start"] < a["start"]).forEach(appointment => {
            var startDate = new Date(appointment["start"]);
            var endDate = new Date(appointment["end"]);

            if(currentDate != startDate.toLocaleDateString("fr-FR", {dateStyle:"medium"})) {
                if(dayContainer) {
                    calendar.appendChild(dayContainer);
                }
                currentDate = startDate.toLocaleDateString("fr-FR", {dateStyle:"medium"});
                dayContainer = new DayAppointmentsContainer(
                    startDate.toLocaleDateString("fr-FR", {weekday: "long"}),
                    startDate.getDate(),
                    startDate.toLocaleDateString("fr-FR", {month: "long"})
                );
            }

            dayContainer.addAppointment(
                new AppointmentTime(appointment)
            );
        });

        if(dayContainer) calendar.appendChild(dayContainer);
    }

    setAppointments(appointments) {
        this.appointments = appointments;
        this.loadAppointments();
    }
}

customElements.define("doctor-calendar", DoctorCalendar);