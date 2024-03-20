import { PhysicsService } from './physics.service';
import { Element, ElementType } from './graph.datamodel';
import * as THREE from 'three';

describe('PhysicsService', () => {
  const physicsService = new PhysicsService();

  it('should stay in the same position if only one element is present', function () {
    const elements: Element[] = [{
        type: ElementType.USER,
        id: "1",
        nativeObject: {
          position: new THREE.Vector3(1, 1, 1),
          id: '1'
        },
        speed: new THREE.Vector3(1, 1, 1)
      }];
    physicsService.computeNewPosition(elements);
    expect(elements[0].nativeObject.position).toEqual(new THREE.Vector3(1, 1, 1));
  });

  it('should move the elements if multiple elements are present', function () {
    physicsService.clock = { getDelta: () => 1 } as any;
    const elements: Element[] = [{
        type: ElementType.USER,
        id: "1",
        nativeObject: {
          position: new THREE.Vector3(1, 1, 1),
          id: '1'
        },
        speed: new THREE.Vector3(0, 0, 0)
      },
      {
        type: ElementType.USER,
        id: "2",
        nativeObject: {
          position: new THREE.Vector3(2, 2, 2),
          id: '2'
        },
        speed: new THREE.Vector3(0, 0, 0)
      }];
    physicsService.computeNewPosition(elements);
    expect(elements[0].nativeObject.position).not.toEqual(new THREE.Vector3(1, 1, 1));
    expect(elements[0].nativeObject.position.x < 1).toBeTruthy();
    expect(elements[0].nativeObject.position.y < 1).toBeTruthy();
    expect(elements[0].nativeObject.position.z < 1).toBeTruthy();
    expect(elements[1].nativeObject.position).not.toEqual(new THREE.Vector3(2, 2, 2));
  });
});