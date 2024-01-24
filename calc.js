let dmg = false;

document.getElementById("dmgOff").addEventListener("click", function () {
    dmg = !dmg;
    if (dmg) {
        document.getElementById("dmgOff").id = "dmgOn"
    } else {
        document.getElementById("dmgOn").id = "dmgOff"
    }
});

let scatha = false;

document.getElementById("scathaOff").addEventListener("click", function () {
    scatha = !scatha;
    if (scatha) {
        document.getElementById("scathaOff").id = "scathaOn"
    } else {
        document.getElementById("scathaOn").id = "scathaOff"
    }
});