import { LinkHelperService } from './link-helper.service';
import { Project, Element } from './graph.datamodel';
import * as THREE from 'three';

describe('LinkHelperService', () => {
  let service = new LinkHelperService();

  it('should create link from project to owner', () => {
    const projects = [{id: '1', ownerId: '2'} as Project];
    const elements = [{id: '1', nativeObject: {position: {x: 1, y: 1, z: 1}}},
                      {id: '2', nativeObject: {position: {x: 2, y: 2, z: 2}}}] as Element[];
    const scene = {add: jest.fn()};
    service.createLinkFromProjectsToOwners(projects, elements, scene);
    expect(service.lines.get('1')).toBeDefined();
    expect(service.lines.get('1').ownerId).toBe('2');
    expectPosition();
    expect(scene.add).toHaveBeenCalled();
  });

  it('should update link positions', () => {
    const elements = [{id: '1', nativeObject: {position: {x: 1, y: 1, z: 1}}},
                  {id: '2', nativeObject: {position: {x: 2, y: 2, z: 2}}}] as Element[];
    service.lines.set('1', {
      ownerId: '2',
      nativeObject: new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial())
    });
    service.updateLinkPositions(elements);
    expectPosition();
  });

  it('should update link targets', () => {
    const elements = [{id: '1', nativeObject: {position: {x: 1, y: 1, z: 1}}},
                  {id: '2', nativeObject: {position: {x: 2, y: 2, z: 2}}}] as Element[];
    service.lines.set('1', {
      ownerId: '2',
      nativeObject: new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial())
    });
    service.updateLinkTargets(elements, '1', '2', {add: jest.fn(), remove: jest.fn()});
    expectPosition();
  });

  it('should delete links', () => {
    const scene = {remove: jest.fn()};
    service.lines.set('1', {
      ownerId: '2',
      nativeObject: new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial())
    });
    service.deleteLinks('1', scene);
    expect(scene.remove).toHaveBeenCalled();
    expect(service.lines.get('1')).toBeUndefined();
  });

  function expectPosition() {
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['0'])
        .toEqual(1);
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['1'])
        .toEqual(1);
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['2'])
        .toEqual(1);
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['3'])
        .toEqual(2);
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['4'])
        .toEqual(2);
    expect(service.lines.get('1').nativeObject.geometry.getAttribute('position').array['5'])
        .toEqual(2);
  }
});
