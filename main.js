// localStorage.role = "teacher";
let elements = document.querySelectorAll('.content');
let signpage = document.getElementById('signpage');
let createuserpage = document.getElementById('createuserpage');
let sendreviewpage = document.getElementById('sendreviewpage');
let sendqupage = document.getElementById('sendqupage');
let sendquizpage = document.getElementById('sendquizpage');
let infopage = document.getElementById('infopage');
let reviewpage = document.getElementById('reviewpage');
let qupage = document.getElementById('qupage');
let quizpage = document.getElementById('quizpage');
let ulfoteacher = document.getElementById('ulfoteacher');
let mainpage = document.getElementById('mainpage');
let adminpage = document.getElementById('adminpage');
let toadminpage = document.getElementById('toadminpage');
let tomainpage = document.getElementById('tomainpage');
if (localStorage.role == "teacher") {
    mainpage.style.display= "block";
    sendreviewpage.style.display= "block";
    ulfoteacher.style.display= "block";
}else if(localStorage.role == "student"){
    mainpage.style.display = "block";
    reviewpage.style.display= "block"
}else if(localStorage.role == "admin"){
    adminpage.style.display= "block";
    toadminpage.style.display= "block";
    sendreviewpage.style.display= "block";
    ulfoteacher.style.display= "block";
}else {
    signpage.style.display = "flex";
}
//==========between admin and user========
tomainpage.addEventListener("click" , () => {
    adminpage.style.display= "none";
    mainpage.style.display= "block"
});
toadminpage.addEventListener("click" , () => {
    adminpage.style.display= "block";
    mainpage.style.display= "none"
});
//=======between sign and create========
document.getElementById('tocreateuserpage').addEventListener("click" , () => {
    signpage.style.display= "none";
    createuserpage.style.display = "flex";
});
document.getElementById('tosignpage').addEventListener("click" , () => {
    signpage.style.display= "flex";
    createuserpage.style.display = "none";
});

//========open menu=====================
let nav = document.querySelector('nav');
document.getElementById('menubutton').addEventListener("click",()=>{
    nav.style.display="block";
});
//========go to any page==========

document.getElementById('tosendreviewpage').addEventListener("click", () => {
    elements.forEach(element => {
        element.style.display= "none";
    });
    nav.style.display= "none";
    sendreviewpage.style.display="block";
})
document.getElementById('tosendqupage').addEventListener("click", () => {
    elements.forEach(element => {
        element.style.display= "none";
    });
    nav.style.display= "none";
    sendqupage.style.display="block";
})
document.getElementById('tosendquizpage').addEventListener("click", () => {
    elements.forEach(element => {
        element.style.display= "none";
    });
    nav.style.display= "none";
    sendquizpage.style.display = 'block';
})
document.getElementById('toinfopage').addEventListener("click", () => {
    elements.forEach(element => {
        element.style.display= "none";
    });
    nav.style.display= "none";
    sendreviewpage.style.display="none";
    infopage.style.display="block";
})
document.getElementById('toreviewpage').addEventListener("click", () => {
    nav.style.display= "none";
    elements.forEach(element => {
        element.style.display= "none";
    });
    reviewpage.style.display="block";
})
document.getElementById('toqupage').addEventListener("click", () => {
    nav.style.display= "none";
    elements.forEach(element => {
        element.style.display= "none";
    });
    qupage.style.display="block";
})
document.getElementById('toquizpage').addEventListener("click", () => {
    nav.style.display= "none";
    elements.forEach(element => {
        element.style.display= "none";
    });
    quizpage.style.display="block"
})


