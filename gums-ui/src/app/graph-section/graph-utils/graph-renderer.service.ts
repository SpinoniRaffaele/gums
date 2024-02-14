import { Injectable } from "@angular/core";
import { GraphState } from "../graph.reducer";
import { Element, ElementType, User } from "./graph.datamodel";
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
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

  raycaster;

  pointer;

  elements = [];

  intersected;

  labelRenderer;

  readonly USER_COLOR = 0xff0000;

  readonly INITIAL_CUBE_SIZE = 10;

  readonly WIDTH_PERCENTAGE = 0.75;

  constructor(private readonly physicsService: PhysicsService) {}

  renderGraph(graphState: GraphState) {
    this.addRandomUsers(graphState.users);
  }

  renderNewUsers(users: User[]) {
    this.addRandomUsers(users);
  }

  initializeScene(domElementRenderer) {
    this.initializeRenderer(domElementRenderer);
    this.initializeLabelRenderer(domElementRenderer);

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(52,58,69)");

    this.initializeCamera();

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    this.scene.add( light );

    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    window.addEventListener( 'pointermove', (event) => {
      this.pointer.x = ((event.clientX - (window.innerWidth * (1 - this.WIDTH_PERCENTAGE))) / (window.innerWidth * this.WIDTH_PERCENTAGE)) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    });

    const orbit = new OrbitControls(this.camera, this.labelRenderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      this.render();
    }
    animate();
  }

  private initializeRenderer(domElementRenderer) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth * this.WIDTH_PERCENTAGE, window.innerHeight);
    domElementRenderer.appendChild(this.renderer.domElement);
  }

  private initializeLabelRenderer(domElementRenderer) {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize( window.innerWidth * this.WIDTH_PERCENTAGE, window.innerHeight );
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    domElementRenderer.appendChild( this.labelRenderer.domElement );
  }

  private initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth * this.WIDTH_PERCENTAGE / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;
  }

  private render() {
    this.physicsService.computeNewPosition(this.elements, this.clock);
    this.updateRaycaster();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render( this.scene, this.camera );
  }

  private addRandomUsers(users: User[]) {
    for (let user of users) {
      const particleGeometry = new THREE.SphereGeometry(1, 20, 20);
      const particleMaterial = new THREE.MeshStandardMaterial({color: this.generateRandomColor()});
      const userNativeElement = new THREE.Mesh(particleGeometry, particleMaterial);
      userNativeElement.position.x = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;
      userNativeElement.position.y = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;
      userNativeElement.position.z = Math.random() * this.INITIAL_CUBE_SIZE - this.INITIAL_CUBE_SIZE / 2;

      this.addUser2DLabel(user.name, userNativeElement);

      this.scene.add(userNativeElement);
      this.elements.push(new Element(userNativeElement, ElementType.USER, new THREE.Vector3(0, 0, 0), user.id));
    }
  }

  private updateRaycaster() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    if (this.intersected) {
      this.intersected.material.emissive.setHex(0x000000);
    }
    if (intersects.length > 0) {
      this.intersected = intersects[0].object;
      intersects[0].object.material.emissive.setHex(0x858585);
    }
  }
  
  private generateRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  private addUser2DLabel(labelContent, userNativeElement) {
    const userNameDiv = document.createElement( 'div' );
    userNameDiv.className = 'label';
    userNameDiv.textContent = labelContent;
    userNameDiv.style.backgroundColor = 'transparent';
    const userNameLabel = new CSS2DObject( userNameDiv );
    userNameLabel.position.set( userNativeElement.position.x, userNativeElement.position.y, userNativeElement.position.z );
    userNameLabel.center.set( 0, 0 );
    userNativeElement.add( userNameLabel );
  }
}