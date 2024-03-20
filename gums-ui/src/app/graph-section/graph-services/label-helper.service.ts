import { Injectable } from '@angular/core';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { WIDTH_PERCENTAGE } from './graph.datamodel';

@Injectable({
  providedIn: 'root'
})
export class LabelHelperService {
  elementLabelDivsById = new Map<string, any>();
  constructor() {}

  initializeLabelRenderer(domElementRenderer) {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth * WIDTH_PERCENTAGE, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.color = 'white';
    domElementRenderer.appendChild(labelRenderer.domElement);
    return labelRenderer;
  }

  addElement2DLabel(labelContent, id, userNativeElement) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'text';
    labelDiv.textContent = labelContent;
    this.styleElementLabel(labelDiv);
    this.elementLabelDivsById.set(id, labelDiv);
    const label = new CSS2DObject(labelDiv);
    label.position.set(userNativeElement.position.x, userNativeElement.position.y, userNativeElement.position.z);
    label.center.set(0, 0);
    userNativeElement.add(label);
  }

  displayAllLabels() {
    this.elementLabelDivsById.forEach((div) => {div.style.opacity = '1';});
  }

  hideAllLabels() {
    this.elementLabelDivsById.forEach((div) => {div.style.opacity = '0';});
  }

  deleteLabelById(id: string) {
    this.elementLabelDivsById.delete(id)
  }

  updateElementLabel(labelContent, userNativeElement) {
    userNativeElement.children[0].element.textContent = labelContent;
  }

  private styleElementLabel(usernameDiv: HTMLElement) {
    usernameDiv.style.backgroundColor = 'rgba(12, 12, 12, 0.5)';
    usernameDiv.style.padding = '5px';
    usernameDiv.style.borderRadius = '5px';
  }
}