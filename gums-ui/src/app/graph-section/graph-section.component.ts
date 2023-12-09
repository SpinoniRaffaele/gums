import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Component({
  selector: 'app-graph-section',
  templateUrl: './graph-section.component.html',
  styleUrls: ['./graph-section.component.scss']
})
export class GraphSectionComponent implements OnInit {

  renderer;

  scene;

  camera;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    const domElementRenderer = document.getElementById("3d-renderer");
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    domElementRenderer.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("rgb(44,45,57)");
    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xFFAA00});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.scene.add(box);
    this.camera.position.z = 5;
    const animate = () => {
      requestAnimationFrame(animate);

      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }
}
