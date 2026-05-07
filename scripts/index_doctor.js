import "../component/header/header.js";
import "../component/footer/footer.js";

import { LogoutButton } from "../component/logout/logout.js";

let loggout_bt = new LogoutButton();
let loggout_bt_placement = document.getElementById("logout-button");
loggout_bt_placement.appendChild(loggout_bt)
