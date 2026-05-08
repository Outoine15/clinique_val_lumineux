const { RdvEditPopup } = await import(import.meta.url.replaceAll("doctor_calendar","rdv_edit_popup"));
const { RdvPopup } = await import(import.meta.url.replaceAll("doctor_calendar","rdv_popup"));

const cssLink = document.createElement("link");
cssLink.setAttribute("rel", "stylesheet");
cssLink.setAttribute("href", import.meta.url.replace(".js", ".css"));
document.head.appendChild(cssLink);

const popup_div = document.querySelector(".rdv-popup-window");

class AppointmentTime extends HTMLElement {

    constructor() {
        super();
        this.data = {};
    }

    show() {
        var startTime = new Date(this.data["start"]||"1");
        var endTime = new Date(this.data["end"]||"2");

        var startHours = startTime.getHours();
        var startMinutes = startTime.getMinutes();
        var endHours = endTime.getHours();
        var endMinutes = endTime.getMinutes();
        const formatTime = (date) =>
            date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit"
            });

        this.innerHTML = `
        <div class="appointmentTime ${this.data["reserved"] ? "reserved" : ""} ${this.userType === "DOCTOR" ? "doctor" : ""}">
            <p>${formatTime(startTime)} - ${formatTime(endTime)}</p>
        </div>`;
        if(this.userType=="DOCTOR"){
            let edit_appointment = this.querySelector(".appointmentTime");
            edit_appointment.addEventListener("click", (event) => {
                let rdv_selection = new RdvEditPopup(this.data["id"],edit_appointment);
                popup_div.appendChild(rdv_selection);
                });

        } else {
            let reserve_appointment = this.querySelector(".appointmentTime");
            reserve_appointment.addEventListener("click", (event) => {
                let rdv_selection = new RdvPopup(this.data["id"],reserve_appointment);
                popup_div.appendChild(rdv_selection);
                });
        }
    }
    
    setData(data, userType) {
        this.data = data;
        this.userType = userType;
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
    roleType;

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

            const appElement = document.createElement("appointment-time");
            appElement.setData(appointment,this.roleType);

            dayContainer.addAppointment(appElement);
        });

        if(dayContainer) calendar.appendChild(dayContainer);
    }

    setAppointments(appointments,role_type) {
        this.appointments = appointments;
        this.roleType=role_type;
        this.loadAppointments();
    }
}

customElements.define("doctor-calendar", DoctorCalendar);