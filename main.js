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

//Creates the cube materials and geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('doTheGoo.png') });

//Adds the cubes to the scene and positions them
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

let buttons = [];

//On buttons hover
const button = document.getElementById("button");

//Establishes cube rotation speed
let cubeR1 = .0025;
let cubeR2 = .0025;
let cubeR3 = .0025;

//Array of cube rotation speeds and cubes from the scene
let cubeR = [cubeR1, cubeR2, cubeR3];
let cubes = [cube, cube2, cube3];

//Establishes cube scale when the page loads
let cX = 1;
let cY = 1;
let cZ = 1;

//Creates the boolean that determines if the cube can become big or not
let big = false;
let iter = 0


//On button hover makes the cube bigger, rotate faster, and returns the number associated in the array to variable iter
for (let i = 0; i < document.getElementById("hotbar").length; i++) {
	document.getElementById("hotbar")[i].addEventListener("mouseover", () => {
		iter = i;
		cubeR[i] = 0.008;
		big = true;
		return iter;
	});

	document.getElementById("hotbar")[i].addEventListener("mouseout", () => {
		big = false;
		cubeR[i] = 0.0025;
	});

}

/*
cubes[iter].scale.set(cX += 0.05, cY += 0.05, cZ += 0.05);
*/


//Executes every frame
function animate() {
	requestAnimationFrame(animate);
	
	if (big == true && cX < 1.25) {
		cubes[iter].scale.set(cX += 0.05, cY += 0.05, cZ += 0.05);

	} else if (big == false && cX > 1) {
		cubes[iter].scale.set(cX -= 0.05, cY -= 0.05, cZ -= 0.05);
	}

	renderer.render(scene, camera);
	renderer.render(scene, camera);

	//Rotates the cubes depending if the mouse is hovering over the buttons established in above for loop
	cube.rotation.x += cubeR[0];
	cube.rotation.y += cubeR[0];

	cube2.rotation.x -= cubeR[1];
	cube2.rotation.y -= cubeR[1];

	cube3.rotation.x += cubeR[2];
	cube3.rotation.y -= cubeR[2];
}
animate();