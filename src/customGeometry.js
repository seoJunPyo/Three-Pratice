import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const $Container = document.getElementById('webgl-container');
class App {
    container;
    renderer;
    scene;
    camera;
    model;
    constructor() {
        this.container = $Container;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        $Container?.appendChild(renderer.domElement);
        this.renderer = renderer;
        const scene = new THREE.Scene();
        this.scene = scene;
        this.camera = this.setupCamera();
        this.setupLight();
        this.model = this.setupModel();
        this.setupControls();
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
        requestAnimationFrame(this.render.bind(this));
    }
    setupControls() {
        new OrbitControls(this.camera, this.container);
    }
    setupCamera() {
        const width = this.container?.clientWidth ?? 0;
        const height = this.container?.clientHeight ?? 0;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        camera.position.z = 2;
        return camera;
    }
    setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }
    setupModel() {
        const rawPositions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
        const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
        const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
        const positions = new Float32Array(rawPositions);
        const normals = new Float32Array(rawNormals);
        const color = new Float32Array(rawColors);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
        geometry.setIndex([0, 1, 2, 2, 1, 3]);
        const material = new THREE.MeshPhongMaterial({ color: 'white', vertexColors: true });
        const box = new THREE.Mesh(geometry, material);
        this.scene.add(box);
        const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        this.scene.add(helper);
    }
    resize() {
        const width = this.container?.clientWidth ?? 0;
        const height = this.container?.clientHeight ?? 0;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}
window.addEventListener('load', () => {
    new App();
});
