import "../component/rdv_popup/rdv_popup.js";
import "../component/header/header.js";
import "../component/planning/planning.js"
import "../component/footer/footer.js";
import { isEmptyObject } from "./codeUtils.js";


const rdvButtons = document.querySelectorAll(".btn-rdv");

rdvButtons.forEach(rdvButton => {
    rdvButton.addEventListener("click",()=>{
        window.location.replace("../calendar");
    })
});


axios.get("../api/doctors").then(response => {
    var res = response.data;
    var doctorNb = 0;
    var domainNb = 0;

    if(!isEmptyObject(res)) {
        var seenDomains = [];
        for(var i = 0 ; i < res.length ; i++) {
            doctorNb++;
            if(!seenDomains.includes(res[i]["sector"]["id"])) {
                seenDomains.push(res[i]["sector"]["id"]);
                domainNb++;
            }
        }
        var doctorInfo = document.getElementById("nb-doc");
        doctorInfo.innerText = doctorInfo.innerText.replace("X", doctorNb);
        var domainInfo = document.getElementById("nb-dom");
        domainInfo.innerText = domainInfo.innerText.replace("X", domainNb);
    }
});


console.log(document.getElementById("nb-doc").innerText);