import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup

const scene = new THREE.Scene();
let cloudParticles = [], flash, rain, rainGeo, rainCount = 10000;

const camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;


// Lights
const ambient = new THREE.AmbientLight(0x555555);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0,0,1);
scene.add(directionalLight);

flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
flash.position.set(200,300,100);
scene.add(flash);

// Render
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
scene.fog = new THREE.FogExp2(0x11111f, 0.002);
renderer.setClearColor(scene.fog.color);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Rain
const vertex = new THREE.Vector3();
rainGeo = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < rainCount; i++) {
    vertices.push(
        Math.random() * 120 - 60,
        Math.random() * 180 - 80,
        Math.random() * 130 - 60
    );
}
rainGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true
});
rain = new THREE.Points(rainGeo,rainMaterial);
scene.add(rain);


// Nube
let loader = new THREE.TextureLoader();
loader.load("smoke.png", function(texture){
    const cloudGeo = new THREE.PlaneBufferGeometry(500,500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
    });

    for(let p=0; p<25; p++) {
        let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
        cloud.position.set(
            Math.random()*800 -400,
            500,
            Math.random()*500 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random()*360;
        cloud.material.opacity = 0.6;
        cloudParticles.push(cloud);
        scene.add(cloud);
    }
    animate();
});



// const controls = new OrbitControls(camera, renderer.domElement);


// Scroll Animation
//function moveCamera() {
//    const t = document.body.getBoundingClientRect().top;
//    camera.position.z = t * -0.01;
//    camera.position.x = t * -0.0002;
//    camera.rotation.y = t * -0.0002;
//}
//
//document.body.onscroll = moveCamera;
//moveCamera();


function rainVariation() {
    let positionAttribute = rain.geometry.getAttribute( 'position' );
    for ( let i = 0; i < positionAttribute.count; i ++ ) {
        vertex.fromBufferAttribute( positionAttribute, i );
        vertex.y -= 1;
        if (vertex.y < - 60) {
            vertex.y = 90;
        }
        positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z );
    }
    positionAttribute.needsUpdate = true;
}

// Animation Loop
function animate() {
    cloudParticles.forEach(p => {
        p.rotation.z -=0.002;
    });

    // Animacion LLuvia
    rainVariation();


    rain.rotation.y +=0.002;
    if(Math.random() > 0.93 || flash.power > 100) {
        if(flash.power < 100)
            flash.position.set(
                Math.random()*400,
                300 + Math.random() *200,
                100
            );
        flash.power = 50 + Math.random() * 500;
    }


    camera.position.y += 0.3;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

