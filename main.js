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

//hide horizontal scrollbar
document.body.style.overflowX = "hidden";

//Resize the canvas when the window is resized
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});

//Create a function that when called creates various rectangles that slide onto screen



document.getElementById("calc").onclick = function createRectangles() {
	//Create a random number of rectangles
	let numRects = Math.floor(Math.random() * 10) + 1;
	//Create a random color for the rectangles
	let color = Math.random() * 0xffffff;
	//Create a random size for the rectangles
	let size = Math.random() * 5;
	//Create a random position for the rectangles
	let position = Math.random() * 10;

	for (let i = 0; i < numRects; i++) {
		//Create a rectangle
		const geometry = new THREE.BoxGeometry(size, size, size);
		const material = new THREE.MeshBasicMaterial({ color: color });
		const rectangle = new THREE.Mesh(geometry, material);
		//Add the rectangle to the scene
		scene.add(rectangle);
		//Set the position of the rectangle
		rectangle.position.x = position;
		rectangle.position.y = position;
		rectangle.position.z = position;
	}
};




function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();