import * as THREE from 'three';

const $Container = document.getElementById('webgl-container');

class App {
  private container: HTMLElement | null;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private model: {
    solarSystem: THREE.Object3D;
    earthOrbit: THREE.Object3D;
    moonOrbit: THREE.Object3D;
  };

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

    camera.position.z = 20;

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
    const solarSystem = new THREE.Object3D();
    this.scene.add(solarSystem);

    const sphereGeometry = new THREE.SphereGeometry(1, 12, 12);

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00, flatShading: true });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(3, 3, 3);
    solarSystem.add(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      flatShading: true,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
      flatShading: true,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    return {
      solarSystem,
      earthOrbit,
      moonOrbit,
    };
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
    const { solarSystem, earthOrbit, moonOrbit } = this.model;

    solarSystem.rotation.y = secondUnit / 2;
    earthOrbit.rotation.y = secondUnit * 2;
    moonOrbit.rotation.y = secondUnit * 5;
  }
}

window.addEventListener('load', () => {
  new App();
});
