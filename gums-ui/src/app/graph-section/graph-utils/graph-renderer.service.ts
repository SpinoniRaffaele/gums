import { Injectable } from "@angular/core";
import { GraphState } from "../graph.reducer";
import { Element, ElementType, User } from "./graph.datamodel";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PhysicsService } from "./physics.service";

@Injectable({
  providedIn: 'root'
})
export class GraphRendererService {

  renderer;

  scene;

  camera;

  clock;

  elements = [];

  readonly USER_COLOR = 0xff0000;

  readonly INITIAL_CUBE_SIZE = 10;

  readonly WIDTH_PERCENTAGE = 0.75;

  constructor(private readonly physicsService: PhysicsService) {}

  renderGraph(graphState: GraphState) {
    this.addRandomUsers(graphState.users);
  }

  initializeScene(domElementRenderer) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth * this.WIDTH_PERCENTAGE, window.innerHeight);
    domElementRenderer.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(52,58,69)");
    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth * this.WIDTH_PERCENTAGE / window.innerHeight,
        0.1,
        1000
    );
    this.camera.position.z = 50;
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);

    const animate = () => {
      this.physicsService.computeNewPosition(this.elements, this.clock);

      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }

    animate();
  }

  addRandomUsers(users: User[]) {
    for (let user of users) {
      const particleGeometry = new THREE.SphereGeometry(1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({color: this.generateRandomColor()});
      const userNativeElement = new THREE.Mesh(particleGeometry, particleMaterial);
      userNativeElement.position.x = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;
      userNativeElement.position.y = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;
      userNativeElement.position.z = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;
      this.scene.add(userNativeElement);
      this.elements.push(new Element(userNativeElement, ElementType.USER, new THREE.Vector3(0, 0, 0), user.id));
    }
  }
  
  generateRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
}