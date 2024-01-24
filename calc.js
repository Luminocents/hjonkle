let clicked = false;
    document.getElementById("buttonOff").addEventListener("click", function () {
        clicked = !clicked;
        if (clicked) {
        document.getElementById("buttonOff").id = "buttonOn"
    } else {
        document.getElementById("buttonOn").id = "buttonOff"
    } 
    });