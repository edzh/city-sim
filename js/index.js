/*	global THREE	*/
/*	global CANNON	*/
'use strict';
var world, scene, renderer;
var camera, light, controls;
var bldShape, bldBody,
			ground, groundShape, groundBody, groundMat, groundGeo,
			buildingMat, buildingGeo;

const keys = [];

var buildingProp = [];
var xbuildingBodyArr = [];
var ybuildingBodyArr = [];
var xbuildingShapeArr = [];
var ybuildingShapeArr = [];

var buildingAmountx = 4;
var buildingAmounty = 2;

function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0, 0, -50);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	//Add objects here

	//Ground
	groundShape = new CANNON.Plane();
	groundBody = new CANNON.Body({
		mass: 0,
		shape: groundShape
	});
	world.addBody(groundBody);

	//Building
	for (var i = 0; i < buildingAmountx; i++) {
		buildingProp[i] = new Building(0, 25, 25, Math.random()*50+50);
		bldShape = new CANNON.Box(new CANNON.Vec3(
			buildingProp[i].x,
			buildingProp[i].y,
			buildingProp[i].z
		));
		xbuildingBodyArr[i] = new CANNON.Body({
			mass: 1,
			shape: bldShape,
			position: new CANNON.Vec3(2*i*buildingProp[i].x, 0, buildingProp[i].z)
		});
		world.addBody(xbuildingBodyArr[i]);
	}
}

function initThree() {
	scene = new THREE.Scene();

	//Add camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
	camera.position.set(0, -100, 100);

	//Add light sources
	const directLight = new THREE.DirectionalLight(0xffffff, 0.7);
	directLight.position.set(50, 50, 400);
	light = new THREE.AmbientLight(0xaaaaaa);
	scene.add(directLight);
	scene.add(light);

	//Ground
	groundMat = new THREE.MeshPhongMaterial({
		color: 0x666666,
		side: THREE.Frontside
	});
	groundGeo = new THREE.PlaneGeometry(1000, 1000);
	ground = new THREE.Mesh(groundGeo, groundMat);
	// ground.position.z = 5;
	scene.add(ground);

	//Building
		buildingMat = new THREE.MeshPhongMaterial({
			color: 0xaaaaaa,
			side: THREE.Frontside,
			wireframe: true
		});
	for (var i = 0; i < buildingAmountx; i++) {
		buildingGeo = new THREE.BoxGeometry(
			2*buildingProp[i].x,
			2*buildingProp[i].y,
			2*buildingProp[i].z
		);
		xbuildingShapeArr[i] = new THREE.Mesh(buildingGeo, buildingMat);
		scene.add(xbuildingShapeArr[i]);
	}
	//Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x0000ff, 0.2);
	document.body.appendChild(renderer.domElement);

	//Orbital Controls for camera
	controls = new THREE.OrbitControls(camera, renderer.domElement);

	// console.log(world.bodies);
	// console.log(scene.children);
}

function animate() {
	requestAnimationFrame(animate);
	updatePhys();

	renderer.render(scene, camera);
}

function updatePhys() {
	world.step(1/60);

	// for (var i = 0; i < buildingAmountx; i++) {
	// 	scene.getObjectById
	// }
	for (var i = 0; i < buildingAmountx; i++) {
		xbuildingShapeArr[i].position.copy(xbuildingBodyArr[i].position);
		xbuildingShapeArr[i].quaternion.copy(xbuildingBodyArr[i].quaternion);
	}
}

initCannon();
initThree();
animate();
