import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { threshold } from 'three/webgpu';



const visibleHeightAtZDepth = (depth, camera) => {
    // camera not at z
    const cameraOffset = camera.position.z;
    if(depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    //vertical fov in radians
    const vFov = camera.fov * Math.PI / 180;

    return 2 * Math.abs(depth) * Math.tan(vFov/2);
};

const visibleWidthAtZDepth = (depth, camera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};



const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);
camera.position.z = 100;
camera.lookAt(0, 0, 0);

window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    //reset walls 
    worldWidth = visibleWidthAtZDepth(0, camera);
    worldHeight = visibleHeightAtZDepth(0, camera);
    wall.position.x += worldWidth/2 ;
    wall2.position.x -= worldWidth/2 ;
});

let clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );

let worldWidth = visibleWidthAtZDepth(0, camera);
let worldHeight = visibleHeightAtZDepth(0, camera);

const mass1_slider = document.getElementById('mass1');
const mass2_slider = document.getElementById('mass2');
//const scaleSlider = document.getElementById('scale');

let v = 50;
let v2 = -50;

let m1 = 1;
let m2 = 1000;
// make cart
const cartWidth = 5;
const cartHeight = 5;
const cartGeometry = new THREE.PlaneGeometry(cartWidth, cartHeight);
const material = new THREE.MeshBasicMaterial({color: 0xb07021});
const material2 = new THREE.MeshBasicMaterial({color: 0x000000});
const cart = new THREE.Mesh(cartGeometry, material);
cart.position.x += cartWidth/2 + .2;
scene.add( cart );
const cart2 = new THREE.Mesh(cartGeometry, material2);
cart2.position.x -= cartWidth/2 + .2;
scene.add( cart2 );

// make floor 
const floorWidth = window.innerWidth;
const floorHeight = window.innerHeight/2;
const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorHeight);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0x363331});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y -= floorHeight/2 + cartHeight/2 ;
scene.add( floor );


// make wall 
const wallWidth = 20;
const wallHeight = window.innerHeight;
const wallGeometry = new THREE.PlaneGeometry(wallWidth, wallHeight);
const wallMaterial = new THREE.MeshBasicMaterial({color: 0x363331});
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
console.log(window.innerWidth);
wall.position.x += worldWidth/2 ;
scene.add( wall);

// make wall 

const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
console.log(window.innerWidth);
wallLeft.position.x -= worldWidth/2 ;
scene.add( wallLeft);


function resolveCartCollision(cart1, cart2){
    const denominator = m1 + m2;
    const numarator = (2 * m1 * v) + (m2 * v2) - (m1 * v2);
    const v2_f = numarator/denominator;
    const v1_f = ((m1 * v) + (m2 * v2) - (m2 * v2_f))/m1;

    v = v1_f;
    v2 = v2_f;
}


function collision(w1, o1, w2, o2){
    if ((o1.position.x + (w1/2)) >= (o2.position.x - (w2/2)) && (o1.position.x + (w1/2)) <= (o2.position.x + (w2/2))){
        return true;
    }
    if ((o1.position.x - (w1/2)) <= (o2.position.x + (w2/2)) && (o1.position.x - (w1/2)) >= (o2.position.x - (w2/2))  ){
        return true;
    }
    return false;
}



function update_physics(delta){
    // calculate physics
    if(collision(cartWidth, cart, wallWidth, wall)){
        //solveCollision(cart, wall);
        v *= -1;
    }
    if(collision(cartWidth, cart, wallWidth, wallLeft)){
        //solveCollision(cart, wall);
        v *= -1; 
    }
    if(collision(cartWidth, cart2, wallWidth, wall)){
        //solveCollision(cart, wall);
        v2 *= -1;
    }
    if(collision(cartWidth, cart2, wallWidth, wallLeft)){
        //solveCollision(cart, wall);
        v2 *= -1;
    }
    if(collision(cartWidth, cart2, cartWidth, cart)){
        //solveCollision(cart, wall);
        resolveCartCollision(cart, cart2);
        console.log("v: " + v+ ", v2: " + v2);
    }
    cart.position.x += v * delta;
    cart2.position.x += v2 * delta;
    
}

function getSliderValues(){
    m1 = parseFloat(mass1_slider.value);
    m2 = parseFloat(mass2_slider.value);
}

const physicsSubsteps = 4;
function animate() {
    
   getSliderValues();

    const delta = clock.getDelta();

    const subDelta = delta/physicsSubsteps;
    for (let index = 0; index < physicsSubsteps; index++) {
        update_physics(subDelta);
    }

    renderer.render( scene, camera );
}


renderer.setAnimationLoop(animate);
// Lines
// const lineMaterial = new THREE.LineBasicMaterial({color : 0x0000ff});

// const points = [];
// points.push( new THREE.Vector3(-10, 0, 0));
// points.push( new THREE.Vector3(0, 10, 0));
// points.push( new THREE.Vector3(10, 0, 0));

// const geometry = new THREE.BufferGeometry().setFromPoints(points);

// const line = new THREE.Line(geometry, lineMaterial);
// scene.add(line);
// renderer.render(scene, camera);

// if(WebGL.isWebGL2Available()){
//     animate()
// }
// else{
//     const warning = WebGL.getWebGL2ErrorMessage();
//     document.getElementById('container').appendChild(warning)
// }