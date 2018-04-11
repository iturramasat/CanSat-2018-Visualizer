var satMesh;
let pitch = 0;
let roll = 0;
let yaw = 0;

			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container, stats;

			var camera, cameraTarget, scene, renderer;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
				camera.position.set( 3, 0.15, 3 );

				cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x72645b );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 );


				// Ground

				var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40 ),
					new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
				);
				plane.rotation.x = -Math.PI/2;
				plane.position.y = -0.5;
				scene.add( plane );

				plane.receiveShadow = true;


				// ASCII file

				var loader = new THREE.STLLoader();
				loader.load( './can.stl', function ( geometry ) {

					var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
				 	satMesh = new THREE.Mesh( geometry, material );

					satMesh.position.set( 0, 0, 0 );
					satMesh.rotation.set( 0, - Math.PI / 2, 0 );
					satMesh.scale.set( 0.05, 0.05, 0.05 );

					satMesh.castShadow = true;
					satMesh.receiveShadow = true;

					scene.add( satMesh );

				} );


				// Binary files

				var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

				/*loader.load( './models/stl/binary/pr2_head_pan.stl', function ( geometry ) {

					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.set( 0, - 0.37, - 0.6 );
					mesh.rotation.set( - Math.PI / 2, 0, 0 );
					mesh.scale.set( 2, 2, 2 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );

				} );

				loader.load( './models/stl/binary/pr2_head_tilt.stl', function ( geometry ) {

					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.set( 0.136, - 0.37, - 0.6 );
					mesh.rotation.set( - Math.PI / 2, 0.3, 0 );
					mesh.scale.set( 2, 2, 2 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );

				} );
*/
				// Colored binary STL
	/*			loader.load( 'can.stl', function ( geometry ) {

					var meshMaterial = material;
					if (geometry.hasColors) {
						meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
					}

					satMesh = new THREE.Mesh( geometry, meshMaterial );

					satMesh.position.set(0, 0.0, 0 );
					satMesh.rotation.set( - Math.PI / 2, Math.PI / 2, 0 );
					satMesh.scale.set( 0.05, 0.01, 0.01 );

					satMesh.castShadow = true;
					satMesh.receiveShadow = true;

					scene.add( satMesh );

				} );

*/
				// Lights

				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

				addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
				addShadowedLight( 0.5, 1, -1, 0xFFFFFF, 1 );
				// renderer

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				renderer.shadowMap.enabled = true;

				container.appendChild( renderer.domElement );

				// stats
/*
				stats = new Stats();
				container.appendChild( stats.dom );
*/
				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function addShadowedLight( x, y, z, color, intensity ) {

				var directionalLight = new THREE.DirectionalLight( color, intensity );
				directionalLight.position.set( x, y, z );
				scene.add( directionalLight );

				directionalLight.castShadow = true;

				var d = 1;
				directionalLight.shadow.camera.left = -d;
				directionalLight.shadow.camera.right = d;
				directionalLight.shadow.camera.top = d;
				directionalLight.shadow.camera.bottom = -d;

				directionalLight.shadow.camera.near = 1;
				directionalLight.shadow.camera.far = 4;

				directionalLight.shadow.mapSize.width = 1024;
				directionalLight.shadow.mapSize.height = 1024;

				directionalLight.shadow.bias = -0.002;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
				//stats.update();

			}

			function render() {

				var timer = 5;

				camera.position.x = Math.cos( timer ) * 3;
				camera.position.z = Math.sin( timer ) * 3;

				camera.lookAt( cameraTarget );
				if(typeof satMesh != "undefined"){
					satMesh.rotation.set( pitch / 180 * Math.PI,  yaw / 180 * Math.PI, roll / 180 * Math.PI);
					//scene.add( satMesh );

				}
				renderer.render( scene, camera );

			}

      $(function () {
        //var database = firebase.database();
        //let baseUrl = 'sats/' + localStorage.sat + "/";
				var socket = io(socketServer[localStorage.sat]);

				socket.on("pitch", function (value) {
					pitch = value;
				});

				socket.on("roll", function (value) {
					roll = value;
				})
				socket.on("yaw", function (value) {
					yaw = value;
				})
        /*database.ref(baseUrl + "pitch").on('value', function (snapshot) {
          pitch = snapshot.val().value;
        });
        database.ref(baseUrl + "roll").on('value', function (snapshot) {
          roll = snapshot.val().value;
        });*/


      })
