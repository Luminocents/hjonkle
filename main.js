//import three js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* THIS IS HOW YOU ADD A CUBE AND STUFF, REMEBER THIS
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/

camera.position.z = 5;

//Creates the cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('doTheGoo.png')});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.x = -3;
cube.position.y = 2;

const cube2 = new THREE.Mesh(geometry, material);
scene.add(cube2);
cube2.position.x = 0;
cube2.position.y = 2;

const cube3 = new THREE.Mesh(geometry, material);
scene.add(cube3);
cube3.position.x = 3;
cube3.position.y = 2;

//hide horizontal scrollbar
document.body.style.overflowX = "hidden";

//Resize the canvas when the window is resized
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});

let cubeR = 0.02;
let cubeR2 = 0.02;
let cubeR3 = 0.02;

//On buttons hover
const button = document.getElementsByClassName("button")[0];

button.addEventListener("mouseover", () => {
	console.log("Hey")
	cubeR = 0.01;
})
button.addEventListener("mouseout", () => {
	console.log("Hey")
	cubeR = 0.02;
})

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	renderer.render(scene, camera);
	cube.rotation.x += cubeR;
	cube.rotation.y += cubeR;

	cube2.rotation.x -= cubeR2;
	cube2.rotation.y -= cubeR2;

	cube3.rotation.x += cubeR3;
	cube3.rotation.y -= cubeR3;
}
animate();