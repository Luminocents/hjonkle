let dmg = false;
const buttons = document.querySelectorAll("button");

let scathaPanel = document.getElementById("scathaPanel");
let menuPanel = document.getElementById("menuPanel");


function butOff() {
    buttons.forEach(button => {
        if (button.id.endsWith("On")) {
            button.id = button.id.slice(0, -2) + "Off";
            scatha = false;
            dmg = false;
        }
    });
}



document.getElementById("dmgOff").addEventListener("click", function () {
    if (scatha) {
        butOff();
    }
    dmg = !dmg;
    if (dmg) {
        menuPanel.style.visibility = "visible";
        document.getElementById("dmgOff").id = "dmgOn"
    } else {
        document.getElementById("dmgOn").id = "dmgOff"
    }
});

let scatha = false;

document.getElementById("scathaOff").addEventListener("click", function () {
    if (dmg) {
        butOff();
    }
    scatha = !scatha;
    if (scatha) {
        scathaPanel.style.visibility = "visible";
        document.getElementById("scathaOff").id = "scathaOn"
    } else {
        document.getElementById("scathaOn").id = "scathaOff"
    }
});

const dForm = document.getElementById("dmgForm")

document.getElementById("dmgCalc").onclick = function () {
    document.getElementById("dmgSub").click();
};

dForm.elements[4].addEventListener("change", function () {
    let ench = dForm.elements[4].value;
    switch (ench) {
        case "none":
            dForm.elements[5].placeholder = "None";
            document.getElementById("encText").innerHTML = "No Enchant lvl";
            break;
        default:
            dForm.elements[5].placeholder = "Enchant lvl";
            document.getElementById("encText").innerHTML = "Enchant lvl";
            break;
    }
});

dForm.addEventListener("submit", function (event) {
    dForm.reset();
    dForm.elements[5].placeholder = "None";
    document.getElementById("encText").innerHTML = "No Enchant";
});



const sForm = document.getElementById("scathaForm");

document.getElementById("scathaCalc").onclick = function () {
    document.getElementById("scathaSub").click();

};

sForm.addEventListener("submit", function (event) {
    let rares = sForm.elements[0].value;
    
    switch (rares) {
        case "0":
            rares = 0.24;
            break;
        case "1":
            rares = 0.12;
            break;
        case "2":
            rares = 0.04;
            break;
        default:
            // Handle other cases if needed
            break;
    }

    console.log("Submitted");
    sForm.reset();
});
