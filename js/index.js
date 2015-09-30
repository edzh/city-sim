/*	global THREE	*/
/*	global CANNON	*/
'use strict';
var world, scene, renderer;
var camera, light, controls;
var bldShape,
			ground, groundShape, groundBody, groundMat, groundGeo,
			buildingMat, buildingGeo;

const keys = [];

var buildingProp = [];
var buildingBodyArr = [];
var buildingShapeArr = [];

var buildingAmountx = 3;
var buildingAmounty = 4;

function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0, 0, -50);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	//Add objects here

	//Ground
	{
		groundShape = new CANNON.Plane();
		groundBody = new CANNON.Body({
			mass: 0,
			shape: groundShape
		});
		world.addBody(groundBody);
	}

	//Building
	for (var i = 0; i < buildingAmountx; i++) {
		buildingProp[i] = [];
		buildingBodyArr[i] = [];
		for (var j = 0; j < buildingAmounty; j++) {
			buildingProp[i][j] = new Building(0, 25, 25, Math.random()*50+50);
			bldShape = new CANNON.Box(new CANNON.Vec3(buildingProp[i][j].x, buildingProp[i][j].y, buildingProp[i][j].z));
			buildingBodyArr[i][j] = new CANNON.Body({
				mass: 1,
				shape: bldShape,
				position: new CANNON.Vec3(buildingProp[i][j].x * i * 2, buildingProp[i][j].y * j * 2, buildingProp[i][j].z)
			});
			world.addBody(buildingBodyArr[i][j]);
		}
	}
}

function initThree() {
	//Scene elements
	{
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
	}

	//Ground
	{
		groundMat = new THREE.MeshPhongMaterial({
			color: 0x666666,
			side: THREE.Frontside
		});
		groundGeo = new THREE.PlaneGeometry(1000, 1000);
		ground = new THREE.Mesh(groundGeo, groundMat);
		// ground.position.z = 5;
		scene.add(ground);
	}

	//Building
	buildingMat = new THREE.MeshPhongMaterial({
		color: 0xaaaaaa,
		side: THREE.Frontside,
		wireframe: true
	});
	for (var i = 0; i < buildingAmountx; i++) {
		buildingShapeArr[i] = [];
		for (var j = 0; j < buildingAmounty; j++) {
			buildingGeo = new THREE.BoxGeometry(buildingProp[i][j].x * 2, buildingProp[i][j].y * 2, buildingProp[i][j].z * 2);
			buildingShapeArr[i][j] = new THREE.Mesh(buildingGeo, buildingMat);
			scene.add(buildingShapeArr[i][j]);
		}
	}

	//Renderer
	{
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
		for (var j = 0; j < buildingAmounty; j++) {
			buildingShapeArr[i][j].position.copy(buildingBodyArr[i][j].position);
			buildingShapeArr[i][j].quaternion.copy(buildingBodyArr[i][j].quaternion);
		}
	}
}

initCannon();
initThree();
animate();
