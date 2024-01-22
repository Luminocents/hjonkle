//import three js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById("canvas");

//set the canvas background to "Nerd Dog Emoji.png"


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//set the scene background to "Nerd Dog Emoji.png"
const texture = new THREE.TextureLoader().load('Nerd Dog Emoji.png');
scene.background = texture;

/* THIS IS HOW YOU ADD A CUBE AND STUFF, REMEBER THIS
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/

camera.position.z = 5;

const createCube = (geometry, material) => {
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

const setCubeProperties = (cube, cubeSize, cubeX, cubeY) => {
    cube.scale.set(cubeSize, cubeSize, cubeSize);
    cube.position.x = cubeX;
    cube.position.y = cubeY;
}

//Creates the cube materials and geometry
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('doTheGoo.png'), transparent: true });
const material3 = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('Nerd Dog Emoji.png'), transparent: true });

//Meshes the materials and geometry together
const cube = new THREE.Mesh(geometry, material3);
const cube2 = new THREE.Mesh(geometry, material);
const cube3 = new THREE.Mesh(geometry, material);

let cubeX = -2;

//Sets the position of the cubes
let cubeY = 1.5;

//Sets the scale of the cubes for when the page is loaded on a mobile device, and sets the position of the cubes
let smol = false;
const scaley = .5;
let smolL = 0;
let smolR = 0;
let smolY = 0;

let cubeOp = -0.055;
let zoomY = 0.04;
let zoomX = 0.05;
let zoomZ = -0.08;

//Add cubes to scene according to page loaded

if (window.location.pathname == '/index.html') {
	let zoomX = 0.025;

}

let cubeSize = 1;

if (window.innerWidth < 600) {
	smol = true;
	cube.scale.set(scaley, scaley, scaley);
	cube2.scale.set(scaley, scaley, scaley);
	cube3.scale.set(scaley, scaley, scaley);

	cubeSize = .4;
	cubeX = -.5;
	cubeY = 2.5;

	zoomX = 0.02;
	zoomY = 0.07;
	zoomZ = -0.1;
}

switch (window.location.pathname) {
    case '/index.html':
		scene.add(cube);
        setCubeProperties(cube, cubeSize, cubeX, cubeY);
		scene.add(cube2);
        setCubeProperties(cube2, cubeSize, cubeX * -1, cubeY);
        break;
    case '/calc.html':
		scene.add(cube2);
        setCubeProperties(cube2, cubeSize, cubeX, cubeY);
		scene.add(cube3);
        setCubeProperties(cube3, cubeSize, cubeX * -1, cubeY);
        break;
    case '/sett.html':
		scene.add(cube);
        setCubeProperties(cube, cubeSize, cubeX, cubeY);
		scene.add(cube3);
        setCubeProperties(cube3, cubeSize, cubeX * -1, cubeY);
        break;
    default:
        window.location.href = 'index.html';
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

//Creates click listeners for the buttons and sets the variable href to the page associated with the button
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
	//Rotates the cubes
	if (big == true && cubeSize < 1.25 && smol == false) {
        cubeSize += 0.05;
        if (cubes[iterS]) {
            cubes[iterS].scale.set(cubeSize, cubeSize, cubeSize);
        }
    } else if (big == false && cubeSize > 1 && smol == false) {
        cubeSize -= 0.05;
        if (cubes[iterS]) {
            cubes[iterS].scale.set(cubeSize, cubeSize, cubeSize);
        }
    }

	//Zooms in on the cube and fades it out and changes page when process is finished
	if (zoom == true && camera.position.z > cubePos.z) {
		cubes.forEach(cube => {
			cube.material.opacity += cubeOp;
		});
		camera.position.z += zoomZ;
		if (camera.position.y < cubePos.y) {
			camera.position.y += zoomY;
		}
		if (Math.sign(cubePos.x) == -1 && camera.position.x > cubePos.x) {
			camera.position.x += (zoomX * -1);
		} else if (Math.sign(cubePos.x) == 1 && camera.position.x < cubePos.x) {
			camera.position.x += zoomX;
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