var scene, camera, renderer, dae, loader;

$(function () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer({
    alpha: true // remove canvas' bg color
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  loader = new THREE.STLLoader(); // loader
  loader.load('./can.stl', loadCollada);
});

function loadCollada(collada) {
  dae = collada;
  scene.add(dae);
}
