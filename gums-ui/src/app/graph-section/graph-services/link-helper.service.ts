import { Injectable } from '@angular/core';
import { Element, Project } from './graph.datamodel';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class LinkHelperService {

  lines: Map<string, {ownerId: string, nativeObject: THREE.Line}> = new Map();

  createLinkFromProjectsToOwners(projects: Project[], elements: Element[], scene) {
    for (let project of projects) {
      const points = [
        elements.find((element: Element) => element.id === project.id)?.nativeObject.position,
        elements.find((element: Element) => element.id === project.ownerId)?.nativeObject.position
      ];
      if (!points[0] || !points[1]) {
        return;
      }
      const material = new THREE.LineBasicMaterial({color: 0xffffff});
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      this.lines.set(project.id, {ownerId: project.ownerId, nativeObject: line});
    }
  }

  updateLinkPositions(elements: Element[]) {
    for (let line of this.lines.entries()) {
      const projectPosition = elements.find((element: Element) => element.id === line[0])
          ?.nativeObject.position;
      const ownerPosition = elements.find((element: Element) => element.id === line[1].ownerId)
          ?.nativeObject.position;
      line[1].nativeObject?.geometry.setFromPoints([projectPosition, ownerPosition]);
    }
  }

  updateLinkTargets(elements: Element[], id: string, ownerId: string, scene) {
    if (!ownerId) return;
    const ownerPosition = elements.find((element: Element) => element.id === ownerId)
        ?.nativeObject.position;
    if (!ownerPosition) return;
    if (this.lines.has(id)) {
      scene.remove(this.lines.get(id).nativeObject);
      this.lines.delete(id);
    }
    const material = new THREE.LineBasicMaterial({color: 0xffffff});
    const geometry = new THREE.BufferGeometry().setFromPoints([
      elements.find((element: Element) => element.id === id).nativeObject.position,
      ownerPosition
    ]);
    const line = new THREE.Line(geometry, material);
    this.lines.set(id, {ownerId: ownerId, nativeObject: line});
    scene.add(line);
  }

  deleteLinks(id: string, scene) {
    for (let entry of this.lines.entries()) {
      if (entry[0] === id || entry[1].ownerId === id) {
        scene.remove(entry[1].nativeObject);
        this.lines.delete(entry[0]);
      }
    }
  }

  deleteAllLinks(scene) {
    for (let entry of this.lines.entries()) {
      scene.remove(entry[1].nativeObject);
    }
    this.lines.clear();
  }
}
