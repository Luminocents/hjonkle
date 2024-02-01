let dmg = false;
const buttons = document.querySelectorAll("button");

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
        document.getElementById("scathaOff").id = "scathaOn"
    } else {
        document.getElementById("scathaOn").id = "scathaOff"
    }
});