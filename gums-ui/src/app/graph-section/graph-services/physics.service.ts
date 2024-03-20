import { Injectable } from "@angular/core";
import { Element } from "./graph.datamodel";
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {

  clock = new THREE.Clock();

  MAX_DISTANCE = 30;

  TIME_DILATION = 1;

  computeNewPosition(elements: Element[]) {
    let dt = this.clock.getDelta() * this.TIME_DILATION;
    for (let element of elements) {

      let pos = element.nativeObject.position;
      let dPos = new THREE.Vector3(1, 1, 1);

      element.speed = this.getTotalForce(element, elements);

      dPos.multiply(element.speed);   //dPos *= dt*speed;
      dPos.multiplyScalar(dt);
      pos.add(dPos);
      element.nativeObject.position.set(pos.x, pos.y, pos.z);
    }
  }

  private getTotalForce(element: Element, elements: Element[]): THREE.Vector3 {
    let totalForce = new THREE.Vector3(0, 0, 0);
    for (let otherElement of elements) {
      if (element.nativeObject.id !== otherElement.nativeObject.id) {
        const distance = element.nativeObject.position.distanceTo(otherElement.nativeObject.position);
        const forceIntensity = this.getRepulsiveForce(distance);
        const force = new THREE.Vector3(0, 0, 0);
        force.subVectors(element.nativeObject.position, otherElement.nativeObject.position);
        force.normalize();
        force.multiplyScalar(forceIntensity);
        totalForce.add(force);
      }
    }
    return totalForce;
  }

  private getRepulsiveForce(distance) {
    if (distance > this.MAX_DISTANCE) {
      return 0;
    } else {
      return Math.exp(1 / (distance * distance));
    }
  }
}