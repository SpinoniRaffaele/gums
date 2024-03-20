import { Injectable } from "@angular/core";
import { selectSelectedElement } from "../graph.reducer";
import {
  ANIMATION_DURATION,
  Element,
  ElementType,
  INITIAL_CUBE_SIZE,
  Project,
  RELATIVE_DISTANCE_AFTER_FOCUS,
  User,
  WIDTH_PERCENTAGE
} from "./graph.datamodel";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PhysicsService } from "./physics.service";
import gsap from "gsap";
import { Store } from '@ngrx/store';
import { SelectElementCompleted, UnselectElementCompleted } from '../graph.action';
import { LabelHelperService } from './label-helper.service';

@Injectable({
  providedIn: 'root'
})
export class GraphRendererService {

  renderer;

  scene;

  camera;

  raycaster;

  pointer;

  elements: Element[] = [];

  intersected;

  labelRenderer;

  pointedObject = undefined;

  orbit;

  isFocusedOnElement = false;

  constructor(private readonly physicsService: PhysicsService,
              private readonly store: Store,
              private labelHelperService: LabelHelperService
  ) {
    this.store.select(selectSelectedElement).subscribe((selected) => {
      if (!selected.element) {
        this.labelHelperService.displayAllLabels();
      }
      this.isFocusedOnElement = !!selected.element;
    });
  }

  renderNewProjects(projects: Project[]) {
    this.addRandomPositionElement(projects, ElementType.PROJECT);
  }

  renderNewUsers(users: User[]) {
    this.addRandomPositionElement(users, ElementType.USER);
  }

  renderElementUpdate(id: string, name: string) {
    const element = this.elements.find((element: Element) => element.id === id);
    this.labelHelperService.updateElementLabel(name, element.nativeObject);
  }

  renderElementDelete(id: string) {
    const element = this.elements.find((element: Element) => element.id === id);
    this.scene.remove(element.nativeObject);
    this.labelHelperService.deleteLabelById(id);
    this.elements = this.elements.filter((element: Element) => element.id !== id);
  }

  initializeScene(domElementRenderer) {
    this.initializeRenderer(domElementRenderer);
    this.labelRenderer = this.labelHelperService.initializeLabelRenderer(domElementRenderer);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(52,58,69)");
    this.initializeCamera();
    this.initializeLights();
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.createMouseMovementListener();
    this.createFocusClickEventListener();
    this.initializeOrbitAndHisListeners();
    const animate = () => {
      requestAnimationFrame(animate);
      this.render();
    }
    animate();
  }

  private initializeOrbitAndHisListeners() {
    this.orbit = new OrbitControls(this.camera, this.labelRenderer.domElement);
    this.orbit.addEventListener('change', () => {
      if (this.isFocusedOnElement) {
        this.store.dispatch(UnselectElementCompleted());
      }
    });
  }

  private initializeRenderer(domElementRenderer) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth * WIDTH_PERCENTAGE, window.innerHeight);
    domElementRenderer.appendChild(this.renderer.domElement);
  }

  private createMouseMovementListener() {
    window.addEventListener( 'pointermove', (event) => {
      const actualX = event.clientX - (window.innerWidth * (1 - WIDTH_PERCENTAGE));
      this.pointer.x = (actualX / (window.innerWidth * WIDTH_PERCENTAGE)) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    });
  }

  private initializeLights() {
    const light = new THREE.DirectionalLight( 0xcccccc, 3 );
    this.scene.add( light );
    const ambientLight = new THREE.AmbientLight( 0xbbbbbb );
    this.scene.add( ambientLight );
  }

  private initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth * WIDTH_PERCENTAGE / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    window.addEventListener( 'resize', () => {
      this.camera.aspect = window.innerWidth * WIDTH_PERCENTAGE / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth * WIDTH_PERCENTAGE, window.innerHeight);
      this.labelRenderer.setSize(window.innerWidth * WIDTH_PERCENTAGE, window.innerHeight);
    });
  }

  private render() {
    this.physicsService.computeNewPosition(this.elements);
    this.updateRaycaster();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render( this.scene, this.camera );
  }

  private addRandomPositionElement(elements: Project[] | User[], type: ElementType) {
    for (let element of elements) {
      const geometry = type === ElementType.USER ? new THREE.CapsuleGeometry(2, 2, 40, 40) :
          new THREE.OctahedronGeometry(2);
      const material = new THREE.MeshStandardMaterial({
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
      });
      const nativeElement = new THREE.Mesh(geometry, material);
      nativeElement.position.x = Math.random() * INITIAL_CUBE_SIZE - INITIAL_CUBE_SIZE / 2;
      nativeElement.position.y = Math.random() * INITIAL_CUBE_SIZE - INITIAL_CUBE_SIZE / 2;
      nativeElement.position.z = Math.random() * INITIAL_CUBE_SIZE - INITIAL_CUBE_SIZE / 2;

      this.labelHelperService.addElement2DLabel(element.name, element.id, nativeElement);

      this.scene.add(nativeElement);
      this.elements.push(
          new Element(nativeElement, type, new THREE.Vector3(0, 0, 0), element.id));
    }
  }

  private updateRaycaster() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.isFocusedOnElement) {
      const intersects = this.raycaster.intersectObjects(this.scene.children, false);
      this.pointedObject = undefined;
      if (this.intersected) {
        this.intersected.material.emissive.setHex(0x000000);
      }
      if (intersects.length > 0) {
        this.pointedObject = intersects[0].object;
        this.intersected = intersects[0].object;
        intersects[0].object.material.emissive.setHex(0x432063);
      }
    }
  }

  private createFocusClickEventListener() {
    window.addEventListener('click', (_) => {
      if (this.pointedObject && !this.isFocusedOnElement) {
        const id = this.pointedObject.id;
        const aabb = new THREE.Box3().setFromObject( this.pointedObject );
        const center = aabb.getCenter( new THREE.Vector3() );

        gsap.to( this.camera.position, {
          duration: ANIMATION_DURATION,
          x: center.x * RELATIVE_DISTANCE_AFTER_FOCUS,
          y: center.y * RELATIVE_DISTANCE_AFTER_FOCUS,
          z: center.z * RELATIVE_DISTANCE_AFTER_FOCUS,
          onUpdate: () => {
            this.orbit.update();
          },
          onComplete: () => {
            this.orbit.update();
            const selectedElement = this.elements.find((element: Element) => element.nativeObject.id === id);
            if (selectedElement) {
              this.store.dispatch(SelectElementCompleted({selectedId: selectedElement.id}));
              this.labelHelperService.hideAllLabels();
            }
          }
        });
      }
    });
  }
}