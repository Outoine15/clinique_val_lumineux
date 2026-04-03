import "/component/rdv_popup/rdv_popup.js";
import "/component/header/header.js";
import "/component/planning/planning.js"
import "/component/footer/footer.js";


const rdvButtons = document.querySelectorAll(".btn-rdv");

rdvButtons.forEach(rdvButton => {
    rdvButton.addEventListener("click",()=>{
        window.location.replace("../account");
    })
});

