/*  global THREE  */
/*  global CANNON */
'use strict';

function initLighting() {
  // const directLight = new THREE.DirectionalLight(0xffffff, 0.7);

  // directLight.position.set(50, 50, 400);
  // directLight.castShadow = true;

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-500, -500, 5000);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;

  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;

  scene.add( spotLight );
  light = new THREE.AmbientLight(0x222222);
  // scene.add(directLight);
  scene.add(light);
}
