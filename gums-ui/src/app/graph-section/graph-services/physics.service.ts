import { Injectable } from "@angular/core";
import { Element } from "./graph.datamodel";
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {

  clock = new THREE.Clock();

  MAX_DISTANCE = 24;

  MIN_DISTANCE = 12;

  TIME_DILATION = 1;

  computeNewPosition(elements: Element[], lines: Map<string, {ownerId: string, nativeObject: THREE.Line}>) {
    let dt = this.clock.getDelta() * this.TIME_DILATION;
    for (let element of elements) {

      let pos = element.nativeObject.position;
      let dPos = new THREE.Vector3(1, 1, 1);

      element.speed = this.getTotalForce(element, elements, lines);

      dPos.multiply(element.speed);   //dPos *= dt*speed;
      dPos.multiplyScalar(dt);
      pos.add(dPos);
      element.nativeObject.position.set(pos.x, pos.y, pos.z);
    }
  }

  private getTotalForce(element: Element, elements: Element[],
                        lines: Map<string, {ownerId: string, nativeObject: THREE.Line}>): THREE.Vector3 {
    let totalForce = new THREE.Vector3(0, 0, 0);
    for (let otherElement of elements) {
      if (element.nativeObject.id !== otherElement.nativeObject.id) {
        const distance = element.nativeObject.position.distanceTo(otherElement.nativeObject.position);
        if (distance < this.MAX_DISTANCE) {
          const forceIntensity = this.areAttracted(element, otherElement, lines) ?
              this.getAttractiveForce(distance) : this.getRepulsiveForce(distance);
          const force = new THREE.Vector3(0, 0, 0);
          force.subVectors(element.nativeObject.position, otherElement.nativeObject.position);
          force.normalize();
          force.multiplyScalar(forceIntensity);
          totalForce.add(force);
        }
      }
    }
    return totalForce;
  }

  private areAttracted(element: Element, otherElement: Element,
                       lines: Map<string, {ownerId: string, nativeObject: THREE.Line}>): boolean {
    return lines.get(element.id)?.ownerId === otherElement.id || lines.get(otherElement.id)?.ownerId === element.id;
  }

  private getRepulsiveForce(distance) {
    return Math.exp(1 / (distance * 0.1)) - 1;
  }

  private getAttractiveForce(distance) {
      return 1 - distance / this.MIN_DISTANCE;
  }
}