import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


function wait(time) {
	return new Promise( (resolve, _) => {
		setTimeout(resolve, time);
	});
}

function resize() {
	for (let i = 0; i < cars.length; i++) {
		cars[i].domElement.style.width = cars[i].domElementSize.width;
		cars[i].domElement.style.height = cars[i].domElementSize.height;
		cars[i].camera.aspect = cars[i].domElement.clientWidth / cars[i].domElement.clientHeight;
		cars[i].camera.updateProjectionMatrix();
		cars[i].renderer.setSize(cars[i].domElement.clientWidth, cars[i].domElement.clientHeight);
	}
}

function load_model(url) {
	return new Promise ( (resolve, reject) => {
		let loader = new GLTFLoader();
		loader.load(
			url,
			function (gltf) {
				resolve(gltf.scene);
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.error(error);
				reject();
			}
		);
	});
}

let models = [
	"/car-hop/models/mazda/scene.gltf",
	"/car-hop/models/police/scene.gltf"
]

let cars = [];
async function load() {

	window.onresize = resize;
	render();

	for (let i = 0; i < models.length; i++) {
		let canvas = document.getElementById("car" + i);

		let car = {
			domElement: canvas,
			domElementSize: {
				width: canvas.style.width,
				height: canvas.style.height
			},
			scene: new THREE.Scene(),
			camera: new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000),
			renderer: new THREE.WebGLRenderer({
				canvas,
				alpha: true,
				antialias: false
			})
		};

		car.renderer.setPixelRatio(window.devicePixelRatio / 2);
		car.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		car.camera.position.set(0, 2, 3.5);
		car.camera.rotation.set(-0.5, 0, 0);

//		const light = new THREE.AmbientLight(0xffffff, 2);
		
		let light = new THREE.SpotLight(0xffffff, 1);

		light.position.set(1, 3, 3);
		light.target.position.set(0, 1, 0);
		car.scene.add(light);

		light = new THREE.SpotLight(0xffffff, 1);
		light.position.set(-1, 3, 3);
		light.target.position.set(0, 1, 0);
		car.scene.add(light);

		car.object = await load_model(models[i])
		car.object.position.set(0, 0, 0);
		switch (i) {
			case 1:
				car.camera.position.z += 2;
				car.camera.position.y += .5;
				break;
			case 2:
				light.intensity = 2;
				car.camera.position.z += 1;
				car.camera.position.y -= 0.5;
				break;
		}
		car.scene.add(car.object);

		cars.push(car);
		await wait(100);
		await canvas.animate({
			filter: "none"
		},{
			fill: "forwards",
			duration: 1000
		}).finished;

	}
}

function render() {

	requestAnimationFrame(render);
	for (let i = 0; i < cars.length; i++) {
		cars[i].object.rotation.y += 0.007;
		cars[i].renderer.render(cars[i].scene, cars[i].camera);
	}

}

load();
