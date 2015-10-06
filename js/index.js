/*  global THREE  */
/*  global CANNON */
'use strict';
// const block  = require('./buildingblock.js');


let world, scene, renderer;
let camera, light, controls;
let ground, groundShape, groundBody, groundMat, groundGeo,
    playerShape, playerBody, playerMat, playerGeo;

const keys = [];

// var buildingShapeArr = [];

const citySizex = Math.random()*5 + 1;
const citySizey = Math.random()*15 + 5;

var cityArray = [];

function initScene() {

  //Create physics world
  world = new CANNON.World();
  world.gravity.set(0, 0, -98);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  //Scene elements
  scene = new THREE.Scene();

  //Add camera
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, 50);

  //Add light sources

  //Add objects here

  //Ground Physics
  groundShape = new CANNON.Plane();
  groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape
  });
  world.addBody(groundBody);

  //Ground Render
  groundMat = new THREE.MeshPhongMaterial({
    color: 0x3D2966,
    side: THREE.Frontside
  });
  groundGeo = new THREE.PlaneGeometry(10000, 10000);
  ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);


  //Player
  playerShape = new CANNON.Box(new CANNON.Vec3(2, 2, 4));
  playerBody = new CANNON.Body({
    mass: 8,
    shape: playerShape
    // fixedRotation: true,
  });
  playerBody.position.set(0, 0, 1000);
  world.addBody(playerBody);

  //Player render
  playerMat = new THREE.MeshPhongMaterial({
    color: 0xFF66cc
  });
  playerGeo = new THREE.BoxGeometry(4, 4, 8);
  playerShape = new THREE.Mesh(playerGeo, playerMat);
  playerShape.castShadow = true;
  playerShape.receiveShadow = true;
  scene.add(playerShape);




  for (var i = 0; i < citySizex; i++) {
    cityArray[i] = [];
    for (var j = 0; j < citySizey; j++) {
      var buildingsX = 2;
      var buildingsY = 2;
      createBuildingBlock(buildingsX, buildingsY, i, j);
      console.log(buildingsX + " " + buildingsY);
    }
  }
  initLighting();
  //Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0000ff, 0.2);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  document.body.appendChild(renderer.domElement);
  //Orbital Controls for camera
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}


function animate() {
  requestAnimationFrame(animate);
  updatePhys();

  const speed = 4;
  if (keys[87]) {
    playerBody.velocity.y += speed;
  }
  if (keys[83]) {
    playerBody.velocity.y -= speed;
  }
  if (keys[68]) {
    playerBody.velocity.x += speed;
  }
  if (keys[65]) {
    playerBody.velocity.x -= speed;
  }
  if (keys[32]) {
    playerBody.velocity.z += 4;
  }

  // console.log(playerBody.position.z);
  // console.log(velocity.x + " " + velocity.y);
  // playerBody.velocity.mult(0.99, playerBody.velocity);
  camera.position.set(playerBody.position.x, playerBody.position.y - 20, playerBody.position.z + 5);
  camera.lookAt(playerBody.position);
  renderer.render(scene, camera);

 }

function updatePhys() {
  world.step(1/60);

  playerShape.position.copy(playerBody.position);
  playerShape.quaternion.copy(playerBody.quaternion);
}

document.addEventListener('keydown', function(event) {
  keys[event.keyCode] = true;
});

document.addEventListener('keyup', function(event) {
  keys[event.keyCode] = false;
});

initScene();
animate();
