import "/component/rdv_popup/rdv_popup.js";
import "/component/header/header.js";
import "/component/planning/planning.js"
import "/component/footer/footer.js";

const consutlerRdvButton = document.querySelector(".mesRdv");

consutlerRdvButton.addEventListener("click",()=>{
    window.location.replace("../rdv");
})