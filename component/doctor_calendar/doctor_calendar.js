const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

class AppointmentTime extends HTMLElement {
    constructor(startHours, startMinutes, endHours, endMinutes) {
        super();
        this.innerHTML = `
        <div class="appointmentTime">
            <p>${startHours}:${startMinutes} - ${endHours}:${endMinutes}</p>
        </div>
        `;
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
                new AppointmentTime(startDate.getHours(), startDate.getMinutes(), endDate.getHours(), endDate.getMinutes())
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