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
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('doTheGoo.png'), transparent: true });

//Meshes the materials and geometry together
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);
const cube3 = new THREE.Mesh(geometry, material);

//Sets the position of the cubes
const cubeY = 1.5;
const cubeXL = -2;
const cubeXR = 2;

//Add cubes to scene according to page loaded
if (window.location.pathname == '/index.html') {
	scene.add(cube);
	cube.position.x = cubeXL;
	cube.position.y = cubeY;

	scene.add(cube2);
	cube2.position.x = cubeXR;
	cube2.position.y = cubeY;

} else if (window.location.pathname == '/calc.html') {
	scene.add(cube2);
	cube2.position.x = cubeXL;
	cube2.position.y = cubeY;
	
	scene.add(cube3);
	cube3.position.x = cubeXR;
	cube3.position.y = cubeY;
} else if (window.location.pathname == '/sett.html') {
	scene.add(cube);
	cube.position.x = cubeXL;
	cube.position.y = cubeY;

	scene.add(cube3);
	cube3.position.x = cubeXR;
	cube3.position.y = cubeY;
}


//hide horizontal scrollbar
document.body.style.overflowX = "hidden";

//Resize the canvas when the window is resized
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});




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
let iterS;


//On button hover makes the cube bigger, rotate faster, and returns the number associated in the array to variable iterS
for (let i = 0; i < document.getElementById("hotbar").length; i++) {
	document.getElementById("hotbar")[i].addEventListener("mouseover", () => {
		iterS = i;
		cubeR[i] = 0.008;
		big = true;
		return iterS;
	});

	document.getElementById("hotbar")[i].addEventListener("mouseout", () => {
		big = false;
		cubeR[i] = 0.0025;
	});

}

/*
cubes[iterS].scale.set(cX += 0.05, cY += 0.05, cZ += 0.05);
*/

let zoom = false;
let cubePos;
let iter;
let href = 'index.html';

for (let i = 0; i < document.getElementById("hotbar").length; i++) {
	document.getElementById("hotbar")[i].addEventListener("click", () => {
		href = document.getElementById("hotbar")[i].value + '.html'
		cubePos = cubes[i].position;
		zoom = true;
		iter = i;
		return iter;
	});

}


//Executes every frame
function animate() {
	requestAnimationFrame(animate);

	if (big == true && cX < 1.25) {
		cubes[iterS].scale.set(cX += 0.05, cY += 0.05, cZ += 0.05);

	} else if (big == false && cX > 1) {
		cubes[iterS].scale.set(cX -= 0.05, cY -= 0.05, cZ -= 0.05);
	}

	if (zoom == true && camera.position.z > cubePos.z) {
		cube.material.opacity -= .03;
		camera.position.z -= 0.08;
		if (camera.position.y < cubePos.y) {
			camera.position.y += 0.038;
		}
		if (Math.sign(cubePos.x) == -1 && camera.position.x > cubePos.x) {
			camera.position.x -= 0.06;
		} else if (Math.sign(cubePos.x) == 1 && camera.position.x < cubePos.x) {
			camera.position.x += 0.06;
		}
	} else if (zoom == true) {
		window.location.href = href ? href : 'index.html';
		zoom = false;
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