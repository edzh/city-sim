/*  global THREE  */
/*  global CANNON */
'use strict';

function createBuildingBlock(buildingAmountx, buildingAmounty, blockPosX, blockPosY) {

const buildingShapeArr = [];
const buildingHeight = [];
const buildingBodyArr = [];

let buildingShape, buildingMat, buildingGeo;

const buildingSizex = 200;
const buildingSizey = 200;

const roadSize = 300;
let sidewalkShape, sidewalkMat, sidewalkGeo, sidewalkBody, sidewalk;
const sidewalkSizex = buildingSizex * buildingAmountx * 1.125;
const sidewalkSizey = buildingSizey * buildingAmounty * 1.125;

    //Create building physics
  for (var i = 0; i < buildingAmountx; i++) {
    buildingHeight[i] = [];
    buildingBodyArr[i] = [];
    for (var j = 0; j < buildingAmounty; j++) {
      buildingHeight[i][j] = Math.random()*400+100;
      buildingShape = new CANNON.Box(new CANNON.Vec3(buildingSizex, buildingSizey, buildingHeight[i][j]));
      buildingBodyArr[i][j] = new CANNON.Body({
        mass: 0,
        shape: buildingShape,
        position: new CANNON.Vec3(
          blockPosX * (buildingAmountx * buildingSizex * 2 + roadSize) + (buildingSizex * i * 2),
          blockPosY * (buildingAmounty * buildingSizey * 2 + roadSize) + (buildingSizey * j * 2),
          buildingHeight[i][j]
        )
      });
      world.addBody(buildingBodyArr[i][j]);
    }
  }


  //Building render
  buildingMat = new THREE.MeshPhongMaterial({
    color: 0x9966FF
  });

  for (i = 0; i < buildingAmountx; i++) {
    buildingShapeArr[i] = [];
    for (j = 0; j < buildingAmounty; j++) {
      buildingGeo = new THREE.BoxGeometry(buildingSizex * 2, buildingSizey * 2, buildingHeight[i][j] * 2);
      buildingShapeArr[i][j] = new THREE.Mesh(buildingGeo, buildingMat);
      buildingShapeArr[i][j].castShadow = true;
      buildingShapeArr[i][j].receiveShadow = true;

      scene.add(buildingShapeArr[i][j]);
    }
  }

  for ( i = 0; i < buildingAmountx; i++) {
    for ( j = 0; j < buildingAmounty; j++) {
      buildingShapeArr[i][j].position.copy(buildingBodyArr[i][j].position);
      buildingShapeArr[i][j].quaternion.copy(buildingBodyArr[i][j].quaternion);
    }
  }

  //Sidewalk physics
  sidewalkShape = new CANNON.Box(new CANNON.Vec3(sidewalkSizex, sidewalkSizey, 1));
  sidewalkBody = new CANNON.Body({
    mass: 0,
    shape: sidewalkShape,
    position: new CANNON.Vec3(blockPosX * (2 * buildingSizex * buildingAmountx + roadSize) + buildingSizex, blockPosY * (2 * buildingSizey * buildingAmounty + roadSize) + buildingSizey, 1)
  });
  world.addBody(sidewalkBody);

  //Sidewalk render
  sidewalkMat = new THREE.MeshPhongMaterial({
    color: 0x8A5CE6
  });
  sidewalkGeo = new THREE.BoxGeometry(sidewalkSizex * 2, sidewalkSizey * 2, 2);
  sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalk.receiveShadow = true;
  scene.add(sidewalk);
  sidewalk.position.copy(sidewalkBody.position);
  sidewalk.quaternion.copy(sidewalkBody.quaternion);
}
