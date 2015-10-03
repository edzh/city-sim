/*  global THREE  */
/*  global CANNON */
'use strict';
var world, scene, renderer;
var camera, light, controls;
var buildingShape, buildingMat, buildingGeo,
    ground, groundShape, groundBody, groundMat, groundGeo,
    player, playerShape, playerBody, playerMatC, playerGeo;
// var velocity = new CANNON.Vec3();
const keys = [];

// var buildingProp = [];
// var buildingBodyArr = [];
var buildingShapeArr = [];

// var buildingAmountx = 2;
// var buildingAmounty = 3;

var citySizex = 4;
var citySizey = 2;

var cityArray = [];

function initScene() {
  world = new CANNON.World();
  world.gravity.set(0, 0, -98);
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

  //Player
  playerShape = new CANNON.Box(new CANNON.Vec3(2, 2, 4));
  playerBody = new CANNON.Body({
    mass: 8,
    shape: playerShape,
    // fixedRotation: true,
    material: playerMatC
  });
  playerBody.position.set(0, 0, 200);
  world.addBody(playerBody);
// }

// function initThree() {
  //Scene elements
  {
    scene = new THREE.Scene();

    //Add camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight);
    camera.position.set(0, -100, 500);

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
      color: 0x4C3380,
      side: THREE.Frontside
    });
    groundGeo = new THREE.PlaneGeometry(10000, 10000);
    ground = new THREE.Mesh(groundGeo, groundMat);
    // ground.position.z = 5;
    scene.add(ground);
  }

  //Building


  //Player
  playerMatC = new THREE.MeshPhongMaterial({
    color: 0xFF66cc,
  });
  playerGeo = new THREE.BoxGeometry(4, 4, 8);
  playerShape = new THREE.Mesh(playerGeo, playerMatC);
  scene.add(playerShape);

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

    for (var i = 0; i < citySizex; i++) {
      cityArray[i] = [];
      for (var j = 0; j < citySizey; j++) {
        var buildingsX = 3;
        var buildingsY = 5;
        createBuildingBlock(buildingsX, buildingsY, i, j);
      }
    }
  }

  function createBuildingBlock(buildingAmountx, buildingAmounty, blockPosX, blockPosY) {
    var buildingProp = [];
    var buildingBodyArr = [];

    var buildingShape, buildingMat, buildingGeo;

    for (var i = 0; i < buildingAmountx; i++) {
      buildingProp[i] = [];
      buildingBodyArr[i] = [];
      for (var j = 0; j < buildingAmounty; j++) {
        buildingProp[i][j] = new Building(0, 25, 25, Math.random()*75+50);
        buildingShape = new CANNON.Box(new CANNON.Vec3(buildingProp[i][j].x, buildingProp[i][j].y, buildingProp[i][j].z));
        buildingBodyArr[i][j] = new CANNON.Body({
          mass: 0,
          shape: buildingShape,
          position: new CANNON.Vec3(blockPosX * (buildingAmountx * 50 + 25) + (buildingProp[i][j].x * i * 2), blockPosY * (buildingAmounty * 50 + 25) + (buildingProp[i][j].y * j * 2), buildingProp[i][j].z)
        });
        world.addBody(buildingBodyArr[i][j]);

      }
    }

    buildingMat = new THREE.MeshPhongMaterial({
    color: 0x9966FF,
    side: THREE.Frontside
    // wireframe: true
    });

    for (i = 0; i < buildingAmountx; i++) {
      buildingShapeArr[i] = [];
      for (j = 0; j < buildingAmounty; j++) {
        buildingGeo = new THREE.BoxGeometry(buildingProp[i][j].x * 2, buildingProp[i][j].y * 2, buildingProp[i][j].z * 2);
        buildingShapeArr[i][j] = new THREE.Mesh(buildingGeo, buildingMat);
        scene.add(buildingShapeArr[i][j]);
      }
    }
      for ( i = 0; i < buildingAmountx; i++) {
      for ( j = 0; j < buildingAmounty; j++) {
        buildingShapeArr[i][j].position.copy(buildingBodyArr[i][j].position);
        buildingShapeArr[i][j].quaternion.copy(buildingBodyArr[i][j].quaternion);
      }
    }
  }
    // console.log(world.bodies);
    // console.log(scene.children);
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
  if (keys[32] && playerBody.position.z <= 5) {
    playerBody.velocity.z += 24;
  }
  // console.log(playerBody.position.z);
  // console.log(velocity.x + " " + velocity.y);
  // playerBody.velocity.mult(0.99, playerBody.velocity);
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
// initThree();
animate();
