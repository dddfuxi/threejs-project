import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true; // Enable shadow maps in the renderer
document.body.appendChild( renderer.domElement );

// Add OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Add light
const ambientLight = new THREE.AmbientLight( 0x404040,10); // soft white light
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0xffffff, 100);
pointLight.position.set( 5, 5, 5 );
pointLight.castShadow = true; // Enable shadows for the point light
scene.add( pointLight );

// Load textures
const textureLoader = new TextureLoader();
const colorTexture = textureLoader.load('kache/color1_autosave_0.png');
const normalTexture = textureLoader.load('kache/RGB_1.png');
const roughnessTexture = textureLoader.load('path/to/roughness.png');
const metalnessTexture = textureLoader.load('path/to/metalness.png');

// Load OBJ model
const loader = new OBJLoader();
loader.load('kache/cs_jeepmod.obj', function (obj) {
    obj.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            node.material = new THREE.MeshStandardMaterial({
                map: colorTexture,
                normalMap: normalTexture,
                roughnessMap: roughnessTexture,
                metalnessMap: metalnessTexture,
                roughness: 0.5,
                metalness: 0.5
            });
        }
    });
    scene.add(obj);
}, undefined, function (error) {
    console.error(error);
});

// Add a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry( 10, 10 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x808080 } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = - Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true; // Enable shadow receiving for the plane
scene.add( plane );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true; // Enable shadow casting for the cube
cube.receiveShadow = true; // Enable shadow receiving for the cube
scene.add( cube );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    renderer.render( scene, camera );
}

animate();