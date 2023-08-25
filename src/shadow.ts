import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const $Container = document.getElementById('webgl-container');

class App {
  private container: HTMLElement | null;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private model: THREE.Object3D | void;

  private light: THREE.SpotLight;

  private lightHelper: THREE.SpotLightHelper;

  constructor() {
    this.container = $Container;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    $Container?.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    this.camera = this.setupCamera();
    this.light = this.setupLight();
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

    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  private setupLight() {
    const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
    auxLight.position.set(0, 5, 0);
    auxLight.target.position.set(0, 0, 0);
    this.scene.add(auxLight.target);
    this.scene.add(auxLight);

    // const light = new THREE.DirectionalLight(0xffffff, 0.5);
    // light.position.set(0, 5, 0);
    // light.target.position.set(0, 0, 0);
    // light.shadow.camera.top = 6;
    // light.shadow.camera.right = 6;
    // light.shadow.camera.bottom = -6;
    // light.shadow.camera.left = -6;
    const light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(0, 5, 0);
    light.target.position.set(0, 0, 0);
    light.angle = THREE.MathUtils.degToRad(30);
    light.castShadow = true;

    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 1;

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    this.scene.add(cameraHelper);

    this.scene.add(light.target);
    this.scene.add(light);

    return light;
  }

  private setupModel() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.receiveShadow = true;
    this.scene.add(ground);

    const bigSphereGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 65, 2, 3);
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: '#fffff',
      roughness: 0.1,
      metalness: 0.2,
    });

    const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    // bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
    bigSphere.position.y = 1.6;
    bigSphere.receiveShadow = true;
    bigSphere.castShadow = true;
    this.scene.add(bigSphere);

    const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: '#9b59b6',
      roughness: 0.5,
      metalness: 0.9,
    });

    for (let i = 0; i < 8; i++) {
      const torusPivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      torusPivot.add(torus);
      torus.castShadow = true;
      torus.receiveShadow = true;
      this.scene.add(torusPivot);
    }

    const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const smallSphereMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.2,
      metalness: 0.5,
    });

    const smallSpherePivot = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
    smallSpherePivot.add(smallSphere);
    smallSpherePivot.name = 'smallSpherePivot';
    smallSphere.position.set(3, 0.5, 0);
    smallSphere.receiveShadow = true;
    smallSphere.castShadow = true;
    this.scene.add(smallSpherePivot);
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

  update(time = 0) {
    const secondUint = time * 0.001;

    const smallSpherePivot = this.scene.getObjectByName('smallSpherePivot');

    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(secondUint * 50);

      if (this.light) {
        const smallSphere = smallSpherePivot.children[0];
        smallSphere.getWorldPosition(this.light.target.position);

        // if (this.lightHelper) this.lightHelper.update();
      }
    }
  }
}

window.addEventListener('load', () => {
  new App();
});
