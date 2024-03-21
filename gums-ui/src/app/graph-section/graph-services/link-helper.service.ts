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
          .nativeObject.position;
      const ownerPosition = elements.find((element: Element) => element.id === line[1].ownerId)
          .nativeObject.position;
      line[1].nativeObject.geometry.setFromPoints([projectPosition, ownerPosition]);
    }
  }

  updateLinkTargets(elements: Element[], id: string, ownerId: string) {
    const line = this.lines.get(id);
    if (!line || !ownerId) return;
    const ownerPosition = elements.find((element: Element) => element.id === ownerId)
        ?.nativeObject.position;
    if (!ownerPosition) return;
    line.nativeObject.geometry.setFromPoints([
        elements.find((element: Element) => element.id === id).nativeObject.position,
      ownerPosition
    ]);
    this.lines.set(id, {ownerId: ownerId, nativeObject: line.nativeObject});
  }

  deleteLinks(id: string, scene) {
    for (let entry of this.lines.entries()) {
      if (entry[0] === id || entry[1].ownerId === id) {
        scene.remove(entry[1].nativeObject);
        this.lines.delete(entry[0]);
      }
    }
  }
}
