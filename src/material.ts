import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const $Container = document.getElementById('webgl-container');

class App {
  private container: HTMLElement | null;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private model: THREE.Object3D;

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

  private setupControls() {
    new OrbitControls(this.camera, this.container as HTMLElement);
  }

  private setupCamera() {
    const width = this.container?.clientWidth ?? 0;
    const height = this.container?.clientHeight ?? 0;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

    camera.position.z = 3;

    return camera;
  }

  private setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.scene.add(light);
  }

  private setupModel() {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      emissive: 0x00000,
      roughness: 1,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      wireframe: false,
      flatShading: false,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    box.position.set(-1, 0, 0);
    this.scene.add(box);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
    sphere.position.set(1, 0, 0);
    this.scene.add(sphere);
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
    // this.update(time);

    requestAnimationFrame(this.render.bind(this));
  }

  // update(time: number) {
  //   const secondUnit = time * 0.001;
  // }
}

window.addEventListener('load', () => {
  new App();
});
