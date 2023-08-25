import * as THREE from 'three';

const $Container = document.getElementById('webgl-container');

class App {
  private container: HTMLElement | null;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private model: THREE.Mesh;

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

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  private setupCamera() {
    const width = this.container?.clientWidth ?? 0;
    const height = this.container?.clientHeight ?? 0;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

    camera.position.z = 2;

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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    return cube;
  }

  resize() {
    const width = this.container?.clientWidth ?? 0;
    const height = this.container?.clientHeight ?? 0;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  render(time: number) {
    this.renderer.render(this.scene, this.camera);
    this.update(time);

    requestAnimationFrame(this.render.bind(this));
  }

  update(time: number) {
    const secondUnit = time * 0.001;

    this.model.rotation.x = secondUnit;
    this.model.rotation.y = secondUnit;
  }
}

window.addEventListener('load', () => {
  new App();
});
