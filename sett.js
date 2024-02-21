//import three js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById("canvas");


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

/*set the scene background to "Nerd Dog Emoji.png"
const texture = new THREE.TextureLoader().load('Nerd Dog Emoji.png');
scene.background = texture;
*/

// // THIS IS HOW YOU ADD A CUBE AND STUFF, REMEBER THIS
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const geometry = new THREE.PlaneGeometry(1920, 1080, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('static/Nerd Dog Emoji.png'), transparent: true });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);



let sc1 = window.innerWidth / 1920;
let sc2 = window.innerHeight / 1080;

canvas.width = 1920 * sc1;
canvas.height = 1920 * sc1;
renderer.setSize(1920 * sc1, 1920 * sc2);

// Resize on resize
window.addEventListener('resize', () => {
    sc1 = window.innerWidth / 1920;
    sc2 = window.innerHeight / 1080;

    canvas.width = 1920 * sc1;
    canvas.height = 1920 * sc1;
    renderer.setSize(1920 * sc1, 1920 * sc2);

    camera.updateProjectionMatrix();
});



for (let i = 0; i < document.getElementById("hotbar").length; i++) {
    document.getElementById("hotbar")[i].addEventListener("click", () => {
        window.location.href = document.getElementById("hotbar")[i].value + '.html'
    });
}

let key;
let menu = false;

document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented) {
        return;
    }
    key = event.key;

});

document.addEventListener('keyup', function (event) {
    if (event.key == "p" || event.key == "P") {
        menu = !menu
    }
    console.log(event.key)
    if (menu) {
        document.getElementById('hotbar').style.visibility = "visible";
    } else {
        document.getElementById('hotbar').style.visibility = "hidden";
    }
    key = undefined;
});

requestAnimationFrame(anim)
function anim() {

    console.log(key)

    requestAnimationFrame(anim)
}