//verifie si l'utilisateur est connecte, (doit être executer avec tout autre code quand l'utilisateur arrive sur une page)
check_conn_general();


function check_conn_general(){
    if(!sessionStorage.getItem("user_id") && !sessionStorage.getItem("admin_id" && !sessionStorage.getItem("secretary_id") && !sessionStorage.getItem("doctor_id"))){
        console.log("non connecté, redirection");
        window.location.replace("conn.html");
    } else {
        console.log("connecté");
    }
}