import { LabelHelperService } from './label-helper.service';

describe('LabelHelperService', () => {
  const labelHelperService = new LabelHelperService();

  it('should initialize the render correctly', () => {
    const parentDiv = document.createElement('div');
    const result = labelHelperService.initializeLabelRenderer(parentDiv);
    expect(result.getSize()).toEqual({"width": expect.anything(), "height": expect.anything()});
    expect(parentDiv.children.length).toBe(1);
  });

  it('should correctly add labels', () => {
    const labelContent = 'test';
    const id = '1';
    const userNativeElement = {
      position: {x: 0, y: 0, z: 0},
      add: jest.fn()
    };
    jest.spyOn(userNativeElement, 'add');

    labelHelperService.addElement2DLabel(labelContent, id, userNativeElement);
    expect(userNativeElement.add).toHaveBeenCalled();
    expect(labelHelperService.elementLabelDivsById.get(id)).toBeDefined();
  });

  it('should correctly display all labels', () => {
    const div = document.createElement('div');
    labelHelperService.elementLabelDivsById.set('1', div);
    labelHelperService.displayAllLabels();
    expect(div.style.opacity).toBe('1');
  });

  it('should correctly hide all labels', () => {
    const div = document.createElement('div');
    labelHelperService.elementLabelDivsById.set('1', div);
    labelHelperService.hideAllLabels();
    expect(div.style.opacity).toBe('0');
  });

  it('should correctly delete label', () => {
    const div = document.createElement('div');
    labelHelperService.elementLabelDivsById.set('1', div);
    labelHelperService.deleteLabelById('1');
    expect(labelHelperService.elementLabelDivsById.get('1')).toBeUndefined();
  });

  it('should correctly update label', () => {
    const userNativeElement = {
      children: [{element: {textContent: "old"}}]
    };
    labelHelperService.updateElementLabel('new', userNativeElement);
    expect(userNativeElement.children[0].element.textContent).toBe('new');
  });
});